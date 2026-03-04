# Listing Approval System - Current State & Requirements

## ✅ What Exists: Business Approval System

### Admin Dashboard (`/namibiaservices`)
- **Location**: `src/app/namibiaservices/page.tsx`
- **Features**:
  - View all businesses in admin dashboard
  - Filter by status (PUBLISHED, PENDING, SUSPENDED)
  - Filter by verification status
  - Search businesses
  - Quick view business details modal
  - **Approve/Disapprove/Suspend buttons** with real-time updates

### Business Modal Actions
```tsx
<button onClick={() => { 
  handleUpdateBusiness(selectedBusiness.id, { status: 'PUBLISHED', verified: true }); 
  setShowBusinessModal(false); 
}}>Approve</button>

<button onClick={() => { 
  handleUpdateBusiness(selectedBusiness.id, { status: 'DISAPPROVED', verified: false }); 
  setShowBusinessModal(false); 
}}>Disapprove</button>

<button onClick={() => { 
  handleUpdateBusiness(selectedBusiness.id, { status: 'SUSPENDED' }); 
  setShowBusinessModal(false); 
}}>Suspend</button>
```

### API Endpoint for Business Updates
**Endpoint**: `PATCH /api/admin/businesses/[id]`

**Features**:
- Admin-only access (checks session.user.role === 'ADMIN')
- Updates allowed fields: status, verified, featured, name, description, categoryId, location, phone, email
- Revalidates cache after update
- Returns updated business object

**Status Options for Business**:
- `PUBLISHED` - Active/Visible
- `PENDING` - Under review
- `DISAPPROVED` - Rejected
- `SUSPENDED` - Temporarily hidden

---

## ❌ What's Missing: Listing Approval System

### Current Listing System
- ✅ Users can submit listings via `/add-listing/1-10`
- ✅ Listings created with status: `PENDING` 
- ✅ Success page confirms submission
- ❌ **NO admin interface to review or approve listings**
- ❌ **NO API endpoint to update listing status**
- ❌ **NO listing approval tab in admin dashboard**

### Listing Model in Prisma
```prisma
model Listing {
  id          String   @id @default(cuid())
  title       String
  description String
  image       String?
  status      ListingStatus @default(ACTIVE)    ← Simple status field
  businessId  String
  createdAt   DateTime
  updatedAt   DateTime
  business    Business @relation(...)
}
```

**Current Status Options**:
- `ACTIVE` (default)
- Need: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`

---

## 🔧 What Needs to Be Created

### 1. **Update Prisma Schema** 
Enhance Listing model to support approval workflow:

```prisma
model Listing {
  id              String          @id @default(cuid())
  title           String
  description     String
  image           String?
  status          ListingStatus   @default(PENDING)  // Change from ACTIVE
  businessId      String
  category        String?
  type            String?
  beds            Int?
  baths           Int?
  amenities       String[]        // Array/JSON
  features        String[]        // Array/JSON
  pricePerNight   Float?
  rules           String?
  address         String?
  city            String?
  latitude        Float?
  longitude       Float?
  minNights       Int?
  maxNights       Int?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  // Approval tracking
  approvedBy      String?         // Admin user ID who approved
  approvedAt      DateTime?
  rejectionReason String?         // Why was it rejected
  
  business        Business        @relation(fields: [businessId], references: [id], onDelete: Cascade)
  
  @@map("listings")
}

