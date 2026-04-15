# Quick Reference - Role-Based Access Control Status

## 📊 Current Implementation Status

### ✅ ALREADY IMPLEMENTED

#### Middleware-Level Protection
- [x] Route-based role checking in `middleware.ts`
- [x] Auth-required vs public route distinction
- [x] Auto-redirect to role-based dashboards
- [x] Basic role check on `/business/*` routes
- [x] Basic role check on `/usersdashboard/*` routes

#### Authentication
- [x] NextAuth integration
- [x] JWT token strategy
- [x] Role stored in session
- [x] Login/Signup pages
- [x] Session persistence

#### Page Components
- [x] User Dashboard (`/usersdashboard`)
- [x] Business Dashboard (`/business`)
- [x] Some basic role awareness

---

## ❌ NEEDS IMPLEMENTATION

### 1. Page-Level Role Guards (HIGH PRIORITY)
```
[ ] Add `useSession()` checks to ALL protected pages
[ ] Add redirect to `/unauthorized` for denied access
[ ] Add role validation in useEffect on:
    - /usersdashboard/**
    - /business/**
    - /subscription/**
    - All management pages
```

**Files to Update:**
- `src/app/usersdashboard/page.tsx`
- `src/app/usersdashboard/[tab]/page.tsx` (if exists)
- `src/app/account-*/page.tsx` (all account pages)
- `src/app/business/page.tsx`
- `src/app/business/*/page.tsx` (all business sub-pages)
- `src/app/subscription/*/page.tsx` (subscription pages)
- `src/app/business/*/edit/page.tsx` (edit pages)

### 2. API Route Protection (HIGH PRIORITY)
```
[ ] Add getServerSession() to EVERY API route
[ ] Verify role before processing request
[ ] Return 401/403 status codes appropriately
[ ] Check ownership/authorization (not just role)
```

**Files to Update (59 API routes):**
- `/api/user/**` - Verify own data only
- `/api/business/**` - Verify own business
- `/api/subscriptions/**` - Verify user owns subscription
- `/api/admin/**` - Verify admin role only
- `/api/reviews/**` - Verify own review or admin

### 3. Subscription-Based Gating (MEDIUM PRIORITY)
```
[ ] Check subscription status on:
    - Promotion creation (business)
    - Branch creation (business)
    - Photo uploads (business)
    - Featured space booking (business)
[ ] Implement tier-based feature limits
[ ] Show upgrade prompts for free-tier users
```

### 4. Component-Level Access Control (MEDIUM PRIORITY)
```
[ ] Create RoleGuard component
[ ] Wrap all protected features with role checks
[ ] Show appropriate fallback UI for denied access
[ ] Use throughout app where needed
```

### 5. Utility Functions (LOW PRIORITY)
```
[ ] Create role verification utilities (lib/role-utils.ts)
[ ] Create session check utilities (lib/session-utils.ts)
[ ] Create API response helpers (lib/api-response.ts)
[ ] Create subscription check utilities
```

---

## 🎯 Implementation Priority

### PRIORITY 1 (DO FIRST - Breaking Security Issues)
1. Protect `/api/business/**` routes
   - Add session check
   - Verify user owns business
   - Block other users from accessing
   
2. Protect `/api/subscriptions/**` routes
   - Verify user owns subscription
   - Check subscription status for operations
   
3. Protect `/api/user/**` routes
   - Verify own user data only
   - Prevent accessing other user's data

### PRIORITY 2 (DO SECOND - Page-Level Protection)
4. Add role guards to all protected pages
   - Verify role in useEffect
   - Redirect if unauthorized
   - Show loading state

5. Add authorization checks to admin pages
   - Strict admin-only access

### PRIORITY 3 (DO THIRD - Feature Enhancement)
6. Add subscription gating
   - Check tier before allowing features
   - Show upgrade prompts

7. Create utility functions
   - Reusable role checks
   - Consistent error handling

---

## 📋 Test Checklist (After Implementation)

