# Featured Hero Space Monetization System

## Overview
This implementation adds a paid "Featured Hero Space" feature to your Namibia Services platform. Businesses can now subscribe to feature their images in the hero carousel on the homepage for either monthly or yearly periods.

---

## 💰 PRICING STRUCTURE

### Monthly Plan
- **Price:** N$100/month
- **Duration:** 1 month
- **Billing Cycle:** MONTHLY
- **Auto-renewal:** Configurable
- **Expires:** Last day of billing month

### Yearly Plan  
- **Price:** N$1,008/year (normally N$1,200 with 16% discount)
- **Duration:** 12 months
- **Billing Cycle:** YEARLY
- **Auto-renewal:** Configurable
- **Expires:** Same date next year

---

## 🗄️ DATABASE CHANGES

### New Table: `featured_hero_spaces`
```sql
- id: UUID (primary key)
- businessId: UUID (foreign key to businesses)
- imageUrl: String (path to featured image)
- title: String (featured space title)
- description: String (optional description)
- linkUrl: String (optional redirect URL)
- billingCycle: Enum (MONTHLY | YEARLY)
- monthlyPrice: Float (N$100)
- startDate: DateTime (when space started)
- expiryDate: DateTime (automatic expiration date)
- isActive: Boolean (active/inactive status)
- createdAt: DateTime
- updatedAt: DateTime
```

### Migration Required
```bash
npx prisma migrate dev --name add_featured_hero_space
# or
npx prisma db push
```

---

## 📡 API ENDPOINTS

### 1. GET /api/featured-hero-space
**Purpose:** Fetch all active featured spaces (for homepage display)

**Query Parameters:**
- `userSpaces=true` - Get only current user's spaces
- `businessId=xxx` - Filter by business

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "fhs_123",
      "businessId": "biz_456",
      "imageUrl": "https://...",
      "title": "Featured Business",
      "expiryDate": "2026-04-30",
      "isActive": true,
      "business": {
        "id": "biz_456",
        "name": "My Business",
        "slug": "my-business",
        "website": "https://..."
      }
    }
  ]
}
```

---

### 2. POST /api/featured-hero-space
**Purpose:** Create and purchase a featured hero space

**Request Body:**
```json
{
  "businessId": "biz_123",
  "imageUrl": "https://example.com/image.jpg",
  "title": "Amazing Business",
  "description": "We offer great services",
  "linkUrl": "https://mybusiness.com",
  "billingCycle": "MONTHLY" | "YEARLY"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "spaceId": "fhs_789",
    "reference": "FHS_biz_123_1711900000000"
  },
  "checkout": {
    "redirectUrl": "https://paygate.example.com/checkout",
    "sessionId": "sess_xyz"
  }
}
```

**Error Cases:**
- 400: Missing required fields
- 401: Unauthorized (not logged in)
- 403: Not business owner
- 409: Business already has active featured space

---

### 3. PATCH /api/featured-hero-space/[id]
**Purpose:** Activate/deactivate a featured space

**Request Body:**
```json
{
  "isActive": true | false
}
```

---

### 4. DELETE /api/featured-hero-space/[id]
**Purpose:** Delete a featured space

**Response:**
```json
{
  "success": true,
  "message": "Featured space deleted successfully"
}
```

---

### 5. POST /api/featured-hero-space/callback
**Purpose:** Handle PayGate payment callback (automatic)
- Activates featured space after successful payment
- Creates payment record
- Triggered by PayGate webhook

---

## 🎨 FRONTEND FEATURES

### Homepage Hero Carousel (Updated)
- **Location:** Hero carousel section
- **Display:** Shows paid featured spaces FIRST (prioritized), then static ads
- **Indicators:** Shows "⭐ Featured Business Listing" for paid spaces
- **Auto-rotation:** Rotates through all spaces every 5 seconds
- **Manual Navigation:** Arrow buttons and dot indicators

### Visualization
```
BEFORE:
[STATIC AD] → [STATIC AD] → [STATIC AD]

AFTER:
[PAID FEATURED SPACE 1] → [PAID FEATURED SPACE 2] → [STATIC AD] → [STATIC AD]
```

---

## 📱 USER DASHBOARD (To Be Created)

Typical implementation would include:

### Dashboard Page: `/business/[id]/featured-hero`

**Features:**
1. **Current Status Card**
   - Shows if business has active featured space
   - Displays expiry date
   - Shows time remaining

2. **Upload/Edit Section**
   - Image upload with preview
   - Title & description edit
   - Link URL configuration
   - Visibility toggle

3. **Billing Cycle Selection**
   - Monthly vs Yearly comparison
   - Pricing display with savings calculation
   - Upgrade/downgrade options

4. **Purchase Button**
   - "Feature Your Business Now" CTA
   - Shows selected billing cycle
   - Redirects to checkout

5. **History/Management**
   - List of past and current featured spaces
   - Expiry dates visible
   - Quick deactivate option

---

## 🔄 AUTOMATIC EXPIRATION

Featured spaces **automatically expire** based on billing cycle:

```javascript
// Monthly billing
startDate: 2026-03-15
billingCycle: MONTHLY
expiryDate: 2026-04-15 (auto-calculated)

