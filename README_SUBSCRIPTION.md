# Implementation Checklist & Quick Reference

## ✅ COMPLETE IMPLEMENTATION CHECKLIST

### Phase 1: Database Setup (Do First)
- [ ] Review updated `prisma/schema.prisma`
- [ ] Run: `npx prisma migrate dev --name add_subscription_system`
- [ ] Run: `npx prisma db push`
- [ ] Run: `npx prisma generate`
- [ ] Verify no TypeScript errors after generation

### Phase 2: Environment Configuration
- [ ] Register with PayGate: https://www.paygate.co.za
- [ ] Get Merchant ID and Key from PayGate dashboard
- [ ] Add to `.env.local`:
  ```
  PAYGATE_MERCHANT_ID=
  PAYGATE_MERCHANT_KEY=
  PAYGATE_API_KEY=
  PAYGATE_ENV=test
  ```
- [ ] Verify `NEXTAUTH_URL` is set correctly

### Phase 3: Seed Subscription Plans
- [ ] Create `scripts/seed-subscriptions.ts` (see SUBSCRIPTION_QUICK_START.md)
- [ ] Run: `npx ts-node scripts/seed-subscriptions.ts`
- [ ] Verify in database: `SELECT * FROM subscription_plans;`
- [ ] Should show 3 records: WILD_HORSES, DESERT_ELEPHANTS, DESERT_LIONS

### Phase 4: Test Payment Flow
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to `/business/{businessId}/subscription/plans`
- [ ] Test WILD_HORSES free plan signup
  - [ ] Click Subscribe
  - [ ] Confirm subscription created in database
  - [ ] Check subscription is ACTIVE
- [ ] Test DESERT_ELEPHANTS paid plan
  - [ ] Use test card: 4111 1111 1111 1111
  - [ ] Any future date, any CVV
  - [ ] Confirm PayGate redirect
  - [ ] Verify payment callback received (check server logs)
  - [ ] Confirm subscription ACTIVE in database
- [ ] Test cancellation
  - [ ] Go to `/business/{businessId}/subscription`
  - [ ] Click Cancel
  - [ ] Verify status changed to CANCELLED

### Phase 5: Integration with Existing Features
- [ ] Photo upload route: Add `await enforceLimit(businessId, 'photos', request);`
- [ ] Promotion route: Add `await enforceLimit(businessId, 'promotions', request);`
- [ ] Branch creation: Add `await enforceLimit(businessId, 'branches', request);`
- [ ] Test each endpoint with limits

### Phase 6: Frontend Integration
- [ ] Add subscription link to business dashboard
- [ ] Import `SubscriptionPlans` component where needed
- [ ] Import `SubscriptionManagement` component
- [ ] Update feature pages with `hasFeature()` checks
- [ ] Add `UpgradePrompt` component where features locked

### Phase 7: Documentation & Training
- [ ] Share SUBSCRIPTION_SYSTEM.md with team
- [ ] Share SUBSCRIPTION_QUICK_START.md with developers
- [ ] Review SUBSCRIPTION_INTEGRATION_EXAMPLES.md together
- [ ] Schedule PayGate support handoff if needed

### Phase 8: Production Deployment
- [ ] Get production PayGate credentials
- [ ] Update environment variables
- [ ] Change `PAYGATE_ENV` from `test` to `production`
- [ ] Update PayGate webhook URLs to production domain
- [ ] Test on staging environment first
- [ ] Monitor payment callbacks for 24 hours
- [ ] Have support team trained on troubleshooting

---

## 🔧 Quick Reference: File Locations

### Core System
```
src/lib/paygate.ts                           ← PayGate API client
src/lib/subscription-access.ts               ← Feature access control
src/middleware/subscription-access.ts        ← Permission enforcement
```

### API Endpoints
```
src/app/api/subscriptions/checkout/route.ts  ← Initiate checkout
src/app/api/subscriptions/callback/route.ts  ← Payment callback
src/app/api/subscriptions/status/route.ts    ← Get status
src/app/api/subscriptions/cancel/route.ts    ← Cancel sub
```

### Components & Pages
```
src/app/subscription/SubscriptionPlans.tsx         ← Plans component
src/app/subscription/SubscriptionManagement.tsx    ← Manage component
src/app/subscription/PaymentSuccess.tsx            ← Status page

src/app/business/[businessId]/subscription/plans/page.tsx
src/app/business/[businessId]/subscription/page.tsx
src/app/business/[businessId]/subscription/success/page.tsx
```

