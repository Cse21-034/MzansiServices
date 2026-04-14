# Payment Flow Analysis & Documentation

**Status**: ⚠️ **CRITICAL ISSUE IDENTIFIED**  
**Root Cause**: Return URL is failing because `PAY_REQUEST_ID` is not being saved to the database during checkout flow

---

## Table of Contents
1. [Current Payment Flow](#current-payment-flow)
2. [Critical Issue](#critical-issue)
3. [Root Cause Analysis](#root-cause-analysis)
4. [Complete API Reference](#complete-api-reference)
5. [Expected vs Actual Flow](#expected-vs-actual-flow)
6. [Return URL Error Explained](#return-url-error-explained)
7. [Database Schema](#database-schema)
8. [Fix Implementation](#fix-implementation)

---

## Current Payment Flow

### Flow Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                    USER SUBSCRIPTION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Frontend (SubscriptionPlans.tsx)
     │
     ├─1.1→ POST /api/subscriptions/checkout
     │       (planTier, businessId, billingCycle)
     │
     ├─1.2← Response: { checkout: { params, initiateUrl, processUrl } }
     │
     ├─2.1→ Submit Form to PayGate initiate.trans [ISSUE: Not capturing response]
     │       Form fields: (PAYGATE_ID, REFERENCE, AMOUNT, etc. CHECKSUM)
     │
     ├─2.2← PayGate Returns Response with PAY_REQUEST_ID [ISSUE: Not extracted]
     │
     ├─3.1→ [MISSING] POST /api/subscriptions/save-pay-request
     │       (payRequestId, reference) [NOT BEING CALLED]
     │
     ├─4.1→ POST /api/subscriptions/process
     │       (payRequestId, reference)
     │
     ├─4.2← Response: { processUrl, params: {PAY_REQUEST_ID, CHECKSUM} }
     │
     ├─5.1→ Submit Form to PayGate process.trans
     │       (PAY_REQUEST_ID, CHECKSUM)
     │
     └─5.2→ User completes payment at PayGate


PayGate Server (During Payment)
     │
     ├─6.1→ POST /api/subscriptions/callback
     │       [NOTIFY_URL - Server-side callback]
     │       (REFERENCE, TRANSACTION_STATUS, TRANSACTION_ID, CHECKSUM)
     │
     └─6.2→ GET /api/subscriptions/return
            [RETURN_URL - Client redirect after payment]
            (PAY_REQUEST_ID, TRANSACTION_STATUS, CHECKSUM)
            [ERROR: Payment not found - payRequestId lookup fails]


Frontend (Result)
     │
     └─ Redirect to: /business/{businessId}/subscription/success or error
```

---

## Critical Issue

### ❌ The Problem
**Error**: `https://www.namibiaservices.com/?error=payment_not_found`

**Why it's happening**:
The return URL handler is trying to look up the payment record using `PAY_REQUEST_ID`, but the payment record was created with only the `REFERENCE` (transaction reference), and the `PAY_REQUEST_ID` was never saved because:

1. **The save-pay-request endpoint is not being called** from the frontend
2. **The PAY_REQUEST_ID is not being extracted** from PayGate's initiate.trans response
3. When the return redirect comes from PayGate with only the PAY_REQUEST_ID, it can't find the payment record

---

## Root Cause Analysis

### Current Code Issues

#### Issue #1: Frontend Not Capturing initiate.trans Response
**File**: [src/app/subscription/SubscriptionPlans.tsx](src/app/subscription/SubscriptionPlans.tsx#L50-L90)

```javascript
// ❌ PROBLEM: Form is submitted but response is not captured
form.submit(); // Just fires and forgets
```

**Expected**: After form submitted to initiate.trans, PayGate returns a response page with PAY_REQUEST_ID that should be:
- Extracted from the response
- Sent to save-pay-request endpoint
- Then used for process.trans call

#### Issue #2: save-pay-request Never Called
The `/api/subscriptions/save-pay-request` endpoint exists but is never invoked in the frontend flow.

**File**: [src/app/api/subscriptions/save-pay-request/route.ts](src/app/api/subscriptions/save-pay-request/route.ts)
```typescript
// ✅ This endpoint EXISTS but ❌ is NEVER CALLED
await prisma.payment.update({
  where: { transactionRef: reference },
  data: { payRequestId }, // ← This update never happens
});
```

#### Issue #3: Return Handler Queries by payRequestId
**File**: [src/app/api/subscriptions/return/route.ts](src/app/api/subscriptions/return/route.ts#L27-L35)

```typescript
const payment = await prisma.payment.findUnique({
  where: { payRequestId }, // ← Returns null because payRequestId was never saved
});

if (!payment) {
  // ❌ This is what happens - payment_not_found error
  return NextResponse.redirect(
    new URL('/?error=payment_not_found', request.nextUrl.origin),
    { status: 303 }
  );
}
```

### Database State at Each Step

**Step 1: After checkout endpoint**
```
Payment {
  id: "cuid123"
  transactionRef: "NS_SUB_abc123_1644567890"  ← Primary lookup key
  payRequestId: null                          ← NOT SET YET
  status: "PENDING"
}
```

**Step 2: After save-pay-request (SHOULD HAPPEN)**
```
Payment {
  id: "cuid123"
  transactionRef: "NS_SUB_abc123_1644567890"
  payRequestId: "PAY_REQ_abc123xyz"          ← Updated by save-pay-request
  status: "PENDING"
}
```

**Step 3: PayGate Return Redirect**
```
Sends: { PAY_REQUEST_ID: "PAY_REQ_abc123xyz", TRANSACTION_STATUS: "1", CHECKSUM: "..." }
But we need: { payRequestId: "PAY_REQUEST_ID" }
```

**Step 4: Return Handler Fails**
```
payment = await prisma.payment.findUnique({
  where: { payRequestId: "PAY_REQ_abc123xyz" }  
})
// ❌ FAILS - payRequestId is still NULL because Step 2 never happened
```

---

## Complete API Reference

### 1️⃣ POST `/api/subscriptions/checkout`

**Purpose**: Build signed parameters for PayGate payment initiation

**Request**:
```json
{
  "planTier": "DESERT_LIONS",
  "businessId": "business_123",
  "billingCycle": "MONTHLY"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "free": false,
  "checkout": {
    "initiateUrl": "https://secure.paygate.co.za/payweb3/initiate.trans",
    "processUrl": "https://secure.paygate.co.za/payweb3/process.trans",
    "reference": "NS_SUB_business_123_1644567890",
    "params": {
      "PAYGATE_ID": "merchant_id",
      "REFERENCE": "NS_SUB_business_123_1644567890",
      "AMOUNT": "19900",
      "CURRENCY": "NAD",
      "RETURN_URL": "https://www.namibiaservices.com/api/subscriptions/return",
      "TRANSACTION_DATE": "2026-04-14 11:13:30",
      "LOCALE": "en-za",
      "COUNTRY": "ZAF",
      "EMAIL": "business@example.com",
      "NOTIFY_URL": "https://www.namibiaservices.com/api/subscriptions/callback",
      "CHECKSUM": "md5_checksum_hash"
    }
  }
}
```

**Database Changes**:
- ✅ Creates `Payment` record with `transactionRef = reference`
- ✅ Creates or updates `Subscription` with status `INACTIVE`
- ❌ Does NOT set `payRequestId` (not available yet)

---

### 2️⃣ POST `https://secure.paygate.co.za/payweb3/initiate.trans` (Browser)

**Purpose**: PayGate server receives payment details and returns PAY_REQUEST_ID

**Request** (Browser submits form):
```
POST https://secure.paygate.co.za/payweb3/initiate.trans

Form Data:
- PAYGATE_ID: merchant_id
- REFERENCE: NS_SUB_business_123_1644567890
- AMOUNT: 19900
- CURRENCY: NAD
- RETURN_URL: https://www.namibiaservices.com/api/subscriptions/return
- TRANSACTION_DATE: 2026-04-14 11:13:30
- LOCALE: en-za
- COUNTRY: ZAF
- EMAIL: business@example.com
- NOTIFY_URL: https://www.namibiaservices.com/api/subscriptions/callback
- CHECKSUM: md5_checksum_hash
```

**Response** (PayGate):
```html
<!-- PayGate returns HTML page with PAY_REQUEST_ID in a hidden field or JavaScript -->
<hidden_field name="PAY_REQUEST_ID" value="abc123xyz789..."/>
<!-- Browser needs to extract this and use it in next steps -->
```

**⚠️ ISSUE**: Frontend is not extracting PAY_REQUEST_ID from response

---

### 3️⃣ POST `/api/subscriptions/save-pay-request` (Should be called)

**Purpose**: Save the PAY_REQUEST_ID received from initiate.trans response to database

**Request** (Should be made by frontend):
```json
{
  "payRequestId": "abc123xyz789",
  "reference": "NS_SUB_business_123_1644567890"
}
```

**Response**:
```json
{
  "success": true,
  "message": "PAY_REQUEST_ID saved successfully"
}
```

**Database Changes**:
- ✅ Updates `Payment` record: `payRequestId = abc123xyz789`

**⚠️ ISSUE**: This endpoint exists but is NEVER CALLED

---

### 4️⃣ POST `/api/subscriptions/process`

**Purpose**: Calculate CHECKSUM for process.trans redirect using PAY_REQUEST_ID

**Request** (Frontend):
```json
{
  "payRequestId": "abc123xyz789",
  "reference": "NS_SUB_business_123_1644567890"
}
```

**Response**:
```json
{
  "success": true,
  "processUrl": "https://secure.paygate.co.za/payweb3/process.trans",
  "params": {
    "PAY_REQUEST_ID": "abc123xyz789",
    "CHECKSUM": "md5_checksum_hash"
  }
}
```

**Checksum Calculation**:
```
CHECKSUM = MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + MERCHANT_KEY)
```

---

### 5️⃣ POST `https://secure.paygate.co.za/payweb3/process.trans` (Browser)

**Purpose**: PayGate processes payment, user enters payment details

**Request** (Browser submits form):
```
POST https://secure.paygate.co.za/payweb3/process.trans

Form Data:
- PAY_REQUEST_ID: abc123xyz789
- CHECKSUM: md5_checksum_hash
```

**Flow**:
1. Browser submits form to process.trans
2. User is redirected to PayGate's hosted payment page
3. User enters card/payment details
4. PayGate processes payment
5. PayGate sends server callback to NOTIFY_URL
6. PayGate redirects browser to RETURN_URL

---

### 6️⃣ POST `/api/subscriptions/callback` (PayGate Server → Your Server)

**Purpose**: Server-side callback from PayGate to notify about payment result

**Called by**: PayGate server (not browser)

**Request** (PayGate sends):
```json
{
  "PAYGATE_ID": "merchant_id",
  "REFERENCE": "NS_SUB_business_123_1644567890",
  "TRANSACTION_ID": "12345678",
  "TRANSACTION_STATUS": "1",  // 1 = success, 0 = failed
  "RESULT_DESC": "Approved",
  "AUTH_CODE": "234567",
  "CHECKSUM": "md5_checksum_hash"
}
```

**Response** (Must return):
```
OK
```

**Database Changes**:
- ✅ Updates `Payment`: status = COMPLETED, paymentGatewayId, paidAt
- ✅ Updates `Subscription`: status = ACTIVE, endDate, renewalDate

**Checksum Verification**:
```
Calculated = MD5(concat(all_field_values_sorted) + MERCHANT_KEY)
```

---

### 7️⃣ POST `/api/subscriptions/return` (PayGate Browser Redirect)

**Purpose**: Handle PayGate's browser redirect after payment completion

**Called by**: Browser (user-facing redirect from PayGate)

**Request** (PayGate redirects browser):
```
POST https://www.namibiaservices.com/api/subscriptions/return

Form Data:
- PAY_REQUEST_ID: abc123xyz789
- TRANSACTION_STATUS: 1  // 1 = success, 0 = failed
- CHECKSUM: md5_checksum_hash
```

**Response** (Redirect to):
```
HTTP 303 See Other
Location: /business/{businessId}/subscription/success?status=success&...
```

**Database Lookups**:
1. Find `Payment` by `payRequestId` → ❌ **FAILS HERE** (payRequestId is null)
2. Retrieve `reference` from payment
3. Verify checksum using: `MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)`
4. Update payment status based on TRANSACTION_STATUS
5. Update subscription status

---

## Expected vs Actual Flow

### Expected Flow (What SHOULD Happen)

```
Step 1: User clicks "Subscribe to Desert Lions"
         ↓
Step 2: Frontend calls POST /api/subscriptions/checkout
         ↓ Response: { params, initiateUrl, processUrl, reference }
         ↓
Step 3: Frontend creates form & submits to initiateUrl
         (Posts: PAYGATE_ID, REFERENCE, AMOUNT, ... CHECKSUM)
         ↓
Step 4: ✅ EXTRACT PAY_REQUEST_ID from PayGate response
         ↓
Step 5: ✅ Call POST /api/subscriptions/save-pay-request
         (Sends: payRequestId, reference)
         ↓ Database now has: Payment with both transactionRef AND payRequestId
         ↓
Step 6: Call POST /api/subscriptions/process
         (Sends: payRequestId, reference)
         ↓ Response: { params with CHECKSUM }
         ↓
Step 7: Create form & submit to processUrl
         (Posts: PAY_REQUEST_ID, CHECKSUM)
         ↓
Step 8: User completes payment at PayGate
         ↓
Step 9: PayGate sends callback to /api/subscriptions/callback
         ✅ Finds Payment by transactionRef
         ✅ Updates Payment & Subscription to ACTIVE
         ↓
Step 10: PayGate redirects browser to /api/subscriptions/return
         (Posts: PAY_REQUEST_ID, TRANSACTION_STATUS, CHECKSUM)
         ↓
Step 11: ✅ FINDS Payment by payRequestId (Success!)
         ✅ Verifies checksum
         ✅ Updates payment status
         ✓ Redirects to success page
```

### Actual Flow (What IS Happening)

```
Step 1: User clicks "Subscribe to Desert Lions"
         ↓
Step 2: Frontend calls POST /api/subscriptions/checkout
         ↓ Response: { params, initiateUrl, processUrl, reference }
         ↓
Step 3: Frontend submits form to initiateUrl
         ✅ Form submitted successfully
         ↓
Step 4: ❌ PAY_REQUEST_ID NOT EXTRACTED
         ❌ Frontend doesn't handle response properly
         ↓
Step 5: ❌ save-pay-request NEVER CALLED
         ❌ payRequestId stays NULL in database
         ↓
Step 6: ❌ process endpoint may or may not be called
         ❌ Frontend flow is broken
         ↓
Step 7: Form may not be submitted to processUrl
         ❌ User may not complete payment flow
         ↓
Step 8: If payment is somehow processed...
         ↓
Step 9: PayGate sends callback to /api/subscriptions/callback
         ✅ FINDS Payment by transactionRef 
         ✅ Updates Payment & Subscription
         ↓
Step 10: PayGate redirects to /api/subscriptions/return
         (Posts: PAY_REQUEST_ID, TRANSACTION_STATUS, CHECKSUM)
         ↓
Step 11: ❌ PAYMENT NOT FOUND
         ❌ Queries: findUnique({ where: { payRequestId } })
         ❌ payRequestId is NULL → No match
         ❌ Redirects to: /?error=payment_not_found
```

---

## Return URL Error Explained

### The Exact Problem

When the user is redirected from PayGate back to your site, here's what happens:

**1. PayGate sends this redirect:**
```
POST https://www.namibiaservices.com/api/subscriptions/return

PAY_REQUEST_ID: "abc123xyz789"
TRANSACTION_STATUS: "1"
CHECKSUM: "hash123"
```

**2. Return handler tries to find payment:**
```typescript
const payment = await prisma.payment.findUnique({
  where: { payRequestId: "abc123xyz789" } // ← Looking for this
});
```

**3. Database state is:**
```
Payment {
  id: "cuid123"
  transactionRef: "NS_SUB_abc123_1644567890"
  payRequestId: null  // ← NOT HERE! Never saved
  status: "COMPLETED" (already set by callback)
}
```

**4. Query returns null:**
```typescript
if (!payment) {  // ← This is TRUE
  return NextResponse.redirect(
    new URL('/?error=payment_not_found', request.nextUrl.origin),
    { status: 303 }
  );
  // ← User sees: https://www.namibiaservices.com/?error=payment_not_found
}
```

**5. Why this happens:**
- `save-pay-request` was never called
- `payRequestId` was never saved to database
- `findUnique()` can't find a record where `payRequestId` is null OR matches the value

---

## Database Schema

### Payment Model
```prisma
model Payment {
  id                String   @id @default(cuid())
  subscriptionId    String   @map("subscription_id")
  paymentGatewayId  String   @map("payment_gateway_id")
  
  // ⚠️ CRITICAL: This is the issue
  payRequestId      String?  @unique @map("pay_request_id")  
  // Why unique? To prevent duplicate lookups
  // Why @unique? Allows findUnique() queries
  // The problem: It's never populated!
  
  amount            Float
  currency          String   @default("BWP")
  status            PaymentStatus @default(PENDING) @map("status")
  paymentMethod     String?  @map("payment_method")
  
  // Primary lookup in checkout
  transactionRef    String?  @unique @map("transaction_ref")
  // This IS populated and used by callback successfully
  
  failureReason     String?  @map("failure_reason")
  paidAt            DateTime? @map("paid_at")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  subscription      Subscription @relation(fields: [subscriptionId], references: [id])
}
```

### Data Flow in Database

```
CHECKOUT:
  ↓ Creates: Payment { 
      transactionRef: "NS_SUB_...", 
      payRequestId: null, 
      status: "PENDING" 
    }

SAVE_PAY_REQUEST: (NOT BEING CALLED)
  ↓ Updates: Payment { 
      payRequestId: "abc123...",  ← Should be set HERE
      status: "PENDING" 
    }

CALLBACK:
  ↓ Updates: Payment { 
      status: "COMPLETED",
      paymentGatewayId: "...",
      paidAt: now
    }

RETURN:
  ↓ Queries: findUnique({ payRequestId: "abc123..." })
    ❌ FAILS because payRequestId is still null
```

---

## Fix Implementation

### Solution Overview

There are two ways to fix this:

#### Option A: Fix the Frontend Flow (Recommended)
Make the frontend properly:
1. Extract PAY_REQUEST_ID from initiate.trans response
2. Call save-pay-request to save it
3. Then proceed to process.trans

#### Option B: Alternative Lookup in Return Handler
Change return handler to look up by transactionRef instead of payRequestId (but this doesn't follow the PayGate API correctly)

### Option A: Fix Frontend (Recommended - Do This)

**Problem**: Frontend just submits form to initiate.trans but doesn't handle the response

**Solution**: Implement proper response handling:

1. **Add handler for initiate.trans response**
   - Instead of form.submit(), use fetch with form data
   - Capture the response
   - Extract PAY_REQUEST_ID

2. **Call save-pay-request**
   - Include extracted PAY_REQUEST_ID
   - Save it to database

3. **Then proceed to process.trans**
   - Use saved PAY_REQUEST_ID to calculate checksum
   - Submit to process.trans

### Implementation for Frontend

Update `src/app/subscription/SubscriptionPlans.tsx`:

```typescript
// Step 1: Get checkout params
const response = await fetch('/api/subscriptions/checkout', {...});
const data = await response.json();
const { params, reference, initiateUrl, processUrl } = data.checkout;

// Step 2: Submit to initiate.trans and capture response
const formData = new FormData();
Object.entries(params).forEach(([key, value]) => {
  formData.append(key, String(value));
});

try {
  // Option 1: Use fetch (handles response better)
  const initiateResponse = await fetch(initiateUrl, {
    method: 'POST',
    body: formData,
  });
  
  const initiateText = await initiateResponse.text();
  // Extract PAY_REQUEST_ID from response
  const payRequestIdMatch = initiateText.match(/name="PAY_REQUEST_ID"\s+value="([^"]+)"/);
  const payRequestId = payRequestIdMatch?.[1];
  
  if (!payRequestId) {
    throw new Error('Failed to extract PAY_REQUEST_ID from PayGate response');
  }
  
  // Step 3: Save PAY_REQUEST_ID to database
  await fetch('/api/subscriptions/save-pay-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payRequestId, reference }),
  });
  
  // Step 4: Get process.trans params
  const processResponse = await fetch('/api/subscriptions/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payRequestId, reference }),
  });
  
  const processData = await processResponse.json();
  
  // Step 5: Submit to process.trans
  const processForm = document.createElement('form');
  processForm.method = 'POST';
  processForm.action = processData.processUrl;
  
  Object.entries(processData.params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = String(value);
    processForm.appendChild(input);
  });
  
  document.body.appendChild(processForm);
  processForm.submit();
  
} catch (error) {
  console.error('Payment flow error:', error);
  alert('Payment error: ' + error.message);
}
```

---

## Checksum Calculations

### For Initiate Request (Checkout)
```typescript
Fields ordered as:
1. PAYGATE_ID
2. REFERENCE
3. AMOUNT
4. CURRENCY
5. RETURN_URL
6. TRANSACTION_DATE
7. LOCALE
8. COUNTRY
9. EMAIL
10. NOTIFY_URL

CHECKSUM = MD5(concat all + MERCHANT_KEY)
```

### For Process Request
```
CHECKSUM = MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + MERCHANT_KEY)
```

### For Callback Notification (Notify URL)
```
CHECKSUM = MD5(concat all sorted field values + MERCHANT_KEY)
```

### For Return Redirect
```
CHECKSUM = MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + MERCHANT_KEY)
```

---

## Environment Variables Required

```env
PAYGATE_MERCHANT_ID=your_merchant_id
PAYGATE_MERCHANT_KEY=your_merchant_key
NEXTAUTH_URL=https://www.namibiaservices.com
```

---

## Summary

| Component | Status | Issue |
|-----------|--------|-------|
| Checkout Endpoint | ✅ Working | Creates payment with reference |
| Frontend Form Submit | ✅ Submits | ❌ Response not captured |
| Extract PAY_REQUEST_ID | ❌ Missing | Not extracted from response |
| Save PAY_REQUEST_ID | ❌ Never Called | Endpoint exists but not used |
| Process Endpoint | ✅ Ready | ❌ Not called due to missing PAY_REQUEST_ID |
| Payment Processing | ✅ Works | ✅ Callback handler working well |
| Return Redirect | ❌ Fails | ❌ Lookups by payRequestId (still null) |

**The Fix**: Implement proper frontend response handling to:
1. Extract PAY_REQUEST_ID from initiate.trans response
2. Call save-pay-request to store it
3. Use it for process.trans
4. Allow return handler to find the payment record

