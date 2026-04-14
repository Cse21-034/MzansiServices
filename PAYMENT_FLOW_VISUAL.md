# Payment Flow Visual Diagram & Quick Fix Summary

## Visual Payment Flow

```
YOUR WEBSITE (namibiaservices.com)
│
├─ USER CLICKS "SUBSCRIBE"
│  └─ handleSubscribe() called
│
├─ STEP 1: CHECKOUT ✅
│  ├─ Frontend: POST /api/subscriptions/checkout
│  ├─ Backend: Build & sign PayGate params
│  └─ Response: { params, initiateUrl, processUrl, reference }
│     Database: CREATE Payment { transactionRef: "NS_SUB_...", payRequestId: null }
│
├─ STEP 2: INITIATE TRANSACTION ⚠️ [NEEDS FIX]
│  ├─ Frontend: Browser sends form to PayGate initiate.trans
│  │  POST https://secure.paygate.co.za/payweb3/initiate.trans
│  │  Fields: PAYGATE_ID, REFERENCE, AMOUNT, CHECKSUM, etc.
│  │
│  ├─ PayGate Response: HTML page with PAY_REQUEST_ID
│  │  ❌ PROBLEM: Response not captured/extracted by frontend
│  │
│  └─ Frontend: [MISSING] Extract PAY_REQUEST_ID from response
│     ❌ PAY_REQUEST_ID = "abc123xyz789" (not saved)
│
├─ STEP 3: SAVE REQUEST ID ❌ [NEVER HAPPENS]
│  ├─ Frontend: [MISSING] POST /api/subscriptions/save-pay-request
│  │  Send: { payRequestId: "abc123xyz789", reference: "NS_SUB_..." }
│  │
│  ├─ Backend: [NOT CALLED] Update Payment record
│  │  Database: UPDATE Payment SET payRequestId = "abc123xyz789"
│  │
│  └─ Result: ❌ payRequestId stays NULL in database
│     After Fix: ✅ payRequestId = "abc123xyz789" saved
│
├─ STEP 4: PROCESS TRANSACTION ⚠️
│  ├─ Frontend: [MAY NOT HAPPEN] POST /api/subscriptions/process
│  │  Send: { payRequestId: "abc123xyz789", reference: "NS_SUB_..." }
│  │
│  ├─ Backend: Calculate checksum
│  │  CHECKSUM = MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
│  │
│  └─ Response: { processUrl, params: { PAY_REQUEST_ID, CHECKSUM } }
│
├─ STEP 5: PAYMENT PAGE 🔒
│  ├─ Frontend: Submit form to PayGate process.trans
│  │  POST https://secure.paygate.co.za/payweb3/process.trans
│  │  Fields: PAY_REQUEST_ID, CHECKSUM
│  │
│  ├─ PayGate: Redirect to hosted payment page
│  │  User sees: PayGate payment form
│  │  User enters: Card details
│  │  User clicks: Pay
│  │
│  └─ PayGate: Processes payment with card processor
│
├─ STEP 6: PAYMENT CALLBACK ✅
│  ├─ PayGate: Sends server-to-server callback
│  │  POST https://namibiaservices.com/api/subscriptions/callback
│  │  Data: { REFERENCE, TRANSACTION_STATUS, TRANSACTION_ID, CHECKSUM }
│  │  Status: 1 = success, 0 = failed
│  │
│  ├─ Backend: Verify checksum
│  │ └─ ✅ WORKS: Finds Payment by transactionRef
│  │
│  ├─ Backend: Update Payment & Subscription
│  │  Payment: UPDATE status = "COMPLETED", paidAt = now
│  │  Subscription: UPDATE status = "ACTIVE", endDate = now + 1 month
│  │
│  └─ Database State After Callback:
│     Payment { status: "COMPLETED", paidAt: "2026-04-14...", ... }
│     Subscription { status: "ACTIVE" }
│
├─ STEP 7: RETURN REDIRECT ❌ [CURRENTLY FAILS]
│  ├─ PayGate: Browser redirect after payment
│  │  POST https://namibiaservices.com/api/subscriptions/return
│  │  Browser follows redirect from payment page
│  │  Data: { PAY_REQUEST_ID, TRANSACTION_STATUS, CHECKSUM }
│  │
│  ├─ Backend: Verify checksum
│  │
│  ├─ Backend: Look up Payment record
│  │  ❌ FAILS: Queries findUnique({ payRequestId: "abc123..." })
│  │  Database: Payment { payRequestId: null }
│  │  Result: null (no match)
│  │
│  ├─ Backend: ❌ Returns error
│  │  Redirect to: /?error=payment_not_found
│  │
│  └─ After Fix: ✅ Returns success
│     Redirect to: /business/{id}/subscription/success
│
└─ STEP 8: USER SEES RESULT
   ❌ Before Fix: Error page "payment_not_found"
   ✅ After Fix: Success page + activated subscription
```

---

## Quick Fix Summary

