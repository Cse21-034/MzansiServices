# Critical Payment Flow Fixes - April 14, 2026

## Executive Summary

User payments were failing with `error=payment_not_found` due to **THREE critical bugs**:

1. **Missing PAY_REQUEST_ID Save** - Frontend extracted the ID but failed to persist it
2. **Incorrect Checksum Calculation** - Callback verification was rejecting valid payments
3. **No Diagnostic Logging** - Made it impossible to debug without seeing raw logs

## Issue 1: Missing PAY_REQUEST_ID to Database ⚠️ CRITICAL

### Symptom
```
[Callback] REFERENCE: NS_SUB_cmlurjox00002lb04dxepukrv_1776177881552
[Return] ⚠️ Payment not found for payRequestId: 5602B16B-0FE2-D8BF-CB95-1D7368DE4B82
```

### Root Cause
In `/src/components/SectionSubscriptionPackages.tsx`, after extracting `PAY_REQUEST_ID` from PayGate's response, the code called `/api/subscriptions/save-pay-request` **but didn't check if it actually succeeded**. It just logged the response and continued.

### Investigation
The browser console logs showed:
```
[Subscription] Step 2: Received from initiate.trans: PAYGATE_ID=...&PAY_REQUEST_ID=CCED08B2-A672-093B-D29A-6EE22903A3A9...
[Subscription] Step 3: Extracted PAY_REQUEST_ID: CCED08B2-A672-093B-D29A-6EE22903A3A9
[Subscription] Step 3.5: Saved PAY_REQUEST_ID to database: ...
```

But the database still had `payRequestId = NULL` because the save failed silently.

### Fix Applied
```typescript
// BEFORE: Just logged, didn't validate
const saveData = await saveResponse.json();
console.log('[Subscription] Step 3.5: Saved PAY_REQUEST_ID to database:', saveData);

// AFTER: Explicitly check success and error if not
if (!saveData.success) {
  console.error('[Subscription] ❌ FAILED to save PAY_REQUEST_ID:', saveData.message);
  alert('Critical error: Failed to save payment request. Please contact support.');
  return;
}
console.log('[Subscription] ✅ Step 3.5: Saved PAY_REQUEST_ID to database:', saveData);
```

**Impact**: Now payment will correctly abort if PAY_REQUEST_ID can't be saved, preventing users from seeing `payment_not_found` after completing payment.

---

## Issue 2: Incorrect Checksum Calculation 🔐 SECURITY

### Symptom
```
[Callback] ❌ Invalid checksum in PayGate notification
[Callback] Potential tampering - rejecting notification
```

### Root Cause
The checksum verification in `/src/lib/paygate.ts` was:
1. Taking ALL fields from the notification
2. Sorting them alphabetically
3. Concatenating values
4. Adding merchant key

But PayGate callback checksum should use **specific fields in specific order**:
```
MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + TRANSACTION_STATUS + TRANSACTION_ID + KEY)
```

### Example Failure
```
PayGate sent: PAYGATE_ID=...&PAY_REQUEST_ID=...&REFERENCE=...&TRANSACTION_STATUS=0&TRANSACTION_ID=1177561820&CHECKSUM=...

Old code calculated with: All fields alphabetically sorted
Correct calculation: PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + TRANSACTION_STATUS + TRANSACTION_ID + KEY
```

### Fix Applied
```typescript
// BEFORE: Alphabetical sort of all fields
const checksumString = Object.keys(rest)
  .sort()
  .map(key => String(rest[key]))
  .join('') + this.config.merchantKey;

// AFTER: Specific fields in specific order per PayGate documentation
const checksumString = `${rest.PAYGATE_ID || ''}${rest.PAY_REQUEST_ID || ''}${rest.REFERENCE || ''}${rest.TRANSACTION_STATUS || ''}${rest.TRANSACTION_ID || ''}${this.config.merchantKey}`;
```

**Impact**: Callbacks will now be verified correctly and payments won't be rejected as "potential tampering"

---

## Issue 3: Added Comprehensive Checksum Debug Logging 🔍

