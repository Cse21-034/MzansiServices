# Namibia Services Subscription System

Complete implementation of a 3-tier subscription model with PayGate payment integration.

## Subscription Packages

### 1. WILD HORSES (Free Basic)
- **Price:** FREE
- **Monthly Billing:** N/A
- **Features:**
  - Free business listing
  - Business profile
  - Appears in searches

**Limits:**
- Max Photos: 1
- Promotions: 0
- Branches: 1
- No social media links
- No video intro
- No WhatsApp chatbot

---

### 2. DESERT ELEPHANTS (Standard)
- **Price:** P100/month
- **Currency:** BWP (Botswana Pula)
- **Features:**
  - Enhanced business profile
  - Photo uploads
  - Higher search ranking
  - Customer reviews display
  - Promotions and updates board
  - Social media links
  - Priority support

**Limits:**
- Max Photos: 10
- Promotions: 5
- Branches: 1
- Social media links: Yes
- Video intro: No
- WhatsApp chatbot: No

---

### 3. DESERT LIONS (Premium)
- **Price:** P200/month
- **Currency:** BWP (Botswana Pula)
- **Features:**
  - Top search placement
  - Featured business badge
  - Video introduction
  - Expanded photo gallery
  - Multiple branch listings
  - WhatsApp chatbot
  - Dedicated support

**Limits:**
- Max Photos: 50
- Promotions: 20
- Branches: 5 (with individual profiles)
- Social media links: Yes
- Video intro: Yes
- WhatsApp chatbot: Yes

---

## Database Schema

### New Models

#### SubscriptionPlan
Defines available subscription plans with features and limits.

```prisma
model SubscriptionPlan {
  id              String
  name            String   @unique
  slug            String   @unique
  description     String
  monthlyPrice    Float
  yearlyPrice     Float?
  tier            SubscriptionTier
  features        String[]
  maxPhotos       Int
  maxPromotions   Int
  maxBranches     Int
  features_enabled Json
}
```

#### Subscription
Tracks active subscriptions for each business.

```prisma
model Subscription {
  id              String
  businessId      String   @unique
  planId          String
  status          SubscriptionStatus @default(ACTIVE)
  startDate       DateTime @default(now())
  endDate         DateTime?
  renewalDate     DateTime?
  autoRenew       Boolean @default(true)
  billingCycle    BillingCycle @default(MONTHLY)
  currentPaymentId String?
}
```

#### Payment
Records all payment transactions.

```prisma
model Payment {
  id                String
  subscriptionId    String
  paymentGatewayId  String  // PayGate reference
  amount            Float
  currency          String
  status            PaymentStatus
  transactionRef    String? @unique
  failureReason     String?
  paidAt            DateTime?
}
```

### Updated Models

**Business Model** now includes:
```prisma
subscriptionId      String?
subscription        Subscription? @relation(fields: [subscriptionId], references: [id])
```

---

## Environment Variables

Add these to your `.env.local`:

```bash
# PayGate Configuration
PAYGATE_MERCHANT_ID=your_merchant_id
PAYGATE_MERCHANT_KEY=your_merchant_key
PAYGATE_API_KEY=your_api_key
PAYGATE_ENV=test  # or production

# PayGate Webhook
PAYGATE_WEBHOOK_SECRET=your_webhook_secret

# URLs
NEXTAUTH_URL=http://localhost:3000
```

---

## PayGate Integration

### Setup Steps

1. **Register with PayGate**
   - Visit: https://www.paygate.co.za
   - Sign up for account
   - Get your Merchant ID and Key

2. **Configure PayGate**
   - Add environment variables
   - Set return URL: `{APP_URL}/subscription/success`
   - Set notify URL: `{APP_URL}/api/subscriptions/callback`

