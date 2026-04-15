# Role-Based Access Control Implementation Guide

## Overview
This document provides a detailed implementation guide for enforcing strict role-based access control across the Namibia Services application.

---

## 🛡️ Implementation Strategy

### Level 1: Middleware (Already Partially Implemented)
**File**: `middleware.ts`

✅ Currently implemented:
- Route matching and protection
- Role-based redirects
- Public route whitelist

📝 Improvements needed:
- More granular pathmatching for nested routes
- Better error handling for denied access

### Level 2: Page Component Guards (To Implement)
**Files**: `src/app/**/page.tsx`

Every protected page should include role validation:

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedPageProps {
  requiredRoles: string[];
}

export default function UserDashboard() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      redirect('/login');
      return;
    }

    if (!['USER', 'ADMIN'].includes(session.user?.role)) {
      redirect('/unauthorized');
    }
  }, [session, status]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    // Page content
  );
}
```

### Level 3: API Route Protection
**Files**: `src/app/api/**/route.ts`

Every API endpoint must verify user role:

```typescript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Get session
  const session = await getServerSession(authOptions);

  // Check authentication
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check authorization (role)
  if (session.user?.role !== 'BUSINESS') {
    return NextResponse.json(
      { error: 'Forbidden - BUSINESS role required' },
      { status: 403 }
    );
  }

  // Check subscription status (if needed)
  const subscription = await getSubscriptionStatus(session.user.id);
  if (!subscription || subscription.status !== 'ACTIVE') {
    return NextResponse.json(
      { error: 'Subscription required' },
      { status: 402 }
    );
  }

  // Process request
  try {
    // ... API logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Level 4: Component-Level Access Control
**Pattern**: Wrap components with role checks

```typescript
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return fallback || <div>Please log in</div>;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return fallback || (
      <div className="p-4 bg-red-50 rounded text-red-600">
        You don't have permission to access this
      </div>
    );
  }

  return children;
}

// Usage
<RoleGuard allowedRoles={['BUSINESS']}>
  <PromotionsList />
</RoleGuard>
```

---

## 📋 Detailed Role-Based Authorization Matrix

### USER Role
**Allowed Actions:**
- Read listings, promotions, government directory, blog
- Write reviews for businesses
- Manage personal favorites/wishlist
- View personal profile and account
- Change password, update profile
- Delete own account

**API Endpoints to Protect:**
- ✅ `POST /api/reviews` - Only own reviews
- ✅ `POST /api/user/favorites` - Only own favorites
- ✅ `PATCH /api/user/profile` - Only own profile
- ✅ `POST /api/user/change-password` - Own password only
- ✅ `DELETE /api/user/delete-account` - Own account only

**Deny Access:**
- ❌ API endpoints for business operations
- ❌ Business dashboard routes
- ❌ Admin features

### BUSINESS Role
**Allowed Actions:**
- Create, read, update, delete own listings
- Create, read, update, delete promotions
- Manage branches
- Manage subscriptions/payments
- View own analytics
- Manage featured space bookings
- Manage memberships

**API Endpoints to Protect:**
- ✅ `GET/POST /api/business/listings` - Own business only
- ✅ `PATCH /api/business/listings/[id]` - Own business only
- ✅ `DELETE /api/business/listings/[id]` - Own business only
- ✅ `GET/POST /api/business/branches` - Own business only
- ✅ `POST /api/subscriptions/checkout` - Own business only
- ✅ `POST /api/subscriptions/cancel` - Own business only

**Deny Access:**
- ❌ Admin endpoints
- ❌ Other business listings/operations
- ❌ User management features

### ADMIN Role
**Allowed Actions:**
- Full access to all features
- Manage users
- Approve/reject listings
- Manage memberships
- Approve/reject promotions
- View all analytics
- System configuration

**API Endpoints to Protect:**
- All admin endpoints require `ADMIN` role verification
- ✅ `/api/admin/*` - Strict admin-only access

**Additional Checks:**
- Log all admin actions for audit trail
- Prevent admins from modifying other admin accounts without super-admin role

---

## 🔐 Implementation Checklist

### Phase 1: Core Page Protection
- [ ] Add role checks to all `/business/*` pages
- [ ] Add role checks to all `/usersdashboard/*` pages
- [ ] Add role checks to all `/admin/*` pages
- [ ] Add role checks to `/subscription/*` pages
- [ ] Redirect unauthorized users to `/unauthorized`

### Phase 2: API Endpoint Protection
- [ ] Add session verification to all `/api/business/*` routes
- [ ] Add session verification to all `/api/subscriptions/*` routes
- [ ] Add session verification to all `/api/user/*` routes (check user ownership)
- [ ] Add session verification to all `/api/admin/*` routes
- [ ] Return proper status codes (401/403)

### Phase 3: Subscription-Based Access
- [ ] Check subscription status for paid features
- [ ] Prevent access to premium features without active subscription
- [ ] Show upgrade prompts for free-tier users
- [ ] Verify subscription tier matches feature access

### Phase 4: Features by Subscription Tier
- [ ] Gate photo upload limit by tier
- [ ] Gate promotion limit by tier
- [ ] Gate branch limit by tier
- [ ] Gate featured space access by tier
- [ ] Gate analytics access by tier

### Phase 5: Audit & Logging
- [ ] Log all admin actions
- [ ] Log failed authorization attempts
- [ ] Log subscription changes
- [ ] Create audit trails for important operations

### Phase 6: Testing & Validation
- [ ] Test USER accessing BUSINESS routes (should deny)
- [ ] Test BUSINESS accessing ADMIN routes (should deny)
- [ ] Test ADMIN accessing USER routes (should allow)
- [ ] Test accessing other user's data (should deny)
- [ ] Test expired sessions
- [ ] Test missing/invalid tokens

---

## 🛠️ Utility Functions to Create

### 1. Role Verification Utility
```typescript
// lib/role-utils.ts

export function requireRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

export function requireExactRole(userRole: string, exactRole: string): boolean {
  return userRole === exactRole;
}

export function requireOneOf(userRole: string, roles: string[]): boolean {
  return roles.includes(userRole);
}

export function isAdmin(userRole: string): boolean {
  return userRole === 'ADMIN';
}

export function isBusiness(userRole: string): boolean {
  return userRole === 'BUSINESS';
}

export function isUser(userRole: string): boolean {
  return userRole === 'USER';
}
```

### 2. Session Verification Utility
```typescript
// lib/session-utils.ts

export async function getAuthorizedSession(
  requiredRole?: string
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Unauthorized');
  }

  if (requiredRole && session.user?.role !== requiredRole) {
    throw new Error('Forbidden');
  }

  return session;
}

export async function getBusinessSession() {
  return getAuthorizedSession('BUSINESS');
}

export async function getAdminSession() {
  return getAuthorizedSession('ADMIN');
}

export async function getUserSession() {
  return getAuthorizedSession('USER');
}
```

### 3. API Response Utility
```typescript
// lib/api-response.ts

export function unauthorized() {
  return NextResponse.json(
    { error: 'Unauthorized - Please log in' },
    { status: 401 }
  );
}

export function forbidden(reason = 'You do not have permission') {
  return NextResponse.json(
    { error: `Forbidden - ${reason}` },
    { status: 403 }
  );
}

export function notFound() {
  return NextResponse.json(
    { error: 'Resource not found' },
    { status: 404 }
  );
}
```

---

## 📍 Routes by Role (Complete Mapping)

### PUBLIC ROUTES (No Authentication Required)
```
✅ GET  /
✅ GET  /login
✅ GET  /signup
✅ GET  /about
✅ GET  /contact
✅ GET  /advertise
✅ GET  /listings
✅ GET  /listings/[id]
✅ GET  /categories
✅ GET  /promotions
✅ GET  /promotions/[id]
✅ GET  /government-directory
✅ GET  /blog
✅ GET  /blog/[...slug]
✅ GET  /weather
```

### USER ROUTES (USER + ADMIN)
```
✅ GET  /usersdashboard
✅ GET  /usersdashboard/account
✅ GET  /usersdashboard/account-settings
✅ GET  /usersdashboard/account-password
✅ GET  /usersdashboard/account-billing
✅ GET  /usersdashboard/account-savelists
✅ POST /api/reviews
✅ POST /api/user/favorites
✅ PATCH /api/user/profile
✅ POST /api/user/change-password
✅ DELETE /api/user/delete-account
```

### BUSINESS ROUTES (BUSINESS + ADMIN)
```
✅ GET  /business
✅ GET  /business/settings
✅ GET  /business/add-listing
✅ GET  /business/listings
✅ GET  /business/listings/[id]/edit
✅ GET  /business/promotions
✅ GET  /business/promotions/add
✅ GET  /business/promotions/edit/[id]
✅ GET  /business/branches
✅ GET  /business/[id]/subscription
✅ GET  /business/[id]/subscription/plans
✅ POST /api/business/listings
✅ GET  /api/business/my-businesses
✅ GET  /api/subscriptions/status
✅ POST /api/subscriptions/checkout
✅ POST /api/subscriptions/cancel
```

### ADMIN ROUTES (ADMIN ONLY)
```
✅ GET  /solidacare/data/add/admin
✅ GET  /namibiaservices
✅ GET  /namibiaservices/settings
✅ GET  /api/admin/users
✅ GET  /api/admin/users/[id]
✅ GET  /api/admin/reviews
✅ GET  /api/admin/listings
✅ GET  /api/admin/dashboard
```

---

## 🚨 Security Considerations

1. **Never Trust Client-Side Role** - Always verify role on server (API/Page components)
2. **Check Ownership** - Verify user owns resource before allowing modification
3. **Check Subscription** - Verify active subscription for premium features
4. **Use Tokens** - Rely on JWT tokens from next-auth, not localStorage
5. **Audit Log** - Log all sensitive operations
6. **Rate Limiting** - Prevent brute force attacks on API endpoints
7. **Input Validation** - Validate all user inputs
8. **CORS** - Configure appropriate CORS policies

---

## 📝 Testing Guide

### Unit Tests
```typescript
describe('Role Utils', () => {
  test('requireRole should return true for allowed role', () => {
    expect(requireRole('BUSINESS', ['BUSINESS', 'ADMIN'])).toBe(true);
  });

  test('requireRole should return false for denied role', () => {
    expect(requireRole('USER', ['BUSINESS', 'ADMIN'])).toBe(false);
  });
});
```

### Integration Tests
```typescript
describe('API Endpoints', () => {
  test('POST /api/business/listings should deny USER role', async () => {
    const response = await fetch('/api/business/listings', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    expect(response.status).toBe(403);
  });

  test('POST /api/business/listings should allow BUSINESS role', async () => {
    const response = await fetch('/api/business/listings', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${businessToken}` },
    });
    expect(response.status).toBe(200);
  });
});
```

---

## 🔄 Workflow Example: Creating a Listing

**Scenario**: Business owner creates a new listing

1. **Frontend**: User clicks "Add Listing" → Navigate to `/business/add-listing`
   - Page component checks session role === 'BUSINESS'
   - If not, redirect to `/unauthorized`

2. **Form Submission**: User submits form
   - Component sends POST to `/api/business/listings`

3. **API Validation**: Server receives request
   - Verify session exists
   - Check role === 'BUSINESS'
   - Check subscription status === 'ACTIVE'
   - Check subscription tier supports listing feature
   - Verify listing count < tier limit
   - Save listing

4. **Response**: Return success/error status

5. **Audit**: Log the action with user ID, timestamp, action type

---

This implementation ensures a secure, role-based access control system throughout the application.