### Added Logging
```typescript
console.log('[PayGate] Checksum verification:');
console.log('[PayGate]   Fields:', {
  PAYGATE_ID: rest.PAYGATE_ID,
  PAY_REQUEST_ID: rest.PAY_REQUEST_ID,
  REFERENCE: rest.REFERENCE,
  TRANSACTION_STATUS: rest.TRANSACTION_STATUS,
  TRANSACTION_ID: rest.TRANSACTION_ID,
});
console.log('[PayGate]   String for hash:', checksumString);
console.log('[PayGate]   Received checksum: ', CHECKSUM);
console.log('[PayGate]   Calculated checksum:', calculated);
console.log('[PayGate]   Match:', calculated === CHECKSUM);
```

### Benefit
If checksum still fails in future, logs will show:
- Exact fields PayGate sent
- What string was hashed
- What checksum was received vs calculated

---

## Expected Payment Flow Now (After Fixes)

```
User Clicks Subscribe
  ↓
[Payment Flow] Step 1: Posting to PayGate checkout
  ↓
[Subscription] Step 1: Posting to PayGate initiate.trans
  ✓ Browser receives: PAY_REQUEST_ID=CCED08B2-A672-093B...
  ↓
[Subscription] Step 2: Extracted PAY_REQUEST_ID
  ↓
[Subscription] Step 3.5: ✅ Saving PAY_REQUEST_ID to database
  ✓ /api/subscriptions/save-pay-request returns { success: true }
  Database now has: payment.payRequestId = CCED08B2-A672-093B...
  ↓
[Subscription] Step 4: Getting process.trans parameters
  ↓
Browser submits to PayGate process.trans
  ↓
User enters payment details
  ↓
PayGate processes payment
  ↓
[Callback] ✅ Checksum verified (now with correct calculation)
  ✓ Payment status updated in database
  ↓
Browser redirected to /api/subscriptions/return
  ↓
[Return] ✅ Payment found by payRequestId
  ✓ Subscription activated
  ↓
User sees success page
```

---

## Testing Checklist

### Test 1: Payment with Fixed PAY_REQUEST_ID Save
```
1. Browser logs should show: [Subscription] ✅ Step 3.5: Saved PAY_REQUEST_ID to database
2. Backend logs should show: [Save PAY_REQUEST_ID] Successfully saved for reference: NS_SUB_...
3. Database should have: payment.payRequestId populated (not NULL)
```

### Test 2: Callback Checksum Verification
```
1. Browser logs should show successful callback with:
   [Callback] ✅ Checksum verified
   (not ❌ Invalid checksum)
2. Vercel logs should show:
   [PayGate] Checksum verification:
   [PayGate]   Received checksum: (value)
   [PayGate]   Calculated checksum: (same value)
   [PayGate]   Match: true
```

### Test 3: End-to-End Payment Success
```
1. After user auth at PayGate, should see:
   [Return] ✅ Payment found by payRequestId: CCED08B2-A672-093B...
   [Return] ✅ Subscription successfully activated
2. Final redirect should go to:
   /business/[ID]/subscription/success?status=success
   (not /?error=payment_not_found)
```

---

## Files Modified

| File | Changes |
|------|---------|
| `/src/components/SectionSubscriptionPackages.tsx` | Added success check for PAY_REQUEST_ID save, added error alerts |
| `/src/lib/paygate.ts` | Fixed checksum calculation to match PayGate spec, added debug logging |

---

## Configuration Required

Merchant Key must be correctly configured in environment:
```
PAYGATE_MERCHANT_KEY=your_actual_merchant_key
```

Verify in `/src/lib/paygate.ts` that `this.config.merchantKey` is loaded from environment.

---

## Root Cause Analysis

### Why Payment Worked in Staging
Staging might have had:
1. Different checksum calculation (incomplete validation)
2. Callback might not have been enabled
3. Payment record creation working but verification disabled

### Why Production Failed
1. **Silent Failure**: Save endpoint silently fails, code continues anyway
2. **Checksum Wrong**: PayGate rejects callback as tampered
3. **No Logging**: Backend never showed checksum mismatch details

### Why Logs Were Unclear
- Callback error happened in background (server-side)
- Frontend just saw 303 redirect with `?error=payment_not_found`
- No way to know callback was being rejected for checksum

---

## Security Notes

✅ Checksum verification is critical - prevents:
- Man-in-the-middle attacks
- Forged payment notifications
- Fraud

Now performs correct verification per PayGate specification.

---

## Next Actions

1. **Deploy fixes**
2. **Monitor Vercel logs** for successful checksum verification
3. **Test with real payment** (use test card from PayGate)
4. **Verify database** shows `payRequestId` populated for new transactions
5. **Check return handler** successfully finds payments