3. **Test Mode**
   - Use test environment during development
   - Test cards: [See PayGate docs](https://docs.paygate.co.za)

### PayGate API Endpoints

**Checkout URL:**
```
https://secure.paygate.co.za/payweb3/initiate.trans
```

**Test Mode:**
```
https://secure-test.paygate.co.za/payweb3/initiate.trans
```

---

## API Routes

### POST `/api/subscriptions/checkout`
Initiate PayGate checkout session.

**Request:**
```json
{
  "planTier": "DESERT_ELEPHANTS",
  "businessId": "business_id_here",
  "billingCycle": "MONTHLY"
}
```

**Response (Paid Plan):**
```json
{
  "success": true,
  "checkout": {
    "redirectUrl": "https://secure.paygate.co.za/...",
    "reference": "NS_SUB_...",
    "sessionId": "NS_..."
  }
}
```

**Response (Free Plan):**
```json
{
  "success": true,
  "subscriptionUrl": "/business/id/subscription"
}
```

---

### POST `/api/subscriptions/callback`
PayGate payment notification callback. Automatically processes payment status.

**PayGate Sends:**
```json
{
  "PAYGATE_ID": "merchant_id",
  "REFERENCE": "NS_SUB_...",
  "TRANSACTION_ID": "12345",
  "STATUS": "1",
  "AMOUNT": "10000",
  "CURRENCY": "BWP",
  "CHECKSUM": "..."
}
```

---

### GET `/api/subscriptions/status?businessId=xxx`
Get subscription status for a business.

**Response:**
```json
{
  "success": true,
  "subscription": {
    "tier": "DESERT_ELEPHANTS",
    "status": "ACTIVE",
    "plan": { /* tier info */ },
    "subscription": { /* full subscription object */ }
  }
}
```

---

### POST `/api/subscriptions/cancel`
Cancel an active subscription.

**Request:**
```json
{
  "businessId": "business_id_here"
}
```

---

## Feature Access Control

### Check Feature Availability

```typescript
import { hasFeature, getLimit } from '@/lib/subscription-access';

// Check if tier has feature
const canUseVideo = hasFeature(tier, 'videoIntro');

// Get limit
const maxPhotos = getLimit(tier, 'photos');
```

### Permission Utilities

```typescript
import {
  canUploadPhoto,
  canCreatePromotion,
  canAddBranch,
} from '@/lib/subscription-access';

// Check before upload
const { allowed, reason, limit } = await canUploadPhoto(businessId, currentCount);

// Check before promotion
const { allowed } = await canCreatePromotion(businessId);

// Check before branch
const { allowed, current, limit } = await canAddBranch(businessId);
```

### Middleware Integration

```typescript
import { enforceLimit, verifyFeatureAccess } from '@/middleware/subscription-access';

// In API route
const check = await enforceLimit(businessId, 'photos', request);
if (check) return check;

// Or verify feature
const access = await verifyFeatureAccess(businessId, 'videoIntro');
if (!access.allowed) {
  return NextResponse.json({ message: access.reason }, { status: 403 });
}
```

---

## Frontend Components

### SubscriptionPlans Component
Displays all 3 packages with pricing and features.

**Props:**
```typescript
interface SubscriptionPlansProps {
  businessId: string;
}
```

**Usage:**
```tsx
import SubscriptionPlans from '@/app/subscription/SubscriptionPlans';

<SubscriptionPlans businessId={business.id} />
```

### SubscriptionManagement Component
Manage active subscription, view features, cancel if needed.

**Props:**
```typescript
interface SubscriptionManagementProps {
  businessId: string;
}
```

**Usage:**
```tsx
import SubscriptionManagement from '@/app/subscription/SubscriptionManagement';

<SubscriptionManagement businessId={business.id} />
```

### PaymentSuccess Component
Handles PayGate callback and shows payment status.

---

## Implementation Checklist

- [ ] Update `.env.local` with PayGate credentials
- [ ] Run Prisma migration: `npx prisma migrate dev`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Update NextAuth configuration if needed
- [ ] Create subscription plan seeds (see below)
- [ ] Integrate SubscriptionPlans component in business dashboard
- [ ] Add feature checks to existing features (uploads, branches, promotions)
- [ ] Test with PayGate test environment
- [ ] Update payment success/failure page URLs
- [ ] Configure email notifications for payments
- [ ] Set up admin dashboard for subscription management

---

## Seeding Subscription Plans

Create a seed script `scripts/seed-subscriptions.ts`:

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

---

## Testing

### Test Scenarios

1. **Free Plan Signup**
   - Business subscribes to WILD HORSES (free)
   - Verify subscription created in database
   - Verify limited access to features

2. **Paid Plan Checkout**
   - Business selects DESERT_ELEPHANTS
   - Redirected to PayGate
   - Complete test payment
   - Verify callback received
   - Confirm subscription activated

3. **Feature Limits**
   - Upload max photos for tier
   - Attempt to exceed limit
   - Verify rejection with proper message

4. **Subscription Cancellation**
   - Cancel active subscription
   - Verify status updated
   - Verify access to premium features revoked

### Test PayGate Cards

- **Success:** 4111 1111 1111 1111 (Any future date + any CVV)
- **Declined:** 5555 5555 5555 4444

---

## Troubleshooting

### Checksum Verification Failed
- Verify PAYGATE_MERCHANT_KEY is correct
- Ensure environment variables are loaded
- Check PayGate documentation for checksum format

### Payment Not Being Processed
- Verify notify URL is accessible from PayGate
- Check server logs for callback errors
- Ensure database connection working

### Missing Features (Videos, Chatbot)
- These require additional API integrations
- Add to business model as boolean flags
- Implement with respective service providers

---

## Migration Guide

For existing businesses:

```typescript
// Script to migrate free businesses to WILD_HORSES plan
const freeplan = await prisma.subscriptionPlan.findUnique({
  where: { slug: 'wild_horses' },
});

const businessesWithoutSub = await prisma.business.findMany({
  where: { subscriptionId: null },
});

for (const business of businessesWithoutSub) {
  await prisma.subscription.create({
    data: {
      businessId: business.id,
      planId: freeplan!.id,
      status: 'ACTIVE',
    },
  });
}
```

---

## Support & Resources

- **PayGate Documentation:** https://docs.paygate.co.za
- **Prisma Documentation:** https://www.prisma.io/docs
- **NextAuth.js:** https://next-auth.js.org

---

## Version History

- **v1.0.0** (2024) - Initial release with 3-tier model, PayGate integration