### The Problem (Data Flow)
```
Checkout: ✅ Payment created
          └─ transactionRef: "NS_SUB_..."
          └─ payRequestId: null

Initiate: ⚠️ Response ignored
          └─ PAY_REQUEST_ID not extracted

Save:     ❌ Not called
          └─ payRequestId stays null

Return:   ❌ Lookup fails
          └─ findUnique({ payRequestId: null })
          └─ No match found
          └─ error=payment_not_found
```

### The Solution (Data Flow)
```
Checkout: ✅ Payment created with transactionRef

Initiate: ✅ Response captured
          └─ Extract: PAY_REQUEST_ID = "abc123..."

Save:     ✅ Endpoint called
          └─ Update Payment: payRequestId = "abc123..."

Return:   ✅ Lookup succeeds
          └─ findUnique({ payRequestId: "abc123..." })
          └─ Payment found!
          └─ Redirect to success page
```

---

## File to Edit

### File: `src/app/subscription/SubscriptionPlans.tsx`

**Current Code Location**: Lines ~50-130 in the `handleSubscribe` function

**What to Replace**:
```typescript
// Lines 50-130 (approximately)
// Everything from "Step 2 & 3: Submit combined form..." 
// to "setTimeout(() => { form.submit(); }, 100);"
```

**Replace With**: The complete `handleSubscribe` function provided in [PAYMENT_FIX_IMPLEMENTATION.md](PAYMENT_FIX_IMPLEMENTATION.md)

---

## Config Checklist

### Environment Variables ✅
```env
PAYGATE_MERCHANT_ID=set_correctly
PAYGATE_MERCHANT_KEY=set_correctly
NEXTAUTH_URL=https://www.namibiaservices.com
```

### Prisma Schema ✅
```prisma
model Payment {
  payRequestId String? @unique  // ← Must be @unique for findUnique()
}
```

### API Endpoints ✅
- `POST /api/subscriptions/checkout` — ✅ Working
- `POST /api/subscriptions/save-pay-request` — ✅ Ready (waiting to be called)
- `POST /api/subscriptions/process` — ✅ Ready (waiting to be called)
- `POST /api/subscriptions/callback` — ✅ Working
- `POST /api/subscriptions/return` — ✅ Ready (but fails currently)

---

## Step-by-Step Fix Instructions