// Yearly billing
startDate: 2026-03-15
billingCycle: YEARLY
expiryDate: 2027-03-15 (auto-calculated)
```

**Monthly Reset:** Automatic based on date calculation (no cron job needed)
**Yearly Reset:** Automatic based on date calculation (no cron job needed)

---

## 💳 PAYMENT FLOW

```
1. User selects "Feature Your Business"
   ↓
2. Uploads image + details
   ↓
3. Selects billing cycle (Monthly/Yearly)
   ↓
4. Reviews pricing and clicks "Purchase"
   ↓
5. PayGate checkout (N$100 or N$1,008)
   ↓
6. Payment confirmation
   ↓
7. Featured space activated immediately
   ↓
8. Appears in homepage carousel
   ↓
9. Expires automatically on expiry date
```

---

## 🛡️ SECURITY FEATURES

✅ **Business Ownership Verification**
- Only business owners can create/manage featured spaces

✅ **Payment Verification**
- PayGate webhook callback validates all transactions
- Transaction reference stored for auditing

✅ **Active Space Limitation**
- Businesses can only have ONE active featured space at a time
- Attempting to purchase another shows conflict error

✅ **Expiration Enforcement**
- Automatic expiry based on database date calculation
- No manual intervention needed

---

## 📊 REVENUE POTENTIAL

**Monthly Revenue per Business:**
- 1 business × N$100 = N$100
- 10 businesses × N$100 = N$1,000
- 50 businesses × N$100 = N$5,000

**Annual Revenue Opportunity:**
- 100 businesses × N$1,008 (yearly) = N$100,800

---

## 🔧 IMPLEMENTATION CHECKLIST

- [x] Add FeaturedHeroSpace model to Prisma schema
- [x] Add Business relation to FeaturedHeroSpace
- [x] Create API endpoints (GET, POST, PATCH, DELETE)
- [x] Create payment callback handler
- [x] Add pricing configuration
- [x] Update RotatingBannerAd component
- [x] Add helper functions for business logic
- [ ] Run Prisma migration `npx prisma migrate dev`
- [ ] Create dashboard UI component
- [ ] Add featured space management page
- [ ] Test payment flow with PayGate
- [ ] Add featured space expiry monitoring
- [ ] Create admin dashboard to view featured spaces

---

## 🚀 NEXT STEPS

### Immediate (Required)
1. Run database migration:
   ```bash
   npx prisma migrate dev --name add_featured_hero_space
   ```

2. Test API endpoints locally:
   ```bash
   POST /api/featured-hero-space
   GET /api/featured-hero-space
   ```

3. Verify homepage carousel displays paid spaces

### Short Term (1-2 weeks)
1. Create dashboard UI for featured space management
2. Test PayGate integration
3. Add email notifications for expiry reminder

### Medium Term (1 month)
1. Create admin analytics dashboard
2. Add featured space performance metrics
3. Implement auto-renewal for yearly plans
4. Create featured space showcase

---

## 📝 CONFIGURATION

Edit pricing in `src/lib/subscription-access.ts`:

```typescript
export const FEATURED_HERO_SPACE_PRICING = {
  MONTHLY: {
    monthlyPrice: 100,      // Change this for monthly price
    // ...
  },
  YEARLY: {
    yearlyCost: 1008,       // Change this for yearly price
    discountPercentage: 16, // Change discount %
    // ...
  },
};
```

---

## 🐛 TROUBLESHOOTING

**Error: "Property 'featuredHeroSpace' does not exist"**
- Solution: Run `npx prisma migrate dev`
- This error means schema changes haven't been applied to database

**Featured space not appearing in carousel:**
- Check if `isActive` is `true` in database
- Check if `expiryDate` is in the future
- Verify image URL is accessible

**Payment fails but space created:**
- Check PayGate callback is receiving notifications
- Verify webhook URL in PayGate settings
- Check space is marked `isActive: false` before payment

---

## 📞 SUPPORT

For issues or questions:
1. Check error logs: `prisma.log`
2. Test PayGate integration separately
3. Verify all endpoints return 200 responses
4. Check that images load correctly in hero section

