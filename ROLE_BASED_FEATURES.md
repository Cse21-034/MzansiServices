# Namibia Services - Role-Based Features & Access Control

## Current User Roles
- **USER** - Individual users / customers
- **BUSINESS** - Business owners
- **ADMIN** - System administrators

---

## 📋 USER ROLE FEATURES

### Dashboard & Home
- ✅ User Dashboard (`/usersdashboard`) - Main hub for personal activities
- ✅ Home Page (`/`) - Public landing page
- ✅ Account Navigation Access

### Profile & Settings
- ✅ Account Settings (`/account-settings`) - Edit personal profile
- ✅ Account Password (`/account-password`) - Change password
- ✅ Account Billing (`/account-billing`) - Billing information
- ✅ Delete Account (`/api/user/delete-account`)
- ✅ Change Password (`/api/user/change-password`)

### Browsing & Discovery
- ✅ Listings Browse (`/listings`) - View all business listings
- ✅ Listings Detail (`/listings/[id]`) - View specific business details
- ✅ Categories (`/categories`) - Browse business categories
- ✅ Category Detail (`/category/[slug]`) - View specific category
- ✅ Property Listings (`/property-listings`) - View real estate listings
- ✅ Property Detail (`/property-listings/[id]`) - View specific property
- ✅ Real Estate Listing (`/listing-real-estate`) - Browse real estate
- ✅ Real Estate Map View (`/listing-real-estate-map`) - Map-based real estate search
- ✅ Listing Detail Stay (`/listing-stay-detail/[slug]`) - View stay listings
- ✅ Listing Stay Map (`/listing-stay-map`) - Map-based stay search

### Favorites & Wishlists
- ✅ Save Lists (`/account-savelists`) - Manage saved/favorited items
- ✅ Add to Favorites (API: `/api/user/favorites`)
- ✅ View Favorites

### Reviews & Ratings
- ✅ Write Reviews (`/api/reviews`) - Submit business reviews
- ✅ View Reviews (`/api/user/reviews`)
- ✅ Rate Businesses
- ✅ View Ratings & Reviews on Business Listings

### Promotions
- ✅ Promotions Browse (`/promotions`) - View all active promotions
- ✅ Promotion Detail (`/promotions/[id]`) - View specific promotion

### Public Information
- ✅ Government Directory (`/government-directory`) - Browse government services
- ✅ Blog (`/blog`) - Read blog posts
- ✅ Blog Post Detail (`/blog/[...slug]`) - Read specific article
- ✅ About (`/about`) - About page
- ✅ Contact (`/contact`) - Contact form
- ✅ Weather (`/weather`) - Weather information

### Subscriptions (Limited)
- ✅ View Subscription Plans - Can see and explore subscription tiers
- ✅ Advertise (`/advertise`) - Information about advertising options

### API Access (User)
- GET `/api/user/profile` - Get profile data
- GET `/api/user/favorites` - Get favorited items
- GET `/api/user/reviews` - Get submitted reviews
- GET `/api/user/listings` - Get created listings
- GET `/api/user/businesses` - Get owned businesses
- GET `/api/user/dashboard` - Get dashboard data

---

## 💼 BUSINESS ROLE FEATURES

### Dashboard & Home
- ✅ Business Dashboard (`/business/page.tsx`) - Main business hub
  - Overview Tab
  - Profile Tab
  - Products Tab (Business Listings)
  - Property Tab (Property Listings)
  - Promotions Tab
  - Membership Tab
  - Analytics Tab
  - Branches Tab
  - My Subscription Tab
  - Upgrade Plans Tab

### Business Profile & Settings
- ✅ Business Settings (`/business/settings`) - Manage business settings
- ✅ Business Profile Edit - Update company information
- ✅ Profile Image Upload
- ✅ Business Location/Address
- ✅ Business Contact Information
- ✅ Business Description

### Listings Management
- ✅ Add Business Listing (`/business/add-listing`)
- ✅ View Listings (`/business/listings`) - Manage all listings
- ✅ Edit Listing (`/business/listings/[id]/edit`)
- ✅ Delete Listing
- ✅ Publish/Unpublish Listings
- ✅ Bulk Listing Management
- ✅ Image Upload for Listings
- ✅ Listing Analytics (API: `/api/business/listings`)

