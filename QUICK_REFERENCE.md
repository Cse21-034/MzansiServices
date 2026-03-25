# Quick Reference Guide - Subscription System

## 📍 File Locations Quick Map

```
SRC/
├── app/
│   ├── page.tsx (UPDATED - homepage with packages)
│   ├── subscription/
│   │   ├── page.tsx (UPDATED - subscription page)
│   │   ├── SubscriptionPlans.tsx (existing)
│   │   ├── SubscriptionManagement.tsx (existing)
│   │   └── PaymentSuccess.tsx (existing)
│   └── api/
│       ├── subscriptions/
│       │   ├── checkout/route.ts (existing)
│       │   ├── callback/route.ts (existing)
│       │   ├── status/route.ts (existing)
│       │   └── cancel/route.ts (existing)
│       └── business/
│           └── my-businesses/route.ts (NEW)
├── components/
│   ├── SectionSubscriptionPackages.tsx (NEW - homepage section)
│   └── SubscriptionWidget.tsx (NEW - reusable card)
├── lib/
│   ├── paygate.ts (existing - PayGate client)
│   └── subscription-access.ts (existing - feature access)
└── middleware/
    └── subscription-access.ts (existing - permission checks)
```

---

## 🔌 API Endpoints

### 1. **Initiate Checkout**
```
POST /api/subscriptions/checkout
Content-Type: application/json

{
  "planTier": "DESERT_ELEPHANTS",  // WILD_HORSES | DESERT_ELEPHANTS | DESERT_LIONS
  "businessId": "uuid-here",
  "billingCycle": "MONTHLY"  // MONTHLY | YEARLY
}

Response: 200 OK
{
  "success": true,
  "checkout": {
    "redirectUrl": "https://paygate.co.za/checkout?ref=..."
  }
}
```

### 2. **Payment Callback** (PayGate → Your App)
```
POST /api/subscriptions/callback
Content-Type: application/x-www-form-urlencoded

Automatic - PayGate will post when payment completes
```

### 3. **Get Subscription Status**
```
GET /api/subscriptions/status?businessId=uuid-here

Response: 200 OK
{
  "status": "ACTIVE",
  "tier": "DESERT_ELEPHANTS",
  "activeSince": "2024-01-15T10:30:00Z",
  "expiresAt": "2025-01-15T10:30:00Z",
  "features": {
    "maxPhotos": 10,
    "maxPromotions": 5,
    "maxBranches": 1,
    "socialLinks": true,
    "videoIntro": false
  }
}
```

### 4. **Cancel Subscription**
```
POST /api/subscriptions/cancel?businessId=uuid-here

Response: 200 OK
{
  "success": true,
  "message": "Subscription cancelled"
}
```

### 5. **Get User's Businesses** (NEW)
```
GET /api/business/my-businesses

Requires: Logged in user
Response: 200 OK
{
  "businesses": [
    {
      "id": "uuid",
      "name": "My Business",
      "category": "retail",
      "subscription": {
        "tier": "DESERT_ELEPHANTS",
        "status": "ACTIVE",
        "activeDate": "2024-01-15T10:30:00Z"
      }
    }
  ]
}
```

---

## 💫 Component Props & Usage

### **SectionSubscriptionPackages**
```tsx
import SectionSubscriptionPackages from '@/components/SectionSubscriptionPackages';

<SectionSubscriptionPackages 
  // Optional: Pass business ID if user is logged in
  businessId={businessId}
  // Optional: Add className for custom styling
  className="custom-class"
/>
```

**Features:**
- Auto-detects logged-in user
- Auto-fetches user's business
- Shows "Your Current Plan" badge
- Handles payment redirect
- Responsive design

---

### **SubscriptionWidget**
```tsx
import SubscriptionWidget from '@/components/SubscriptionWidget';

<SubscriptionWidget 
  businessId="uuid-123"
  businessName="My Business"
  // Optional: Use compact variant
  compact={false}
  // Optional: Custom styling
  className="custom-class"
/>
```

**Props:**
- `businessId` (required): Business UUID
- `businessName` (required): Display name
- `compact` (optional): Set true for sidebar widget
- `className` (optional): Additional CSS classes

**Variants:**
- **Full:** Large card with all details (cards, badges, descriptions)
- **Compact:** Minimal widget for sidebars

---

