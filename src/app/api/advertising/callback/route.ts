/**
 * POST /api/advertising/callback
 * Handle PayGate payment callback for advertising subscriptions
 * 
 * PayGate sends:
 * - REFERENCE: Transaction reference (our AD_xxx_xxx_timestamp)
 * - PAY_REQUEST_ID: PayGate's payment ID
 * - TRANSACTION_STATUS: 1 (success) or 0 (failed)
 * - TRANSACTION_ID: PayGate transaction ID
 * - FAILURE_REASON: Reason if failed
 * - CHECKSUM: MD5 verification hash
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { payGate } from '@/lib/paygate';

export async function POST(request: NextRequest) {
  try {
    console.log('[AdCallback] ===== START =====');
    
    // PayGate sends URL-encoded form data
    const formData = await request.formData();
    const data: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    console.log('[AdCallback] Received notification for reference:', data.REFERENCE);
    
    // Verify checksum to ensure data integrity
    if (!payGate.verifyNotifyChecksum(data)) {
      console.error('[AdCallback] ❌ Invalid checksum - potential tampering');
      return new NextResponse('OK'); // Still return OK to prevent retries
    }

    console.log('[AdCallback] ✅ Checksum verified');

    // Check transaction status
    const isSuccess = data.TRANSACTION_STATUS === '1';
    console.log('[AdCallback] Transaction result:', isSuccess ? 'SUCCESS' : 'FAILED');

    // Find ad payment by REFERENCE
    const adPayment = await prisma.adPayment.findUnique({
      where: { transactionRef: data.REFERENCE },
      include: { adSubscription: true },
    });

    if (!adPayment) {
      console.error('[AdCallback] ❌ Ad payment record not found for reference:', data.REFERENCE);
      return new NextResponse('OK');
    }

    console.log('[AdCallback] ✅ Found ad payment:', adPayment.id);

    if (!isSuccess) {
      console.log('[AdCallback] Payment failed - updating to FAILED status');

      // Update ad payment to failed
      await prisma.adPayment.update({
        where: { id: adPayment.id },
        data: {
          status: 'FAILED',
          failureReason: data.FAILURE_REASON || 'Payment declined at gateway',
          paymentGatewayId: data.TRANSACTION_ID || data.REFERENCE,
        },
      });

      console.log('[AdCallback] ⚠️ Marked ad payment as FAILED');
      return new NextResponse('OK');
    }

    // Payment successful - update records
    console.log('[AdCallback] Payment successful - updating ad payment...');

    // Update ad payment to completed
    await prisma.adPayment.update({
      where: { id: adPayment.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
        paymentGatewayId: data.TRANSACTION_ID || data.REFERENCE,
      },
    });

    console.log('[AdCallback] ✅ Ad payment marked as COMPLETED');

    // Update advertising subscription - mark as active and set last payment date
    await prisma.advertisingSubscription.update({
      where: { id: adPayment.adSubscription.id },
      data: {
        lastPaymentDate: new Date(),
        status: 'ACTIVE', // Ensure it's active
      },
    });

    console.log('[AdCallback] ✅ Advertising subscription activated and payment date updated');

    // Log success
    console.log('[AdCallback] ===== COMPLETE (SUCCESS) =====');

    return new NextResponse('OK');
  } catch (error) {
    console.error('[AdCallback] ❌ Error processing callback:', error);
    // Still return OK to prevent PayGate retries
    return new NextResponse('OK');
  }
}
