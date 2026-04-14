# Payment Flow Fix - Implementation Guide

## The Core Issue (In 30 Seconds)

Your payment is **successfully processing** ✅, but the **return URL handler fails** ❌ because:

1. User's browser submits form to PayGate's `initiate.trans`
2. PayGate returns a response with `PAY_REQUEST_ID`
3. **❌ Your frontend doesn't extract this ID**
4. **❌ Your frontend doesn't save it to database**
5. When PayGate redirects back to return URL, it sends the `PAY_REQUEST_ID`
6. Return handler queries database: `findUnique({ payRequestId })`
7. **❌ Database has payRequestId = null** → Payment not found
8. User sees: `/?error=payment_not_found` ❌

---

## Request/Response Flow Detailed

### 1. Checkout Endpoint Success ✅
```
POST /api/subscriptions/checkout body { planTier, businessId }

Response:
{
  "success": true,
  "checkout": {
    "initiateUrl": "https://secure.paygate.co.za/payweb3/initiate.trans",
    "processUrl": "https://secure.paygate.co.za/payweb3/process.trans",
    "reference": "NS_SUB_business_123_1644567890",
    "params": { /* all signed fields */ }
  }
}

✅ Frontend receives: initiateUrl, processUrl, params, reference
✅ Database: Payment record created with transactionRef = reference
```

### 2. Submit to Initiate URL (Partially Working ⚠️)
```
POST https://secure.paygate.co.za/payweb3/initiate.trans
(Browser submits form with all params + CHECKSUM)

Response from PayGate:
<!DOCTYPE html>
<html>
  <body>
    <form>
      <input name="PAY_REQUEST_ID" value="abc123xyz789000" />
      <!-- Other hidden fields -->
    </form>
  </body>
</html>

❌ Frontend: Form submitted but response IGNORED
❌ PAY_REQUEST_ID never extracted
```

### 3. Missing Step: Save PAY_REQUEST_ID (NEVER HAPPENS ❌)
```
POST /api/subscriptions/save-pay-request
{
  "payRequestId": "abc123xyz789000",
  "reference": "NS_SUB_business_123_1644567890"
}

Response:
{ "success": true, "message": "PAY_REQUEST_ID saved" }

❌ This entire step is skipped!
❌ Database Payment record stays with payRequestId = null
```

### 4. Submit to Process URL (May Not Happen ❌)
```
Frontend should call:
POST /api/subscriptions/process
{ "payRequestId": "abc123xyz789000", "reference": "..." }

Then submit form to:
POST https://secure.paygate.co.za/payweb3/process.trans
{ "PAY_REQUEST_ID": "abc123xyz789000", "CHECKSUM": "..." }

But this can't happen because:
❌ PAY_REQUEST_ID was never extracted from step 2
```

### 5. Payment Processing Works ✅
```
User completes payment at PayGate
↓
PayGate sends server callback to /api/subscriptions/callback
POST /api/subscriptions/callback
{
  "REFERENCE": "NS_SUB_business_123_1644567890",
  "TRANSACTION_STATUS": "1",
  "TRANSACTION_ID": "12345678",
  "CHECKSUM": "..."
}

✅ Handler finds Payment by: transactionRef = REFERENCE
✅ Updates Payment status to COMPLETED
✅ Activates Subscription
```

### 6. Return Redirect FAILS ❌
```
PayGate redirects browser to:
POST /api/subscriptions/return
{
  "PAY_REQUEST_ID": "abc123xyz789000",
  "TRANSACTION_STATUS": "1",
  "CHECKSUM": "..."
}

Handler tries:
const payment = await prisma.payment.findUnique({
  where: { payRequestId: "abc123xyz789000" }
});

Database state:
Payment = {
  transactionRef: "NS_SUB_business_123_1644567890",
  payRequestId: null,  // ← STILL NULL! Never saved in step 3
  status: "COMPLETED"  // Already completed by callback
}

Query result: null
↓
❌ Returns redirect: /?error=payment_not_found
```

---

## The Fix: Update SubscriptionPlans.tsx

The issue is completely in the **frontend component**. Here's what needs to change:

### Current Code (Broken ❌)
```typescript
// Step 2 & 3: Submit combined form directly to initiate.trans
const form = document.createElement('form');
form.method = 'POST';
form.action = initiateUrl; // First submit to initiate.trans

Object.entries(params).forEach(([key, value]) => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = key;
  input.value = String(value);
  form.appendChild(input);
});

document.body.appendChild(form);

setTimeout(() => {
  form.submit();  // ❌ JUST FIRES AND FORGETS - Response not handled!
}, 100);
```