## 🎁 Three-Tier Packages

### **1. WILD HORSES (FREE)**
- **Price:** Free
- **Max Photos:** 1
- **Max Promotions:** 0
- **Max Branches:** 1
- **Social Links:** ❌
- **Video Intro:** ❌
- **Instant Activation:** ✅

### **2. DESERT ELEPHANTS (PAID)**
- **Price:** P100/month or P1,000/year
- **Max Photos:** 10
- **Max Promotions:** 5
- **Max Branches:** 1
- **Social Links:** ✅
- **Video Intro:** ❌

### **3. DESERT LIONS (PREMIUM)**
- **Price:** P200/month or P2,000/year
- **Max Photos:** 50
- **Max Promotions:** 20
- **Max Branches:** 5
- **Social Links:** ✅
- **Video Intro:** ✅
- **WhatsApp Bot:** ✅

---

## 🔐 Check Subscription in Backend

### **In API Route:**
```typescript
import { getSubscriptionStatus } from '@/lib/subscription-access';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Get subscription status
  const subscription = await getSubscriptionStatus(businessId);
  
  // Check if user has access to feature
  const canUpload = await canUploadPhoto(businessId);
  if (!canUpload) {
    return Response.json({ error: 'Photo limit reached' }, { status: 403 });
  }
  
  // Get specific limit
  const maxPhotos = await getLimit(businessId, 'photos');
  
  return Response.json({ maxPhotos });
}
```

### **In React Component:**
```tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState(null);
  
  useEffect(() => {
    if (!session?.user) return;
    
    fetch(`/api/subscriptions/status?businessId=${businessId}`)
      .then(r => r.json())
      .then(data => setSubscription(data));
  }, [session, businessId]);
  
  if (!subscription) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>Current Plan: {subscription.tier}</h2>
      <p>Max Photos: {subscription.features.maxPhotos}</p>
      <p>Max Promotions: {subscription.features.maxPromotions}</p>
    </div>
  );
}
```

---

## 🌐 Environment Variables Required

Add to `.env.local`:

```env
# PayGate Configuration
PAYGATE_MERCHANT_ID=your_merchant_id
PAYGATE_MERCHANT_KEY=your_merchant_key
PAYGATE_API_KEY=your_api_key
PAYGATE_ENV=test  # Use 'test' for testing, 'production' for live

# NextAuth (should already exist)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Database (should already exist)
DATABASE_URL=postgresql://user:pass@localhost/db

# PayGate Callback
PAYGATE_CALLBACK_URL=http://localhost:3000/api/subscriptions/callback
```

---

## 🧪 Testing PayGate in Test Environment

### **Test Card Details:**
```
Card Number:  4111 1111 1111 1111
Expiry:       Any future date (e.g., 12/25)
CVV:          Any 3 digits (e.g., 123)
```

