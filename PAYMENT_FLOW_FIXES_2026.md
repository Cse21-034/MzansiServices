# Payment Flow Fixes - April 14, 2026

## Problem Analysis from Vercel Logs

### The Issue
Users complete payments but see error `/?error=payment_not_found` instead of success page. The subscription IS actually being activated (callback works), but the return handler can't find the payment record.

### Root Cause Identified

Looking at the Vercel logs:

**Timeline of the problem:**
1. ✅ **12:52:23** - Checkout creates payment with `transactionRef: NS_SUB_cmlurjox00002lb04dxepukrv_1776171143660`
2. ❌ **12:52:46** - Callback error: `SyntaxError: Unexpected token 'P', "PAYGATE_ID"...` - **FormData being parsed as JSON!**
3. ❌ **13:17:31** - Return handler gets PAY_REQUEST_ID but "payment not found" - **Field not saved to database**

### The Real Problems

1. **Callback Endpoint** was using `request.json()` but PayGate sends **URL-encoded form data**
   - Error: `Unexpected token 'P'` = trying to parse `PAYGATE_ID=...&PAY_REQUEST_ID=...` as JSON

2. **Initiate Endpoint** logs were missing entirely
   - No evidence that PAY_REQUEST_ID was being extracted or saved
   - Payment records had NULL payRequestId value

3. **Return Endpoint** couldn't find payments because payRequestId was never saved

## Fixes Applied

### 1. Fixed Callback Endpoint (`/api/subscriptions/callback/route.ts`)

**Before:**
```typescript
const data = await request.json();  // ❌ WRONG - PayGate sends form data!
```

**After:**
```typescript
const formData = await request.formData();
const data: Record<string, string> = {};
formData.forEach((value, key) => {
  data[key] = String(value);
});
```

**What this fixes:**
- ✅ Properly parses PayGate's URL-encoded POST data
- ✅ Callback can now successfully process payment notifications
- ✅ Subscription activation will work

### 2. Enhanced Initiate Endpoint (`/api/subscriptions/initiate/route.ts`)

**Added comprehensive logging:**

```typescript
console.log('[Initiate] ===== START =====');
console.log('[Initiate] Submitting to PayGate:', payGate.INITIATE_URL);
console.log('[Initiate] Response status:', response.status);
console.log('[Initiate] ✅ Extracted PAY_REQUEST_ID from HTML:', payRequestId);
console.log('[Initiate] Saving PAY_REQUEST_ID to database...');
console.log('[Initiate] ✅ Successfully saved PAY_REQUEST_ID:', payRequestId);
console.log('[Initiate] ===== END (SUCCESS) =====');
```

**Debug output on failure:**
```typescript
debug: {
  responseLength: html.length,
  responsePreview: html.substring(0, 300),
}
```

**What this fixes:**
- ✅ Clear visibility into PAY_REQUEST_ID extraction
- ✅ Identifies if PayGate response format changed
- ✅ Shows exactly where the flow breaks if it fails

### 3. Simplified & Enhanced Return Handler (`/api/subscriptions/return/route.ts`)

**Changes:**
- ✅ Removed complex raw SQL LEFT JOIN (too error-prone)
- ✅ Uses simple `findUnique` queries on both Payment and Subscription
- ✅ Added detailed step-by-step logging
- ✅ Proper handling of both success (status=1) and failed (status=0) payments
- ✅ Clear error messages for each validation failure

**What this fixes:**
- ✅ No more mysterious "redirect_failed" errors
- ✅ Each failure point clearly logged
- ✅ Handles failed payments gracefully

## Expected Payment Flow Now

```
1. Frontend: User clicks "Subscribe"
   ↓
2. Frontend: fetch(/api/subscriptions/checkout)
   ✅ Backend creates Payment record with transactionRef & payRequestId=NULL
   ↓
3. Frontend: fetch(/api/subscriptions/initiate)
   🔍 [Initiate] ===== START =====
   🔍 [Initiate] Submitting to PayGate...
   🔍 [Initiate] ✅ Extracted PAY_REQUEST_ID from HTML
   🔍 [Initiate] ✅ Successfully saved PAY_REQUEST_ID
   ✅ Backend saves PAY_REQUEST_ID to Payment record
   ↓
4. Frontend: fetch(/api/subscriptions/process)
   ✅ Backend returns process.trans parameters
   ↓
5. Frontend: form.submit() to process.trans
   → Browser redirects to PayGate payment page
   → User enters payment details
   → PayGate processes payment
   ↓
6. PayGate: Sends NOTIFY_URL callback
   🔍 [Callback] ===== START =====
   🔍 [Callback] Received from PayGate
   🔍 [Callback] ✅ Checksum verified
   🔍 [Callback] ✅ Payment COMPLETED
   🔍 [Callback] ✅ Subscription ACTIVATED
   ✅ Backend marks payment as COMPLETED
   ✅ Backend activates subscription
   ↓
7. PayGate: Redirects browser to RETURN_URL
   🔍 [Return] ===== START =====
   🔍 [Return] PAY_REQUEST_ID: A88A361B-8306-406D-58BE-78552E00653E
   🔍 [Return] ✅ Payment found
   🔍 [Return] ✅ Checksum valid
   🔍 [Return] ✅ Redirecting to success page
   ✅ Browser shows success page
```

## Testing Checklist

- [ ] Test successful payment (TRANSACTION_STATUS=1)
  - Should see `/business/{id}/subscription/success?status=success`
- [ ] Test failed payment (TRANSACTION_STATUS=0)
  - Should see `/business/{id}/subscription/success?status=failed`
- [ ] Check logs in Vercel for [Initiate], [Callback], [Return] prefixes
- [ ] Verify no JavaScript errors in browser console
- [ ] Confirm subscription actually activates (check database)

## File Changes Summary

| File | Change | Reason |
|------|--------|--------|
| `/api/subscriptions/initiate/route.ts` | Added comprehensive logging, fixed to use $executeRaw for save | Identify where PAY_REQUEST_ID extraction/save fails |
| `/api/subscriptions/callback/route.ts` | Fixed `request.json()` → `request.formData()` | Parse PayGate's URL-encoded data correctly |
| `/api/subscriptions/return/route.ts` | Removed complex SQL, added step logging | Simpler, more reliable, better debugging |

## Next Steps if Issues Persist

1. **Check [Initiate] logs** - Does PAY_REQUEST_ID get extracted?
2. **Check [Callback] logs** - Is formData parsed correctly?
3. **Check [Return] logs** - Does payment get found?
4. **If payment not found in Return** - Check if save-pay-request succeeded in Initiate
5. **If callback fails** - Check if TRANSACTION_STATUS is being sent by PayGate
