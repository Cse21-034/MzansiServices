# Quick Start: Subscription System Implementation

## Files Created

### Core System Files
- **`src/lib/paygate.ts`** - PayGate payment gateway integration
- **`src/lib/subscription-access.ts`** - Feature access control and tier definitions
- **`src/middleware/subscription-access.ts`** - Middleware for enforcing limits

### API Routes
- **`src/app/api/subscriptions/checkout/route.ts`** - Initiate PayGate checkout
- **`src/app/api/subscriptions/callback/route.ts`** - Handle PayGate payment callback
- **`src/app/api/subscriptions/status/route.ts`** - Get subscription status
- **`src/app/api/subscriptions/cancel/route.ts`** - Cancel subscription

### UI Components
- **`src/app/subscription/SubscriptionPlans.tsx`** - Display all 3 packages
- **`src/app/subscription/SubscriptionManagement.tsx`** - Manage active subscription
- **`src/app/subscription/PaymentSuccess.tsx`** - Payment status page

### Page Routes
- **`src/app/business/[businessId]/subscription/plans/page.tsx`** - Plans listing page
- **`src/app/business/[businessId]/subscription/page.tsx`** - Management page
- **`src/app/business/[businessId]/subscription/success/page.tsx`** - Success page

### Schema & Configuration
- **`prisma/schema.prisma`** - Updated with subscription models
- **`SUBSCRIPTION_SYSTEM.md`** - Complete documentation

---

## 3-Tier Package Structure

### WILD HORSES (Free) 🎪
```
Price: FREE
Features:
  ✓ Free business listing
  ✓ Business profile
  ✓ Appears in searches
Limits: 1 photo, 0 promotions, 1 branch
```

### DESERT ELEPHANTS (Standard) 🐘
```
Price: P100/month
Features:
  ✓ Enhanced business profile
  ✓ Photo uploads
  ✓ Higher search ranking
  ✓ Customer reviews display
  ✓ Promotions and updates board
  ✓ Social media links
  ✓ Priority support
Limits: 10 photos, 5 promotions, 1 branch
```

### DESERT LIONS (Premium) 🦁
```
Price: P200/month
Features:
  ✓ Top search placement
  ✓ Featured business badge
  ✓ Video introduction
  ✓ Expanded photo gallery
  ✓ Multiple branch listings
  ✓ WhatsApp chatbot
  ✓ Dedicated support
Limits: 50 photos, 20 promotions, 5 branches
```

---

## Setup Instructions

### Step 1: Update Environment Variables

Add to `.env.local`:

```bash
# PayGate Payment Gateway
PAYGATE_MERCHANT_ID=10011016681
PAYGATE_MERCHANT_KEY=secret_key_here
PAYGATE_API_KEY=api_key_here
PAYGATE_ENV=test

# URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

### Step 2: Create Database Migration

```bash
# Generate migration
npx prisma migrate dev --name add_subscription_system

# Push to database
npx prisma db push
```

### Step 3: Seed Subscription Plans

Create `scripts/seed-subscriptions.ts`:

```typescript
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription-access';

async function seedPlans() {
  for (const tier of Object.values(SUBSCRIPTION_TIERS)) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: tier.tier.toLowerCase() },
      update: {},
      create: {
        name: tier.name,
        slug: tier.tier.toLowerCase(),
        description: tier.description,
        monthlyPrice: tier.monthlyPrice,
        tier: tier.tier,
        features: tier.features,
        maxPhotos: tier.limits.photos,
        maxPromotions: tier.limits.promotions,
        maxBranches: tier.limits.branches,
        features_enabled: tier.limits,
      },
    });
  }
  console.log('✓ Subscription plans seeded');
}

seedPlans().catch(console.error);
```

Run: `npx ts-node scripts/seed-subscriptions.ts`

### Step 4: Update Business Pages

Add subscription link to business dashboard:

```tsx
<Link href={`/business/${businessId}/subscription`}>
  Manage Subscription
</Link>
```

### Step 5: Add Feature Checks to API Routes

Example - Photo upload route:

```typescript
import { enforceLimit } from '@/middleware/subscription-access';

export async function POST(request: NextRequest) {
  // ... validation code ...

  // Check subscription limit
  const limitCheck = await enforceLimit(businessId, 'photos', request);
  if (limitCheck) return limitCheck;

  // ... proceed with upload ...
}
```

### Step 6: Test with PayGate

1. Set `PAYGATE_ENV=test`
2. Use test card: **4111 1111 1111 1111**
3. Any future date and any CVV
4. Verify callback is received

### Step 7: PayGate Configuration

1. Login to PayGate dashboard
2. Set Notify URL: `https://yourdomain.com/api/subscriptions/callback`
3. Set Return URL: `https://yourdomain.com/business/{businessId}/subscription/success`
4. Generate API keys for your app

