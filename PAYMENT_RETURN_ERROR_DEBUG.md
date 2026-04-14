# Payment Return URL Error - Debugging Guide

## Current Error
```
https://www.namibiaservices.com/?error=redirect_failed
```

## Root Cause Analysis

The error `redirect_failed` means an exception is being thrown in the catch block of the return handler. The payment record with `payRequestId = 12B77CD7-5A09-42B0-9891-51ED7FDC5CE6` doesn't exist in the database.

### Why This Happens

1. **Frontend doesn't extract PAY_REQUEST_ID** from PayGate's initiate.trans response
   - Possibly a CORS error when fetching
   - Response parsing fails
   - Frontend fetch throws exception

2. **save-pay-request endpoint is never called**
   - If extraction fails, save never happens
   - payRequestId stays NULL in database

3. **Return URL handler can't find payment**
   - Queries: WHERE payRequestId = '12B77CD7-...'
   - Database has: payRequestId = NULL
   - Result: payment_not_found (caught as exception)

---

## Debugging Steps

### Step 1: Check Browser Console
Open DevTools (F12) and go to **Console** tab:

**Look for these logs:**
```
[Payment Flow] Step 1 Complete: Received params and URLs ✅
[Payment Flow] Step 2: Submitting to initiate.trans... 
[Payment Flow] Received initiate.trans response
[Payment Flow] Step 2 Complete: Extracted PAY_REQUEST_ID: ... ✅
[Payment Flow] Step 3: Saving PAY_REQUEST_ID to database...
[Payment Flow] Step 3 Complete: PAY_REQUEST_ID saved ✅
```

**If you see:**
- ✅ All steps: Frontend is working, database query issue
- ❌ Steps 2-3 missing: CORS error on initiate.trans
- ❌ Step 3 missing after Step 2: save-pay-request failed

### Step 2: Check Server Logs
Look for logs containing `[Return Handler]` and `[Save PAY_REQUEST_ID]`:

**Expected logs:**
```
[Return Handler] Received from PayGate: { payRequestId: '12B77CD7-...', ... }
[Return Handler] Looking up payment with payRequestId: 12B77CD7-...
[Return Handler] Query returned: 1 records
[Return Handler] Payment found: { id: '...', ... }
```

**Error logs would show:**
```
[Return Handler] Payment not found for payRequestId: 12B77CD7-...
[Return Handler] This may mean save-pay-request endpoint was not called successfully
```

---

## Solution Options

### Option A: Use Server-Side Proxy (Recommended if CORS Issues)

The new `/api/subscriptions/initiate` endpoint handles everything server-side.

**Update SubscriptionPlans.tsx:**

Replace Step 2 in `handleSubscribe`:
```typescript
// OLD: Direct fetch to PayGate (may have CORS issues)
const initiateResponse = await fetch(initiateUrl, {
  method: 'POST',
  body: initiateFormData,
});

// NEW: Use server-side proxy
console.log('[Payment Flow] Step 2: Calling server proxy...');

const initiateResponse = await fetch('/api/subscriptions/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ params, reference }),
});

const initiateData = await initiateResponse.json();

if (!initiateData.success) {
  console.error('[Payment Flow] Initiate failed:', initiateData.message);
  alert('Payment error: ' + initiateData.message);
  setProcessingTier(null);
  return;
}

const payRequestId = initiateData.payRequestId;
console.log('[Payment Flow] Step 2 Complete: Extracted PAY_REQUEST_ID:', payRequestId);

// SKIP Step 3 (save-pay-request) - already done by server proxy
console.log('[Payment Flow] Step 3: Skipping (already saved by server)');
```

### Option B: Fix Direct Fetch (If Browser Supports It)

Add CORS handling to the direct fetch:
```typescript
const initiateResponse = await fetch(initiateUrl, {
  method: 'POST',
  body: initiateFormData,
  mode: 'cors',  // Explicit CORS mode
  credentials: 'omit',  // Don't send credentials
});
```