### Property Listings (If Tier Allows)
- ✅ Add Property Listing (`/api/business/property-listings`)
- ✅ Manage Property Listings
- ✅ Property Images
- ✅ Property Details

### Promotions Management
- ✅ Create Promotion (`/business/promotions/add`)
- ✅ View Promotions (`/business/promotions`)
- ✅ Edit Promotion (`/business/promotions/edit/[id]`)
- ✅ Delete Promotion
- ✅ Schedule Promotions
- ✅ Promotion Analytics

### Branches Management
- ✅ Add Branch (`/business/branches`)
- ✅ View Branches
- ✅ Edit Branch
- ✅ Delete Branch
- ✅ Multiple Branches Support (if tier allows)
- ✅ Branch-specific Details

### Membership Management
- ✅ View Memberships (`/business/memberships` - via API)
- ✅ Manage Membership Tiers
- ✅ Membership Benefits
- ✅ Member Directory

### Subscriptions & Payments
- ✅ View Subscription Status (`/business/[id]/subscription`)
- ✅ View Subscription Plans (`/business/[id]/subscription/plans`)
- ✅ Upgrade/Downgrade Plans
- ✅ Manage Subscription (`/subscription/SubscriptionManagement`)
- ✅ View Subscription Features
- ✅ Cancel Subscription (API: `/api/subscriptions/cancel`)
- ✅ Checkout (`/checkout`)
- ✅ Payment Processing (PayGate integration)
  - Initiate Payment (`/api/subscriptions/initiate`)
  - Process Payment (`/api/subscriptions/process`)
  - Payment Callback (`/api/subscriptions/callback`)
  - Payment Return (`/api/subscriptions/return`)
- ✅ Payment Success Page (`/business/[id]/subscription/success`)

### Analytics & Insights
- ✅ Analytics Dashboard - View business performance
- ✅ Visitor Statistics
- ✅ Listing Views
- ✅ Conversion Metrics
- ✅ Promotion Performance

### Featured Hero Space
- ✅ Book Featured Space (API: `/api/featured-hero-space`)
- ✅ View Featured Bookings
- ✅ Manage Featured Promotions

### API Access (Business)
- GET `/api/business/profile` - Get business profile
- GET/POST `/api/business/listings` - Manage listings
- GET/POST `/api/business/property-listings` - Manage properties
- GET/POST `/api/business/promotions` - Manage promotions
- GET/POST `/api/business/branches` - Manage branches
- GET `/api/business/memberships` - Manage memberships
- GET `/api/business/my-businesses` - Get all owned businesses
- GET `/api/subscriptions/status` - Get subscription status

### Features Based on Subscription Tier
- **WILD_HORSES (Free)**
  - 1 Photo max
  - 0 Promotions
  - 1 Branch
  - Basic listing
  
- **DESERT_ELEPHANTS**
  - 5 Photos
  - 2 Promotions
  - Multiple branches
  - Enhanced profile
  - Social media links
  
- **DESERT_LIONS (Premium)**
  - Unlimited photos
  - Unlimited promotions
  - Unlimited branches
  - Featured badge
  - Top search placement
  - Dedicated support

---

## 🔐 ADMIN ROLE FEATURES

### Dashboard & Settings
- ✅ Admin Dashboard (`/solidacare/data/add/admin` or `/admin`)
- ✅ Admin Settings (`/namibiaservices/settings`)
- ✅ System Configuration 
- ✅ Database Management

### User Management
- ✅ View All Users (API: `/api/admin/users`)
- ✅ Edit User (API: `/api/admin/users/[id]`)
- ✅ Delete User
- ✅ Change User Role
- ✅ User Statistics
- ✅ User Activity Logs

### Business Management
- ✅ Approve Businesses
- ✅ Reject Businesses
- ✅ Suspend/Ban Businesses
- ✅ View Business Details
- ✅ View Business Analytics
- ✅ Manage Business Listings
- ✅ Direct Listing Approval/Rejection

### Listings & Properties Management
- ✅ Approve Listings (API: `/api/admin/listings`)
- ✅ Reject Listings
- ✅ Delete Listings
- ✅ Feature Listings
- ✅ Manage Property Listings (API: `/api/admin/property-listings`)
- ✅ View All Listings

### Reviews Management
- ✅ View All Reviews (API: `/api/admin/reviews`)
- ✅ Approve Reviews
- ✅ Delete Reviews
- ✅ Flag Inappropriate Content
- ✅ Manage Review Settings