### Documentation
```
SUBSCRIPTION_SYSTEM.md                ← Full documentation
SUBSCRIPTION_QUICK_START.md          ← Setup guide
SUBSCRIPTION_INTEGRATION_EXAMPLES.md ← Code examples
IMPLEMENTATION_COMPLETE.md           ← Summary
README_SUBSCRIPTION.md               ← This file
```

---

## 🚨 Common Tasks & Solutions

### Task 1: Check Subscription Status
```typescript
const { getSubscriptionStatus } = require('@/lib/subscription-access');
const status = await getSubscriptionStatus(businessId);
console.log(status.tier);  // WILD_HORSES, DESERT_ELEPHANTS, DESERT_LIONS
```

### Task 2: Verify Feature Available
```typescript
const { hasFeature } = require('@/lib/subscription-access');
if (hasFeature(tier, 'videoIntro')) {
  // Feature available
}
```

### Task 3: Block API if Over Limit
```typescript
const { enforceLimit } = require('@/middleware/subscription-access');
const check = await enforceLimit(businessId, 'photos', request);
if (check) return check;  // Returns 429 error if over limit
```

### Task 4: Get Tier Info
```typescript
const { getTierInfo } = require('@/lib/subscription-access');
const info = getTierInfo(tier);
console.log(info.name);     // 'DESERT ELEPHANTS'
console.log(info.features); // Array of features
console.log(info.limits);   // { photos: 10, ... }
```

### Task 5: List All Tiers
```typescript
const { getAllTiers } = require('@/lib/subscription-access');
const tiers = getAllTiers();
tiers.forEach(t => console.log(t.name, t.monthlyPrice));
```

---

## 🐛 Troubleshooting

### Issue: "Checksum verification failed"
**Cause:** PAYGATE_MERCHANT_KEY doesn't match PayGate dashboard  
**Solution:**
1. Log into PayGate dashboard
2. Copy exact PAYGATE_MERCHANT_KEY
3. Update .env.local
4. Restart dev server

### Issue: "Payment callback not received"
**Possible Causes:**
- [ ] Notify URL not accessible from PayGate
- [ ] Environment variables not loaded
- [ ] Database connection error
- [ ] API route has error
**Solution:**
1. Check server logs for errors
2. Verify db connection
3. Test endpoint manually with curl
4. Check PayGate IP whitelist (if applicable)

### Issue: "Feature limit not enforcing"
**Cause:** enforceLimit() not called before operation  
**Solution:**
1. Check API route has limit check
2. Verify businessId is passed correctly
3. Check subscription status is ACTIVE
4. Verify plan limits are set in database

### Issue: "Subscription not found in database"
**Cause:** Migration not run or seed not executed  
**Solution:**
```bash
npx prisma migrate dev --name add_subscription_system
npx ts-node scripts/seed-subscriptions.ts
```

---

## 📊 Database Queries for Testing

### Get All Subscriptions
```sql
SELECT * FROM subscriptions 
ORDER BY created_at DESC;
```

### Get Active Subscriptions
```sql
SELECT s.*, p.name as plan_name, b.name as business_name
FROM subscriptions s
JOIN subscription_plans p ON s.plan_id = p.id
JOIN businesses b ON s.business_id = b.id
WHERE s.status = 'ACTIVE';
```

### Get Pending Payments
```sql
SELECT * FROM payments 
WHERE status = 'PENDING'
ORDER BY created_at DESC;
```

### Get Failed Payments
```sql
SELECT * FROM payments 
WHERE status = 'FAILED'
ORDER BY created_at DESC;
```

### Check Tier Limits
```sql
SELECT 
  name,
  tier,
  max_photos,
  max_promotions,
  max_branches,
  monthly_price
FROM subscription_plans
ORDER BY monthly_price;
```

---

## 🎯 Testing Scenarios

### Scenario 1: Free Plan Signup
```
1. Navigate to /business/{id}/subscription/plans
2. Click Subscribe on WILD HORSES
3. Should go to /business/{id}/subscription
4. Verify subscription_id in businesses table
5. Subscription status should be ACTIVE
6. Plan should be WILD_HORSES (tier)
```