enum ListingStatus {
  PENDING     // New submission, awaiting review
  APPROVED    // Approved and visible to users
  REJECTED    // Admin rejected it
  SUSPENDED   // Was approved but now hidden
}
```

### 2. **Create API Endpoint for Listing Updates**
**File**: `src/app/api/admin/listings/[id]/route.ts`

```typescript
// PATCH /api/admin/listings/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // 1. Check admin auth (session.user.role === 'ADMIN')
  // 2. Extract status, rejectionReason from request body
  // 3. Update listing with:
  //    - status
  //    - approvedBy (current admin user ID)
  //    - approvedAt (current timestamp)
  //    - rejectionReason (if REJECTED)
  // 4. Return updated listing
}
```

### 3. **Create Admin Listings Tab**
**Location**: Add to `src/app/namibiaservices/page.tsx`

**Features**:
- New tab: "Listings" alongside existing tabs
- Display table of all listings with columns:
  - Title
  - Business
  - Status (PENDING/APPROVED/REJECTED/SUSPENDED)
  - Price
  - City
  - Created Date
  - Actions (View, Approve, Reject, Suspend)
- Filter by status
- Search by title or city
- Click row to open listing details modal

### 4. **Create Listing Details Modal**
**Features**:
- Show listing summary (title, description, features, amenities, pricing)
- Show images if uploaded
- Show business details
- Show submission date
- Status dropdown/toggle
- Rejection reason textarea (shown when rejecting)
- Action buttons:
  - ✅ Approve (status → APPROVED)
  - ❌ Reject (status → REJECTED, require rejection reason)
  - ⏸️ Suspend (status → SUSPENDED)
- Real-time updates with loading states

### 5. **Create Listings List API**
**File**: `src/app/api/admin/listings/route.ts`

```typescript
// GET /api/admin/listings
export async function GET(req: NextRequest) {
  // 1. Check admin auth
  // 2. Support query params: status, search, businessId
  // 3. Return listings with business relationship
}
```

### 6. **Update User Dashboard**
Allow users to see their listing status:
- `src/usersdashboard/page.tsx`
- Add "My Listings" section showing:
  - Listing title
  - Current status badge
  - If rejected: show rejection reason
  - If pending: show "Under Review" message
  - Edit/Delete buttons (if not approved)

---

## 📋 Migration Plan

### Step 1: Update Database Schema
```bash
# Create migration
npx prisma migrate dev --name add_listing_approval_fields

# Changes needed:
- Change ListingStatus enum (add PENDING, APPROVED, REJECTED, SUSPENDED)
- Add approvedBy, approvedAt, rejectionReason fields
- Change default status from ACTIVE to PENDING
```

### Step 2: Create API Endpoints
1. `GET /api/admin/listings` - List all listings with filters
2. `PATCH /api/admin/listings/[id]` - Update listing status

### Step 3: Update Admin Dashboard
1. Add "Listings" tab to namibiaservices page
2. Create listings table view
3. Create listing detail modal
4. Add approve/reject/suspend functionality

### Step 4: Update User Dashboard
1. Show user's listings with status
2. Show rejection reasons if applicable
3. Allow editing pending/rejected listings

### Step 5: Email Notifications
1. Send email when listing approved
2. Send email when listing rejected (with reason)
3. Send email when listing suspended

---

## Database Status Field Values

### Current (Before)
```
Default: ACTIVE
```

### After Implementation (Recommended)
```
PENDING    - Newly submitted, awaiting admin review
APPROVED   - Admin approved, visible to public
REJECTED   - Admin rejected, user can edit and resubmit
SUSPENDED  - Was approved but admin temporarily hid it
```

---

## User Flow

### User Submits Listing
1. Fills all 10 steps on `/add-listing/1-10`
2. Clicks "Publish listing" on step 10
3. Listing saved with status: **PENDING**
4. Redirected to success page: "Your listing is pending review"

### Admin Reviews Listing
1. Goes to admin dashboard `/namibiaservices`
2. Clicks "Listings" tab
3. Sees table of PENDING listings
4. Clicks listing to open details modal
5. Reviews listing info, images, pricing
6. Clicks "Approve", "Reject", or "Suspend"
7. If reject: enters reason in textarea
8. Listing status updated immediately

### User Receives Update
1. Check database for approved listings
2. Approved listings visible on `/listings` page
3. User sees approved badge on their dashboard
4. If rejected: user sees rejection reason with option to edit

---

## Files to Create/Modify

### Create (New)
- [ ] `src/app/api/admin/listings/route.ts` - List & filter listings
- [ ] `src/app/api/admin/listings/[id]/route.ts` - Update listing status

### Modify (Existing)
- [ ] `prisma/schema.prisma` - Add ListingStatus enum & fields
- [ ] `src/app/namibiaservices/page.tsx` - Add listings tab & modal
- [ ] `src/usersdashboard/page.tsx` - Show user's listings with status
- [ ] `src/app/listings/page.tsx` - Filter out non-approved listings
- [ ] Database migration - Update ListingStatus values

---

## API Endpoint Specifications

### GET /api/admin/listings
```typescript
Query Parameters:
- status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
- search: string (searches title, city, businessName)
- businessId: string
- page: number
- limit: number

Response:
{
  listings: Listing[],
  total: number,
  page: number,
  limit: number
}
```

### PATCH /api/admin/listings/[id]
```typescript
Body:
{
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED',
  rejectionReason?: string  // Required if status is REJECTED
}

Response:
{
  listing: Listing,
  message: string
}
```

---

## Summary

**Current State**: ✅ Business approval system exists and works well
**Missing**: ❌ Listing approval system - no admin interface or API

**To Enable Listing Approvals**: Create similar approval workflow for listings as exists for businesses, using the business approval code as a template.