### 1. Understand the Problem (5 min)
- Read: [PAYMENT_FLOW_ANALYSIS.md](PAYMENT_FLOW_ANALYSIS.md#critical-issue)
- Understand: PAY_REQUEST_ID never saved to database
- Result: return handler can't find payment record

### 2. Review the Fix (10 min)
- Read: [PAYMENT_FIX_IMPLEMENTATION.md](PAYMENT_FIX_IMPLEMENTATION.md)
- Understand: Each of the 5 steps
- Note: All endpoints already exist, just frontend flow is broken

### 3. Update Component (15 min)
- Open: `src/app/subscription/SubscriptionPlans.tsx`
- Find: The `handleSubscribe` function
- Replace: Old payment flow with new one
- Test: Check console logs

### 4. Test the Fix (20 min)
- Run: Start dev server
- Go to: Subscription page
- Click: "Subscribe"
- Check:
  1. Console logs show all 5 steps
  2. PAY_REQUEST_ID extracted
  3. Form submitted to process.trans
  4. Redirected to PayGate payment page
  5. PayGate redirects back successfully

### 5. Verify Success (5 min)
- Database: Payment has payRequestId set
- Database: Payment status = "COMPLETED"
- Database: Subscription status = "ACTIVE"
- Page: Shows success, not error

---

## Testing Checklist

### ✅ Test 1: Checkout Works
```
1. Go to /business/{id}/subscription
2. Click "Subscribe to Desert Lions"
3. Check console: "Step 1 Complete"
4. Verify response has initiateUrl, params
```

### ✅ Test 2: PAY_REQUEST_ID Extracted
```
1. Continue from Test 1
2. Check console: "Extracted PAY_REQUEST_ID: abc123..."
3. If not shown, check PayGate response format
```

### ✅ Test 3: Saved to Database
```
1. Continue from Test 2
2. Check console: "PAY_REQUEST_ID saved"
3. Query database:
   SELECT payRequestId FROM payments 
   WHERE transactionRef = 'NS_SUB_...'
4. Verify payRequestId is NOT null
```

### ✅ Test 4: Process Params Received
```
1. Continue from Test 3
2. Check console: "Received process params"
3. Verify processUrl is valid PayGate URL
```

### ✅ Test 5: Form Submitted
```
1. Continue from Test 4
2. Browser should redirect to PayGate
3. URL should be: https://secure.paygate.co.za/payweb3/process.trans
4. See PayGate payment form
```

### ✅ Test 6: Payment Processes
```
1. Continue from Test 5
2. Enter test card: 4111111111111111
3. Enter future date: 12/25 (or similar)
4. Enter CVC: 123
5. Click "Pay"
6. PayGate processes payment
```

### ✅ Test 7: Callback Received  
```
1. Continue from Test 6
2. Check server logs: webhook received
3. Check console: "Subscription activated"
4. Database: Payment.status = "COMPLETED"
```

### ✅ Test 8: Return URL Works
```
1. Continue from Test 7
2. PayGate redirects to /api/subscriptions/return
3. ✅ Should succeed (NOT error=payment_not_found)
4. Should redirect to: /business/{id}/subscription/success
5. See success page (no error message)
```

### ✅ Test 9: Subscription Active
```
1. Continue from Test 8
2. Go to: /business/{id}/subscription
3. Verify: Subscription shows as "ACTIVE"
4. Verify: Plan shows as current plan
5. Verify: Features enabled for plan tier
```

---

## Common Issues & Fixes

### Issue: "Failed to extract PAY_REQUEST_ID"
**Cause**: PayGate response format changed  
**Fix**: Check PayGate docs for current response format  
**Debug**: Log `initiateHtml` to see actual response

### Issue: CORS Error
**Cause**: PayGate blocks fetch requests  
**Fix**: Use server-side proxy approach (see [PAYMENT_FIX_IMPLEMENTATION.md](PAYMENT_FIX_IMPLEMENTATION.md#alternative-server-side-redirect-approach))

### Issue: Form doesn't submit
**Cause**: Form not in DOM  
**Fix**: Ensure `document.body.appendChild(form)` is called

### Issue: "payment_not_found" still appears
**Cause**: Fix not fully applied  
**Fix**: 
1. Verify console logs show "PAY_REQUEST_ID saved"
2. Check database: `SELECT * FROM payments WHERE id='...'`
3. Verify payRequestId is set (not null)

---

## API Response Examples

### Checkout Endpoint Response
```json
{
  "success": true,
  "free": false,
  "checkout": {
    "initiateUrl": "https://secure.paygate.co.za/payweb3/initiate.trans",
    "processUrl": "https://secure.paygate.co.za/payweb3/process.trans",
    "reference": "NS_SUB_business_456_1713091200",
    "params": {
      "PAYGATE_ID": "10011030686",
      "REFERENCE": "NS_SUB_business_456_1713091200",
      "AMOUNT": "19900",
      "CURRENCY": "NAD",
      "RETURN_URL": "https://www.namibiaservices.com/api/subscriptions/return",
      "TRANSACTION_DATE": "2026-04-14 11:13:30",
      "LOCALE": "en-za",
      "COUNTRY": "ZAF",
      "EMAIL": "business@example.com",
      "NOTIFY_URL": "https://www.namibiaservices.com/api/subscriptions/callback",
      "CHECKSUM": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
    }
  }
}
```

### Save PAY_REQUEST_ID Response
```json
{
  "success": true,
  "message": "PAY_REQUEST_ID saved successfully"
}
```

### Process Endpoint Response
```json
{
  "success": true,
  "processUrl": "https://secure.paygate.co.za/payweb3/process.trans",
  "params": {
    "PAY_REQUEST_ID": "abc123xyz789000",
    "CHECKSUM": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7"
  }
}
```

### Callback Request (from PayGate)
```json
{
  "PAYGATE_ID": "10011030686",
  "REFERENCE": "NS_SUB_business_456_1713091200",
  "TRANSACTION_ID": "12345678",
  "TRANSACTION_STATUS": "1",
  "RESULT_DESC": "Approved",
  "AUTH_CODE": "234567",
  "CHECKSUM": "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9"
}
```

### Return Request Form Data
```
PAY_REQUEST_ID: abc123xyz789000
TRANSACTION_STATUS: 1
CHECKSUM: d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

---

## Database Queries to Verify

### Check Payment Record After Checkout
```sql
SELECT id, transactionRef, payRequestId, status, createdAt
FROM payments
WHERE transactionRef LIKE 'NS_SUB_%'
ORDER BY createdAt DESC
LIMIT 1;
```

### Expected Before Fix
```
id: cuid123abc
transactionRef: NS_SUB_business_456_1713091200
payRequestId: NULL          ← Still null
status: PENDING
```

### Expected After Fix
```
id: cuid123abc
transactionRef: NS_SUB_business_456_1713091200
payRequestId: abc123xyz789 ← Now populated!
status: COMPLETED
```

### Check Subscription Activation
```sql
SELECT id, businessId, planId, status, endDate, currentPaymentId
FROM subscriptions
WHERE businessId = 'business_456';
```

### Expected After Successful Payment
```
id: sub123xyz
businessId: business_456
planId: desert_lions_plan_id
status: ACTIVE          ← Activated by callback
endDate: 2026-05-14     ← One month from now
currentPaymentId: cuid123abc
```

---

## Success Indicators

When the fix is working correctly, you should see:

✅ **Console Logs**
- All 5 steps logged
- PAY_REQUEST_ID extracted and logged
- "PAY_REQUEST_ID saved" message

✅ **Database**
- Payment.payRequestId populated (not null)
- Payment.status = "COMPLETED"
- Subscription.status = "ACTIVE"

✅ **User Experience**
- No "payment_not_found" error
- Redirected to success page automatically
- Subscription shows as active on dashboard

✅ **PayGate Side**
- Callback received and processed
- Payment marked as successful