### Membership Management
- ✅ Create Membership Tiers (API: `/api/admin/memberships`)
- ✅ Edit Membership Plans
- ✅ Delete Membership Plans
- ✅ View Member List
- ✅ Manage Member Benefits

### Featured Hero Space Management
- ✅ Manage Featured Space (`/api/featured-hero-space`)
- ✅ Approve Space Bookings
- ✅ Process Featured Space Payments
- ✅ Handle Space Callbacks
- ✅ View Featured Space Analytics

### Geocoding & Data
- ✅ Geocode Businesses (API: `/api/admin/geocode-businesses`)
- ✅ Update Location Data
- ✅ Verify Business Addresses

### Categories Management
- ✅ View Categories (API: `/api/categories`)
- ✅ Check Categories (API: `/api/admin/check-categories`)
- ✅ Manage Category Data

### System & Emails
- ✅ Send Emails (API: `/api/emails/send`)
- ✅ Email Templates
- ✅ Email Logs

### Analytics & Reporting
- ✅ System Dashboard (API: `/api/admin/dashboard`)
- ✅ User Statistics
- ✅ Business Statistics
- ✅ Revenue Metrics
- ✅ Subscription Metrics
- ✅ Featured Space Revenue

### API Access (Admin)
- GET/POST/DELETE `/api/admin/users` - User management
- GET/POST/DELETE `/api/admin/users/[id]` - Specific user operations
- GET/POST/DELETE `/api/admin/listings` - Listing approval
- GET/POST/DELETE `/api/admin/property-listings` - Property management
- GET/POST/DELETE `/api/admin/reviews` - Review management
- POST `/api/admin/memberships` - Membership management
- POST `/api/admin/geocode-businesses` - Data management
- GET `/api/admin/dashboard` - System stats

---

## 🔒 Current Access Control Implementation

### Middleware Routes (middleware.ts)
```
PUBLIC ROUTES:
- / (home page)
- /login
- /signup
- /businesses
- /api/auth/*

PROTECTED ROUTES BY ROLE:

USER Routes:
- /usersdashboard/* (USER & ADMIN only)

BUSINESS Routes:
- /business/* (BUSINESS & ADMIN only)

ADMIN Routes:
- /botswanaservices/* (ADMIN only)
```

### Auto-Redirect After Login
- **USER** → `/usersdashboard`
- **BUSINESS** → `/business`
- **ADMIN** → Home page (no auto-redirect)

---

## 🚀 Recommendations for Pure Role-Based Access

### 1. **Add Route-Level Guards**
- Verify role on every protected page component
- Component-level role checks before rendering features

### 2. **API-Level Authorization**
- Verify role on every API endpoint
- Return 403 Forbidden for unauthorized access
- Log unauthorized access attempts

### 3. **Feature Flags by Subscription**
- Gate features behind subscription tiers
- Check both role AND subscription status
- Provide upgrade prompts for free-tier users

### 4. **Granular Permission System**
Consider implementing permission scopes:
- `user:profile` - Can edit own profile
- `business:manage_listings` - Can create/edit listings
- `business:view_analytics` - Can view analytics
- `admin:manage_users` - Can manage users
- `admin:approve_listings` - Can approve listings

### 5. **Protected Pages Enhancement**
Add role checks to all pages:
```typescript
// Check role before rendering
if (session?.user?.role !== 'BUSINESS') {
  redirect('/unauthorized')
}
```

### 6. **API Endpoint Security**
All API routes should verify:
```typescript
// Check user role and subscription
if (session?.user?.role !== 'BUSINESS') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

## 📊 Feature Matrix by Role

| Feature | USER | BUSINESS | ADMIN |
|---------|------|----------|-------|
| Browse Listings | ✅ | ✅ | ✅ |
| Write Reviews | ✅ | ✅ | ⚠️ |
| Manage Own Listings | ❌ | ✅ | ✅ |
| Manage All Listings | ❌ | ❌ | ✅ |
| Create Promotions | ❌ | ✅ | ✅ |
| Manage Subscriptions | ❌ | ✅ | ✅ |
| View Analytics | ⚠️ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Approve Listings | ❌ | ❌ | ✅ |
| Manage Memberships | ❌ | ⚠️ | ✅ |

Legend: ✅ = Full Access, ⚠️ = Limited Access, ❌ = No Access