### Fixed Code (Correct Flow ✅)
Replace the payment flow with this proper implementation:

```typescript
const handleSubscribe = async (planTier: string, billingCycle = 'MONTHLY') => {
  if (!session?.user) {
    router.push('/login');
    return;
  }

  setProcessingTier(planTier);

  try {
    // ========== STEP 1: Get checkout params ==========
    console.log('[Payment Flow] Step 1: Getting checkout params...');
    
    const checkoutResponse = await fetch('/api/subscriptions/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTier,
        businessId,
        billingCycle,
      }),
    });

    const checkoutData = await checkoutResponse.json();

    if (!checkoutData.success) {
      alert('Failed: ' + checkoutData.message);
      setProcessingTier(null);
      return;
    }

    // Free plan - handle separately
    if (checkoutData.free) {
      router.push(checkoutData.redirectUrl);
      return;
    }

    const { initiateUrl, processUrl, params, reference } = checkoutData.checkout;

    console.log('[Payment Flow] Step 1 Complete: Received params and URLs');
    console.log('[Payment Flow] Reference:', reference);

    // ========== STEP 2: Submit to initiate.trans and CAPTURE response ==========
    console.log('[Payment Flow] Step 2: Submitting to initiate.trans...');

    // Build FormData for initiate.trans submission
    const initiateFormData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      initiateFormData.append(key, String(value));
    });

    // IMPORTANT: Use fetch to capture response (not form.submit())
    let payRequestId: string | null = null;
    
    try {
      const initiateResponse = await fetch(initiateUrl, {
        method: 'POST',
        body: initiateFormData,
      });

      // Get response as text/HTML
      const initiateHtml = await initiateResponse.text();
      console.log('[Payment Flow] Received initiate.trans response');

      // Extract PAY_REQUEST_ID from HTML response
      // PayGate returns HTML with hidden form fields
      const idMatch = initiateHtml.match(
        /name=['"]PAY_REQUEST_ID['"][\s\S]*?value=['"]([^'"]+)['"]/i
      );
      
      if (!idMatch || !idMatch[1]) {
        // Fallback: try to find it in JSON response if PayGate returns JSON
        try {
          const jsonResponse = JSON.parse(initiateHtml);
          payRequestId = jsonResponse.PAY_REQUEST_ID;
        } catch (e) {
          // Not JSON
        }
      } else {
        payRequestId = idMatch[1];
      }

      if (!payRequestId) {
        console.error('[Payment Flow] Failed to extract PAY_REQUEST_ID');
        console.error('[Payment Flow] Response excerpt:', initiateHtml.substring(0, 500));
        alert('Payment error: Failed to get payment request ID from PayGate');
        setProcessingTier(null);
        return;
      }

      console.log('[Payment Flow] Step 2 Complete: Extracted PAY_REQUEST_ID:', payRequestId);
    } catch (fetchError) {
      console.error('[Payment Flow] initiate.trans fetch error:', fetchError);
      
      // If fetch fails (CORS etc), fall back to form submission
      // But we won't get PAY_REQUEST_ID this way ❌
      console.warn('[Payment Flow] Falling back to form submission (PAY_REQUEST_ID will be lost)');
      alert('Warning: Payment flow may be incomplete due to browser restrictions');
      setProcessingTier(null);
      return;
    }

    // ========== STEP 3: Save PAY_REQUEST_ID to database ==========
    console.log('[Payment Flow] Step 3: Saving PAY_REQUEST_ID to database...');

    try {
      const saveResponse = await fetch('/api/subscriptions/save-pay-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payRequestId,
          reference,
        }),
      });

      const saveData = await saveResponse.json();
      
      if (!saveData.success) {
        console.error('[Payment Flow] Failed to save PAY_REQUEST_ID:', saveData.message);
        // Don't fail completely - payment might still work via callback
        // But return URL will fail
      } else {
        console.log('[Payment Flow] Step 3 Complete: PAY_REQUEST_ID saved');
      }
    } catch (saveError) {
      console.error('[Payment Flow] save-pay-request error:', saveError);
      // Continue anyway - callback will still process payment
    }

    // ========== STEP 4: Get process.trans params ==========
    console.log('[Payment Flow] Step 4: Getting process.trans parameters...');

    const processResponse = await fetch('/api/subscriptions/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payRequestId,
        reference,
      }),
    });

    const processData = await processResponse.json();

    if (!processData.success) {
      console.error('[Payment Flow] Process endpoint error:', processData.message);
      alert('Payment error: Failed to process payment request');
      setProcessingTier(null);
      return;
    }

    console.log('[Payment Flow] Step 4 Complete: Received process params');
    console.log('[Payment Flow] Process URL:', processData.processUrl);

    // ========== STEP 5: Submit to process.trans ==========
    console.log('[Payment Flow] Step 5: Submitting to process.trans...');

    const processForm = document.createElement('form');
    processForm.method = 'POST';
    processForm.action = processData.processUrl;

    // Add process parameters to form
    Object.entries(processData.params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      processForm.appendChild(input);
      console.log(`[Payment Flow] Added field: ${key}`);
    });

    document.body.appendChild(processForm);

    console.log('[Payment Flow] Step 5: Submitting form to process.trans...');
    console.log('[Payment Flow] Form HTML:', processForm.outerHTML);

    // Submit the form to PayGate's process.trans
    // User will be redirected to PayGate hosted payment page
    setTimeout(() => {
      processForm.submit();
    }, 100);

  } catch (error) {
    console.error('[Payment Flow] Unexpected error:', error);
    alert('Payment error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    setProcessingTier(null);
  }
};
```