### **Test Flow:**
1. Click "Subscribe Now" on homepage
2. RedirectTo PayGate
3. Enter test card details above
4. PayGate processes (test doesn't charge)
5. Redirected back to your site
6. Check database: Subscription should be ACTIVE

---

## 🔄 Payment Flow Diagram

```
User clicks "Subscribe"
    ↓
Check session (logged in?)
    ├─ NO → Redirect to /login
    └─ YES
        ↓
    Check business
        ├─ NONE → Redirect to /add-listing
        └─ EXISTS
            ↓
        POST /api/subscriptions/checkout
            ├─ NEW & FREE (WILD_HORSES)
            │   └─ Create Subscription (ACTIVE immediately)
            │
            └─ PAID (DESERT_ELEPHANTS/LIONS)
                ├─ Create Payment (PENDING)
                ├─ Call PayGate API
                └─ Get redirectUrl
                    ↓
                Redirect user to PayGate
                    ↓
                User pays
                    ↓
                PayGate POST to /api/subscriptions/callback
                    ├─ Verify checksum
                    ├─ Update Payment (COMPLETED)
                    ├─ Create/Update Subscription (ACTIVE)
                    └─ Redirect to success page
```

---

## 🗂️ Database Schema Quick Reference

### **Subscription Model**
```prisma
model Subscription {
  id            String   @id @default(cuid())
  businessId    String   @unique
  business      Business @relation(fields: [businessId], references: [id])
  planId        String
  plan          SubscriptionPlan @relation(fields: [planId], references: [id])
  tier          SubscriptionTier
  status        SubscriptionStatus
  paymentId     String?
  payment       Payment? @relation(fields: [paymentId], references: [id])
  startDate     DateTime @default(now())
  endDate       DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### **SubscriptionTier Enum**
```prisma
enum SubscriptionTier {
  WILD_HORSES      // Free tier
  DESERT_ELEPHANTS // P100/month
  DESERT_LIONS     // P200/month (Premium)
}
```

### **SubscriptionStatus Enum**
```prisma
enum SubscriptionStatus {
  ACTIVE
  INACTIVE
  CANCELLED
  EXPIRED
  SUSPENDED
}
```

---

## 🚀 Integration Checklist

### **Homepage Section**
- [ ] `SectionSubscriptionPackages` appears on homepage after "How It Works"
- [ ] All 3 packages display with correct pricing
- [ ] "Subscribe Now" buttons work
- [ ] Redirects to login for unauthenticated users
- [ ] "Your Current Plan" badge shows for active subscriptions

### **Payment Flow**
- [ ] Click package → Checkout API called
- [ ] Free plan activates immediately
- [ ] Paid plan redirects to PayGate
- [ ] Test payment succeeds
- [ ] Callback updates subscription to ACTIVE
- [ ] User can see active plan on homepage

### **Dashboard Widget**
- [ ] Add SubscriptionWidget to business dashboard
- [ ] Widget displays current subscription
- [ ] "View Plans" button works
- [ ] "Manage" button works
- [ ] Works in both full and compact modes

### **API Endpoints**
- [ ] POST /api/subscriptions/checkout working
- [ ] GET /api/subscriptions/status working
- [ ] POST /api/subscriptions/cancel working
- [ ] GET /api/business/my-businesses working

---

## 📞 Common Integration Points

### **Photo Upload Route**
```typescript
// src/app/api/business/[id]/upload-photo/route.ts
import { canUploadPhoto } from '@/lib/subscription-access';

export async function POST(request: Request) {
  const canUpload = await canUploadPhoto(businessId);
  if (!canUpload) {
    return Response.json({
      error: 'Photo limit reached. Upgrade to add more.'
    }, { status: 403 });
  }
  // ... continue with upload
}
```

### **Promotion Creation Route**
```typescript
// src/app/api/promotions/create/route.ts
import { getLimit } from '@/lib/subscription-access';

export async function POST(request: Request) {
  const maxPromos = await getLimit(businessId, 'promotions');
  const currentPromos = await db.promotion.count({
    where: { businessId }
  });
  
  if (currentPromos >= maxPromos) {
    return Response.json({
      error: 'Promotion limit reached'
    }, { status: 403 });
  }
  // ... continue with creation
}
```

### **Branch Creation Route**
```typescript
// src/app/api/branch/create/route.ts
import { getLimit } from '@/lib/subscription-access';

export async function POST(request: Request) {
  const maxBranches = await getLimit(businessId, 'branches');
  const currentBranches = await db.branch.count({
    where: { businessId }
  });
  
  if (currentBranches >= maxBranches) {
    return Response.json({
      error: 'Branch limit reached'
    }, { status: 403 });
  }
  // ... continue with creation
}
```

---

## ✅ Validation & Cleanup

### **Validate Setup:**
```bash
# Check files exist
ls src/components/SectionSubscriptionPackages.tsx
ls src/components/SubscriptionWidget.tsx
ls src/app/api/business/my-businesses/route.ts

# Check imports in page.tsx
grep "SectionSubscriptionPackages" src/app/page.tsx

# Run linter
npm run lint

# Check for TypeScript errors
npm run type-check
```

### **Clean Up (if needed):**
```bash
# Remove old subscription component if replaced
rm src/app/subscription/OldComponent.tsx

# Rebuild Next.js
rm -rf .next
npm run build
```

---

## 📊 Success Criteria

✅ **All components render without errors**  
✅ **Homepage shows 3 packages**  
✅ **Free plan activates instantly**  
✅ **Paid plans redirect to PayGate**  
✅ **Payment callback processes successfully**  
✅ **Active subscription displays on homepage**  
✅ **Dashboard widget shows current plan**  
✅ **All API endpoints return correct data**  

---

**Last Updated:** December 2024  
**Status:** Production Ready ✅