---

## Usage Examples

### Check if Business Can Upload Photos

```typescript
import { canUploadPhoto } from '@/lib/subscription-access';

const result = await canUploadPhoto(businessId, currentPhotoCount);

if (!result.allowed) {
  return {
    error: true,
    message: result.reason,
    limit: result.limit
  };
}
```

### Check Subscription Status

```typescript
import { getSubscriptionStatus, getTierInfo } from '@/lib/subscription-access';

const status = await getSubscriptionStatus(businessId);
console.log(status.tier); // 'DESERT_ELEPHANTS'
console.log(status.plan.name); // 'DESERT ELEPHANTS'
console.log(status.plan.features); // array of features
```

### Verify Feature Access

```typescript
import { hasFeature } from '@/lib/subscription-access';

const hasVideo = hasFeature(subscription.tier, 'videoIntro');
if (!hasVideo) {
  // Show upgrade prompt
}
```

---

## Feature Flags by Tier

Each tier has these feature flags:

| Feature | WILD HORSES | DESERT ELEPHANTS | DESERT LIONS |
|---------|:-----------:|:---------------:|:-----------:|
| Photos | 1 | 10 | 50 |
| Promotions | 0 | 5 | 20 |
| Branches | 1 | 1 | 5 |
| Reviews Display | ✓ | ✓ | ✓ |
| Social Links | ✗ | ✓ | ✓ |
| Video Intro | ✗ | ✗ | ✓ |
| WhatsApp Bot | ✗ | ✗ | ✓ |
| Featured Badge | ✗ | ✗ | ✓ |
| Enhanced Profile | ✗ | ✓ | ✓ |
| Dedicated Support | ✗ | ✗ | ✓ |
| Top Placement | ✗ | ✗ | ✓ |

---

## Payment Flow

```
User clicks Subscribe
    ↓
Frontend calls POST /api/subscriptions/checkout
    ↓
Backend creates Payment record
Backend calls payGate.createCheckout()
    ↓
Returns PayGate redirect URL
    ↓
User redirected to PayGate to enter payment
    ↓
PayGate processes payment
    ↓
PayGate sends callback to /api/subscriptions/callback
    ↓
Backend verifies checksum
Backend updates Payment status to COMPLETED
Backend activates Subscription with end date
    ↓
Backend redirects user to success page
```

---

## Admin Dashboard Integration

Add to admin pages to manage subscriptions:

```typescript
// Get all active subscriptions
const subscriptions = await prisma.subscription.findMany({
  where: { status: 'ACTIVE' },
  include: {
    plan: true,
    business: { select: { name: true, email: true } },
  },
});

// Get pending payments
const pending = await prisma.payment.findMany({
  where: { status: 'PENDING' },
  orderBy: { createdAt: 'desc' },
});
```

---

## Troubleshooting

### Issue: PayGate Redirect Not Working
**Solution:** Verify PAYGATE_MERCHANT_ID and return URLs are correct

### Issue: Payment Callback Not Received
**Solution:** Check:
- [ ] Notify URL is publicly accessible
- [ ] Environment variables loaded correctly
- [ ] Database connection active
- [ ] PayGate IP whitelist (if applicable)

### Issue: Checksum Verification Failed
**Solution:**
- Verify PAYGATE_MERCHANT_KEY matches PayGate dashboard
- Ensure it's not being modified during request/response

### Issue: Feature Limits Not Enforcing
**Solution:**
- Verify subscription middleware called before upload
- Check subscription status is ACTIVE in database
- Confirm plan limits are correctly set

---

## Security Considerations

1. **Always verify checksum** in PayGate callbacks
2. **Never expose PAYGATE_MERCHANT_KEY** in frontend
3. **Validate businessId ownership** before processing
4. **Use HTTPS only** in production
5. **Rate limit** payment endpoints
6. **Log all transactions** for audit trail
7. **Store encrypted** payment references

---

## Next Steps

- [ ] Configure PayGate test merchant account
- [ ] Set environment variables
- [ ] Run database migration
- [ ] Seed subscription plans
- [ ] Test free plan signup
- [ ] Test paid plan with test card
- [ ] Verify callback processing
- [ ] Update business pages with subscription links
- [ ] Add feature checks to upload routes
- [ ] Configure email notifications
- [ ] Setup admin dashboard
- [ ] Create user documentation
- [ ] Go live with production PayGate

---

## Support Resources

- **PayGate Docs:** https://docs.paygate.co.za
- **Test Cards:** https://docs.paygate.co.za/reference/test-cards
- **Error Codes:** https://docs.paygate.co.za/reference/error-codes
- **Implementation Guide:** See `SUBSCRIPTION_SYSTEM.md`

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Ready for Implementation