---

## Database State at Each Step

### After Step 1 (Checkout)
```javascript
Payment {
  id: "cuid123abc",
  transactionRef: "NS_SUB_business_123_1644567890",
  payRequestId: null,                      // ← Not set yet
  status: "PENDING"
}
```

### After Step 3 (Save PAY_REQUEST_ID) ✅ FIX MAKES THIS WORK
```javascript
Payment {
  id: "cuid123abc",
  transactionRef: "NS_SUB_business_123_1644567890",
  payRequestId: "abc123xyz789000",        // ← NOW SAVED! ✅
  status: "PENDING"
}
```

### After Callback/Return
```javascript
Payment {
  id: "cuid123abc",
  transactionRef: "NS_SUB_business_123_1644567890",
  payRequestId: "abc123xyz789000",        // ← Can be found! ✅
  status: "COMPLETED",
  paidAt: "2026-04-14T11:13:30Z",
  paymentGatewayId: "12345678"
}
```

### Return Handler Query Works ✅
```typescript
const payment = await prisma.payment.findUnique({
  where: { payRequestId: "abc123xyz789000" }  
});
// ✅ FINDS the payment record!
```

---

## Console Logs for Debugging

With the fixed code, you'll see these logs in browser console:

```
[Payment Flow] Step 1: Getting checkout params...
[Payment Flow] Step 1 Complete: Received params and URLs
[Payment Flow] Reference: NS_SUB_business_123_1644567890
[Payment Flow] Step 2: Submitting to initiate.trans...
[Payment Flow] Received initiate.trans response
[Payment Flow] Step 2 Complete: Extracted PAY_REQUEST_ID: abc123xyz789000
[Payment Flow] Step 3: Saving PAY_REQUEST_ID to database...
[Payment Flow] Step 3 Complete: PAY_REQUEST_ID saved
[Payment Flow] Step 4: Getting process.trans parameters...
[Payment Flow] Step 4 Complete: Received process params
[Payment Flow] Process URL: https://secure.paygate.co.za/payweb3/process.trans
[Payment Flow] Step 5: Submitting to process.trans...
[Payment Flow] Step 5: Submitting form to process.trans...
[Payment Flow] Added field: PAY_REQUEST_ID
[Payment Flow] Added field: CHECKSUM
```

---

## Testing the Fix

### Test Checklist

- [ ] **Test 1: Checkout endpoint responds with params**
  ```
  - Go to subscription page
  - Check browser console logs show "Step 1 Complete"
  - Check response has initiateUrl, processUrl, params
  ```

- [ ] **Test 2: PAY_REQUEST_ID extracted**
  ```
  - Console should log "Extracted PAY_REQUEST_ID: abc123..."
  - If missing, check PayGate's response format
  ```

- [ ] **Test 3: save-pay-request completes**
  ```
  - Console should log "PAY_REQUEST_ID saved"
  - Database Payment record should have payRequestId set
  ```

- [ ] **Test 4: Form submitted to process.trans**
  ```
  - User redirected to PayGate hosted payment page
  - URL should be: https://secure.paygate.co.za/payweb3/process.trans
  ```