### Option C: Debug Current Implementation

Add detailed logging to identify the exact failure point:
```typescript
console.log('[Payment Flow] Step 2: Raw response status:', initiateResponse.status);
console.log('[Payment Flow] Step 2: Raw response headers:', {
  'content-type': initiateResponse.headers.get('content-type'),
  'content-length': initiateResponse.headers.get('content-length'),
});

const initiateHtml = await initiateResponse.text();
console.log('[Payment Flow] Step 2: Response length:', initiateHtml.length);
console.log('[Payment Flow] Step 2: First 500 chars:', initiateHtml.substring(0, 500));
```

---

## Database State to Check

```sql
-- Check if payment exists with NULL payRequestId
SELECT id, transactionRef, payRequestId, status, createdAt
FROM payments
WHERE transactionRef LIKE 'NS_SUB_%'
ORDER BY createdAt DESC
LIMIT 5;

-- Expected:
-- id: cuid_xxx
-- transactionRef: NS_SUB_business_xxx
-- payRequestId: NULL  ← Should be set to PAY_REQUEST_ID but isn't!
-- status: PENDING
```

---

## What to Do Next

### Immediate Action
1. Open browser DevTools after clicking Subscribe
2. Check console for `[Payment Flow]` logs
3. Note where logs stop or if you see errors
4. Check server logs for corresponding entries

### Based on Logs Found

**If logs show Steps 1-2 complete but Step 3 missing:**
- Issue: save-pay-request endpoint failed
- Check server logs for `[Save PAY_REQUEST_ID] Error`
- Verify payment record exists by reference

**If logs show Step 2 missing or error:**
- Issue: CORS error or fetch failed
- Solution: Use Option A (server-side proxy)
- Update frontend to use `/api/subscriptions/initiate`

**If logs show all steps but still error:**
- Issue: Database query or update failed
- Check server logs for exact error
- May need to regenerate Prisma client

---

## Using the New Server-Side Proxy

File: `src/app/api/subscriptions/initiate/route.ts`

This endpoint:
- ✅ Submits to PayGate's initiate.trans
- ✅ Extracts PAY_REQUEST_ID from response
- ✅ Saves to database
- ✅ Returns payRequestId to frontend
- ✅ Handles CORS transparently

**No other code changes needed - endpoint is ready to use**

---

## New Payment Flow with Server Proxy

```
Frontend Click Subscribe
  ↓
Step 1: GET /api/subscriptions/checkout ✅
  ← Response: params, initiateUrl, reference
  
Step 2: POST /api/subscriptions/initiate (NEW!)
  ← Internally calls PayGate initiate.trans
  ← Extracts PAY_REQUEST_ID
  ← Saves to database
  ← Response: { success, payRequestId }
  
Step 3: SKIPPED (already saved by Step 2)
  
Step 4: POST /api/subscriptions/process
  ← Response: params for process.trans
  
Step 5: Submit to PayGate process.trans
  ← User enters payment details
  
PayGate → Callback → Success/Failure
```

---

## Testing with Server Proxy

1. Update `SubscriptionPlans.tsx` to use `/api/subscriptions/initiate`
2. Deploy changes
3. Try subscription again
4. Check console for: `[Payment Flow] Step 2 Complete: Extracted PAY_REQUEST_ID: ...`
5. If successful: ✅ Continue to payment page

---

## Immediate Recommendation

**Try the server-side proxy approach (Option A):**

1. Update `src/app/subscription/SubscriptionPlans.tsx`
2. Change Step 2 to call `/api/subscriptions/initiate`
3. Skip Step 3 (save-pay-request)
4. Rest stays the same
5. Deploy and test

This will:
- ✅ Avoid CORS issues
- ✅ Guarantee PAY_REQUEST_ID is saved
- ✅ Eliminate the `redirect_failed` error
- ✅ Complete the payment flow successfully

