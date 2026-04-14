# PayGate Return Checksum Fix - Complete Implementation

## Problem Summary

You were getting `error=invalid_checksum` when PayGate returned to your `/api/subscriptions/return` endpoint because:

**The checksum calculation was incomplete.** PayGate's return POST only sends:
- `PAY_REQUEST_ID`
- `TRANSACTION_STATUS`  
- `CHECKSUM`

But your code was trying to read:
- `PAYGATE_ID` ❌ (not sent by PayGate)
- `REFERENCE` ❌ (not sent by PayGate)
- `TRANSACTION_STATUS` ✓ (but should NOT be in checksum formula)
- Plus incorrect checksum formula that included TRANSACTION_STATUS

**According to PayGate's official documentation**, the return checksum should be calculated as:
```
MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
```

NOT including TRANSACTION_STATUS.

## Solution Implemented

### 1. **Extended Payment Model** (`prisma/schema.prisma`)
Added `payRequestId` field to track PayGate's PAY_REQUEST_ID:
```prisma
model Payment {
  // ... other fields ...
  payRequestId      String?  @unique @map("pay_request_id")  // PayGate PAY_REQUEST_ID
  transactionRef    String?  @unique @map("transaction_ref")  // REFERENCE sent to PayGate
  // ... rest of fields ...
}
```

**Migration**: `prisma/migrations/20260415_add_pay_request_id/migration.sql`

### 2. **New Endpoint** (`/api/subscriptions/save-pay-request`)
Browser calls this endpoint immediately after PayGate's `initiate.trans` returns PAY_REQUEST_ID:

```typescript
POST /api/subscriptions/save-pay-request
Body: { payRequestId: "...", reference: "..." }
```

This maps PAY_REQUEST_ID → REFERENCE in the database so we can look it up later.

### 3. **Updated Browser Flow** (`SectionSubscriptionPackages.tsx`)
Added call to save-pay-request endpoint after step 1:
```typescript
// After extracting PAY_REQUEST_ID from PayGate's initiate.trans response:
await fetch('/api/subscriptions/save-pay-request', {
  method: 'POST',
  body: JSON.stringify({ payRequestId, reference })
});
```

### 4. **Fixed Checksum Verification** (`src/lib/paygate.ts`)
Changed `verifyReturnChecksum` to use the correct formula and accept parameters:

**Before:**
```typescript
verifyReturnChecksum(data: Record<string, string>): boolean
  // ❌ Tried to read PAYGATE_ID and REFERENCE from POST data
  // ❌ Included TRANSACTION_STATUS in checksum
```

**After:**
```typescript
verifyReturnChecksum(
  payRequestId: string,
  reference: string,
  checksum: string
): boolean
  // ✓ Uses PAYGATE_ID from config
  // ✓ Uses PAY_REQUEST_ID + REFERENCE from parameters
  // ✓ Calculates: MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
```

### 5. **Updated Return Handler** (`/api/subscriptions/return`)
Now properly handles the return flow:

```typescript
1. Receive PAY_REQUEST_ID, TRANSACTION_STATUS, CHECKSUM from PayGate POST
2. Look up Payment record using payRequestId
3. Extract REFERENCE from payment.transactionRef
4. Verify checksum: MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
5. Update payment status based on TRANSACTION_STATUS (1 = success, 0 = failed)
6. Redirect to success/failure page
```

## Flow Diagram

```
1. Browser → /api/subscriptions/checkout
   Creates: Payment { transactionRef: "NS_SUB_..." }

2. Browser → PayGate initiate.trans
   PayGate returns: PAY_REQUEST_ID

3. Browser → /api/subscriptions/save-pay-request
   Updates: Payment { payRequestId: "..." }

4. Browser → PayGate process.trans
   User enters payment details

5. PayGate → /api/subscriptions/return (POST)
   Data: PAY_REQUEST_ID, TRANSACTION_STATUS, CHECKSUM

6. Server:
   - Look up Payment by payRequestId
   - Get REFERENCE from payment.transactionRef
   - Verify checksum: MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
   - Update payment status
   - Redirect to success page
```

## Database Migration

When you deploy, run:
```bash
npm run prisma:migrate
# or
npx prisma migrate deploy
```

This will add the `pay_request_id` column to the payments table.

## Testing Checklist

- [ ] Run database migration
- [ ] Deploy all code changes
- [ ] Test subscription payment flow on test environment:
  1. Click "Subscribe" button
  2. Fill PayGate test card details
  3. Complete payment form
  4. Should see checksum validation succeed (no more `invalid_checksum` error)
  5. Should be redirected to success page

## Environment Variables Check

Ensure your `.env.local` has:
```
PAYGATE_MERCHANT_ID=10011072130
PAYGATE_MERCHANT_KEY=<your_secret_key>
```

## Key Changes Summary

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added `payRequestId` field to Payment |
| `prisma/migrations/20260415_add_pay_request_id/migration.sql` | Migration script |
| `src/app/api/subscriptions/save-pay-request/route.ts` | NEW endpoint |
| `src/components/SectionSubscriptionPackages.tsx` | Added save-pay-request call |
| `src/lib/paygate.ts` | Fixed `verifyReturnChecksum` signature and logic |
| `src/app/api/subscriptions/return/route.ts` | Updated to look up reference and use new checksum verification |

## Root Cause Explanation

The fundamental issue was that your original code assumed PayGate would send all the data needed to verify the checksum, but:

1. **Architectural issue**: PayGate's return POST is a client-side redirect (not server-to-server), so it can't include sensitive data
2. **Field mapping**: You needed to map PAY_REQUEST_ID back to REFERENCE somehow
3. **Checksum formula**: You were using the wrong formula that included TRANSACTION_STATUS

By saving PAY_REQUEST_ID → REFERENCE mapping when PayGate returns it during the `initiate.trans` step, you now have all the data needed to verify the return checksum correctly.

## Callback vs Return Difference

- **RETURN** (user redirect): Only PAY_REQUEST_ID, TRANSACTION_STATUS, CHECKSUM sent
  - Checksum formula: `PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY`
  
- **NOTIFY** (server-side callback): All fields sent
  - Checksum formula: All field values concatenated + KEY

Your payment callback endpoint uses `verifyNotifyChecksum` which is correct for that flow.