- [ ] **Test 5: Payment processes**
  ```
  - Use PayGate test card: 4111111111111111
  - Enter any future expiry and CVC
  - Click Pay
  ```

- [ ] **Test 6: Return URL works**
  ```
  - After payment, PayGate redirects to /api/subscriptions/return
  - NO MORE error=payment_not_found ✅
  - Redirects to: /business/{id}/subscription/success
  ```

- [ ] **Test 7: Subscription activated**
  ```
  - Check database: Subscription.status = "ACTIVE"
  - Check database: Payment.status = "COMPLETED"
  - Business should have access to paid features
  ```

---

## Potential Issues & Solutions

### Issue 1: PayGate Returns JSON Response

**Problem**: PayGate might return JSON instead of HTML

**Solution**: Code already handles this:
```typescript
try {
  const jsonResponse = JSON.parse(initiateHtml);
  payRequestId = jsonResponse.PAY_REQUEST_ID;
} catch (e) {
  // Not JSON
}
```

### Issue 2: CORS Error When Fetching initiate.trans

**Problem**: PayGate's initiate.trans might block fetch requests

**Symptom**: Console error about CORS or blocked by CloudFront WAF

**Solution**: This is why the original code used form.submit(). If you get CORS errors:

```typescript
// Option 1: Use fetch with mode: 'no-cors' (limits response access)
const initiateResponse = await fetch(initiateUrl, {
  method: 'POST',
  body: initiateFormData,
  mode: 'no-cors',  // ← Prevents CORS errors but can't read response
});

// Option 2: Go back to form submission (but then can't capture PAY_REQUEST_ID)
// You'd need alternative way to track it

// Option 3: Use server-side fetch from your API instead
```

### Issue 3: PayGate Returns Redirect Instead of Form

**Problem**: Some payment gateways return a 302 redirect instead of HTML form

**Current Code Limitation**: fetch() follows redirects automatically

**Solution**: If needed, add:
```typescript
const initiateResponse = await fetch(initiateUrl, {
  method: 'POST',
  body: initiateFormData,
  redirect: 'manual',  // Don't follow redirects
});

// Then handle 302 responses
```

---

## Alternative: Server-Side Redirect Approach

If CORS prevents fetch to PayGate, use this alternative:

### Modified Approach: Use a Server-Side Proxy

Create new endpoint `/api/subscriptions/initiate`:

```typescript
// POST /api/subscriptions/initiate
// Frontend calls this instead of going directly to PayGate

import { NextRequest, NextResponse } from 'next/server';
import { payGate } from '@/lib/paygate';

export async function POST(request: NextRequest) {
  try {
    const { params, reference } = await request.json();

    // Server submits form to PayGate on behalf of frontend
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const response = await fetch(payGate.INITIATE_URL, {
      method: 'POST',
      body: formData,
    });

    const html = await response.text();

    // Extract PAY_REQUEST_ID server-side
    const idMatch = html.match(/name=['"]PAY_REQUEST_ID['"][\s\S]*?value=['"]([^'"]+)['"]/i);
    const payRequestId = idMatch?.[1];

    if (!payRequestId) {
      return NextResponse.json({
        success: false,
        message: 'Failed to get PAY_REQUEST_ID from PayGate',
      }, { status: 400 });
    }

    // Server saves PAY_REQUEST_ID to database
    const prisma = await import('@/lib/prisma').then(m => m.prisma);
    await prisma.payment.update({
      where: { transactionRef: reference },
      data: { payRequestId },
    });

    // Return just the payRequestId and reference
    return NextResponse.json({
      success: true,
      payRequestId,
      reference,
    });
  } catch (error) {
    console.error('[Initiate] Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Initiate transaction failed',
    }, { status: 500 });
  }
}
```

Then frontend becomes simpler:
```typescript
// Step 2: Call server endpoint instead of PayGate directly
const initiateResponse = await fetch('/api/subscriptions/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ params, reference }),
});

const initiateData = await initiateResponse.json();
const { payRequestId } = initiateData;

// Step 3: Skip save-pay-request (already done server-side)

// Step 4: Get process params and submit form...
```

---

## Success Criteria

After implementing this fix:

✅ Payment flow completes without `payment_not_found` error
✅ Console logs show all 5 steps completing
✅ Database Payment record has payRequestId populated  
✅ Return URL handler finds the payment successfully
✅ User redirected to success page, not error page
✅ Subscription activated and business has paid features