### Access Control Tests
- [ ] User cannot access `/business` dashboard
- [ ] Business cannot access `/usersdashboard` 
- [ ] Non-admin cannot access `/admin` routes
- [ ] User cannot access other user's data via API
- [ ] Business cannot access other business's data via API
- [ ] Free-tier business cannot access premium features
- [ ] Subscription required endpoints return 402 when no subscription

### Permission Tests
- [ ] USER can write reviews ✅
- [ ] USER cannot create listings ❌
- [ ] BUSINESS can create listings ✅
- [ ] BUSINESS cannot manage users ❌
- [ ] ADMIN can do everything ✅
- [ ] ADMIN cannot create user accounts directly (signup only) ⚠️

### Scenario Tests
1. **User Login Flow**
   - [ ] Login as USER → redirects to `/usersdashboard` ✅
   - [ ] Try accessing `/business` → redirect to `/unauthorized` ✅
   - [ ] Try accessing `/api/business/listings` → 403 error ✅

2. **Business Login Flow**
   - [ ] Login as BUSINESS → redirects to `/business` ✅
   - [ ] Try accessing `/usersdashboard` → redirect to `/unauthorized` ✅
   - [ ] Can create listing → Success ✅
   - [ ] Cannot create another business's listing → 403 error ✅

3. **Admin Login Flow**
   - [ ] Can view user data ✅
   - [ ] Can view business data ✅
   - [ ] Can approve listings ✅

---

## 🔧 Template: Protecting an API Route

Use this template for all new API routes:

```typescript
// src/app/api/business/listings/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check authorization (role)
    if (session.user.role !== 'BUSINESS') {
      return NextResponse.json(
        { error: 'Only business users can create listings' },
        { status: 403 }
      );
    }

    // 3. Get user's business
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id as string },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // 4. Check subscription (if needed)
    const subscription = await prisma.subscription.findUnique({
      where: { businessId: business.id },
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Active subscription required' },
        { status: 402 }
      );
    }

    // 5. Parse and validate request
    const body = await req.json();
    // ... validation logic

    // 6. Process request
    const listing = await prisma.listing.create({
      data: {
        ...body,
        businessId: business.id,
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🔧 Template: Protecting a Page

Use this template for all protected pages:

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PageProps {}

export default function MyProtectedPage({}: PageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Wait for session to load
    if (status === 'loading') return;

    // 2. Check authentication
    if (!session) {
      router.push('/login');
      return;
    }

    // 3. Check authorization (role)
    if (!['BUSINESS', 'ADMIN'].includes(session.user?.role || '')) {
      router.push('/unauthorized');
      return;
    }

    // If all checks pass
    setIsAuthorized(true);
  }, [session, status, router]);

  // Show loading while checking authorization
  if (status === 'loading' || !isAuthorized) {
    return <LoadingSpinner />;
  }

  // Render protected content
  return (
    <div>
      <h1>Authorized Content</h1>
      {/* Page content */}
    </div>
  );
}
```

---

## 📚 Files Generated for Reference

1. **ROLE_BASED_FEATURES.md** - Complete feature list by role
2. **ROLE_BASED_ACCESS_IMPLEMENTATION.md** - Implementation guide with examples
3. This file - Quick reference and checklist

---

## 🚀 Next Steps

1. **Start with API Routes**
   - Pick highest priority routes first
   - Add template-based role/ownership checks
   - Test with curl/Postman

2. **Then Add Page Guards**
   - Update each protected page component
   - Test navigation and redirects

3. **Finally Add Subscriptions**
   - Check subscription status
   - Implement feature gating

4. **Create Utilities** (Optional but recommended)
   - Reduces code duplication
   - Makes maintenance easier

---

## 📞 Questions?

Refer to:
- `ROLE_BASED_FEATURES.md` - What features exist
- `ROLE_BASED_ACCESS_IMPLEMENTATION.md` - How to implement
- `middleware.ts` - Current auth flow
- `src/lib/auth.ts` - Auth configuration
