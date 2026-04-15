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

    // Find payment by REFERENCE
    const payment = await prisma.payment.findUnique({
      where: { transactionRef: data.REFERENCE },
    });

    if (!payment) {
      console.error('[AdCallback] ❌ Payment record not found for reference:', data.REFERENCE);
      return new NextResponse('OK');
    }

    console.log('[AdCallback] ✅ Found payment:', payment.id);

    if (!isSuccess) {
      console.log('[AdCallback] Payment failed - updating to FAILED status');

      // Update payment to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason: data.FAILURE_REASON || 'Payment declined at gateway',
          paymentGatewayId: data.TRANSACTION_ID || data.REFERENCE,
        },
      });

      console.log('[AdCallback] ⚠️ Marked payment as FAILED and ad as INACTIVE');
      
      // Also mark advertising subscription as inactive
      // Extract subscription ID from reference if possible (AD_{businessId}_{packageId}_{timestamp})
      const refParts = data.REFERENCE.split('_');
      if (refParts[0] === 'AD') {
        const businessId = refParts[1];
        const packageId = refParts[2];
        
        await prisma.advertisingSubscription.updateMany({
          where: {
            businessId,
            packageId,
            status: 'ACTIVE', // Only if still active
            paymentId: null, // Not yet linked to successful payment
          },
          data: {
            status: 'INACTIVE',
          },
        });
      }

      return new NextResponse('OK');
    }

    // Payment successful - update records
    console.log('[AdCallback] Payment successful - updating advertising subscription...');

    // Update payment to completed
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
        paymentGatewayId: data.TRANSACTION_ID || data.REFERENCE,
      },
    });

    console.log('[AdCallback] ✅ Payment marked as COMPLETED');

    // Update advertising subscription - link to payment and mark as active
    const refParts = data.REFERENCE.split('_');
    if (refParts[0] === 'AD') {
      const businessId = refParts[1];
      const packageId = refParts[2];
      
      await prisma.advertisingSubscription.updateMany({
        where: {
          businessId,
          packageId,
          status: 'ACTIVE', // Should already be ACTIVE from creation
        },
        data: {
          paymentId: payment.id,
          lastPaymentDate: new Date(),
          status: 'ACTIVE', // Ensure it's active
        },
      });

      console.log('[AdCallback] ✅ Advertising subscription activated and linked to payment');
    }

    // Log success
    console.log('[AdCallback] ===== COMPLETE (SUCCESS) =====');

    return new NextResponse('OK');
  } catch (error) {
    console.error('[AdCallback] ❌ Error processing callback:', error);
    // Still return OK to prevent PayGate retries
    return new NextResponse('OK');
  }
}