### Scenario 2: Paid Plan with PayGate
```
1. Navigate to /business/{id}/subscription/plans
2. Click Subscribe on DESERT_ELEPHANTS
3. Redirected to PayGate test environment
4. Enter card: 4111 1111 1111 1111
5. Enter future date and any CVV
6. Submit payment
7. Verify callback received (server logs)
8. Payment status should be COMPLETED
9. Subscription status should be ACTIVE
10. Navigate to /business/{id}/subscription
11. Should show DESERT ELEPHANTS tier
12. Features list should show all DESERT_ELEPHANTS features
```

### Scenario 3: Feature Limits
```
1. Business on WILD_HORSES (1 photo max)
2. Upload first photo - should succeed
3. Try to upload second photo - should get error
4. Error message: "Photo limit of 1 reached"
5. Suggest upgrading to DESERT_ELEPHANTS
```

### Scenario 4: Subscription Cancellation
```
1. Business on DESERT_LINES (paid)
2. Navigate to /business/{id}/subscription
3. Click "Cancel Subscription"
4. Confirm cancellation
5. Subscription status changes to CANCELLED
6. Try to use premium feature
7. Should be blocked or show upgrade prompt
```

---

## 📱 API Response Examples

### Checkout Success (Paid Plan)
```json
{
  "success": true,
  "checkout": {
    "redirectUrl": "https://secure.paygate.co.za/...",
    "reference": "NS_SUB_123_1234567890",
    "sessionId": "NS_abc123"
  }
}
```

### Checkout Success (Free Plan)
```json
{
  "success": true,
  "subscriptionUrl": "/business/123/subscription"
}
```

### Get Status
```json
{
  "success": true,
  "subscription": {
    "tier": "DESERT_ELEPHANTS",
    "status": "ACTIVE",
    "plan": {
      "name": "DESERT ELEPHANTS",
      "features": [...],
      "limits": { "photos": 10, ... }
    }
  }
}
```

### Limit Exceeded
```json
{
  "success": false,
  "message": "photos limit reached for your subscription",
  "current": 10,
  "limit": 10,
  "tier": "DESERT ELEPHANTS"
}
```

---

## 🔑 PayGate Test Credentials

**Test Card:**
```
Card Number: 4111 1111 1111 1111
Expiry Date: Any future date (MM/YY)
CVV: Any 3 digits
```

**Test URLs:**
```
Checkout: https://secure-test.paygate.co.za/payweb3/initiate.trans
Query:    https://secure-test.paygate.co.za/api/query
```

**Production URLs:**
```
Checkout: https://secure.paygate.co.za/payweb3/initiate.trans
Query:    https://secure.paygate.co.za/api/query
```

---

## 📈 Monitoring & Metrics

### Key Metrics to Track
- Number of active subscriptions per tier
- Monthly recurring revenue
- Payment success/failure rate
- Feature usage per tier
- Customer churn rate
- Payment processing time

### Queries for Monitoring
```sql
-- Active subscriptions by tier
SELECT tier, COUNT(*) as count
FROM subscriptions s
JOIN subscription_plans p ON s.plan_id = p.id
WHERE s.status = 'ACTIVE'
GROUP BY tier;

-- Monthly revenue (test mode)
SELECT DATE(paid_at) as date, SUM(amount) as total
FROM payments
WHERE status = 'COMPLETED'
GROUP BY DATE(paid_at);

-- Payment success rate
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM payments
GROUP BY status;
```

---

## 📞 Support Contacts

- **PayGate Support:** https://docs.paygate.co.za/support
- **PayGate Status:** https://status.paygate.co.za
- **Priority Issues:** contact PayGate directly for merchant support

---

## ✅ Final Checklist Before Launch

- [ ] Database migration completed
- [ ] All environment variables set
- [ ] Subscription plans seeded to database
- [ ] Free plan signup tested and working
- [ ] Paid plan with PayGate tested and working
- [ ] Payment callback verified and processed
- [ ] Feature limits enforced in API routes
- [ ] Frontend UI showing subscriptions
- [ ] Subscription cancellation tested
- [ ] Documentation reviewed by team
- [ ] Team trained on troubleshooting
- [ ] Production PayGate credentials obtained
- [ ] Staging environment tested
- [ ] Monitoring/logging setup
- [ ] Support team briefed
- [ ] Ready for production launch

---

**Version:** 1.0.0  
**Status:** ✅ Complete & Ready to Deploy  
**Last Updated:** 2024
