/**
 * POST /api/subscriptions/callback
 * Handle PayGate payment callback notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { payGate } from '@/lib/paygate';

export async function POST(request: NextRequest) {
  try {
    console.log('[Callback] ===== START =====');
    
    // PayGate sends URL-encoded form data, NOT JSON
    const formData = await request.formData();
    const data: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    console.log('[Callback] Received notification');
    console.log('[Callback] REFERENCE:', data.REFERENCE);
    console.log('[Callback] TRANSACTION_ID:', data.TRANSACTION_ID);
    console.log('[Callback] TRANSACTION_STATUS:', data.TRANSACTION_STATUS);

    // ⚠️ CRITICAL: Verify checksum before processing any data
    if (!payGate.verifyNotifyChecksum(data)) {
      console.error('[Callback] ❌ Invalid checksum in PayGate notification');
      console.error('[Callback] Potential tampering - rejecting notification');
      // Still respond with OK to prevent retries, but don't process
      return new NextResponse('OK');
    }

    console.log('[Callback] ✅ Checksum verified');

    // Check transaction status
    const isSuccess = data.TRANSACTION_STATUS === '1';
    console.log('[Callback] Transaction result:', isSuccess ? 'SUCCESS' : 'FAILED');

    // Find payment by REFERENCE
    console.log('[Callback] Looking up payment record...');
    
    const payment = await prisma.payment.findUnique({
      where: { transactionRef: data.REFERENCE },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!payment) {
      console.error('[Callback] ❌ Payment record not found for reference:', data.REFERENCE);
      // Still return OK to prevent PayGate retries
      return new NextResponse('OK');
    }

    console.log('[Callback] ✅ Found payment:', payment.id);

    if (!isSuccess) {
      console.log('[Callback] Payment failed - updating to FAILED status');

      // Update payment record for failed transaction
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason: data.FAILURE_REASON || 'Payment declined at gateway',
          paymentGatewayId: data.TRANSACTION_ID || '',
        },
      });

      console.log('[Callback] ⚠️ Payment marked as FAILED');
      // Response with plain text OK for PayGate (required by documentation)
      return new NextResponse('OK');
    }

    // Payment successful - update payment record
    console.log('[Callback] Payment successful - updating records...');

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
        paymentGatewayId: data.TRANSACTION_ID || '',
        payRequestId: data.PAY_REQUEST_ID || undefined,
      },
    });

    console.log('[Callback] ✅ Payment marked as COMPLETED');

    // Activate subscription
    console.log('[Callback] Activating subscription for businessId:', payment.subscription.businessId);
    
    const subscription = payment.subscription;
    const endDate = new Date();
    
    if (subscription.billingCycle === 'YEARLY') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
        endDate,
        renewalDate: endDate,
        currentPaymentId: payment.id,
      },
    });

    console.log('[Callback] ✅ Subscription ACTIVATED');
    console.log('[Callback] ===== END (SUCCESS) =====');

    // IMPORTANT: Respond with plain text OK (required by PayGate documentation)
    return new NextResponse('OK');
  } catch (error) {
    console.error('[Callback] ===== EXCEPTION =====');
    console.error('[Callback] Error:', error);
    console.error('[Callback] Error type:', error?.constructor?.name);
    if (error instanceof Error) {
      console.error('[Callback] Stack:', error.stack?.split('\n').slice(0, 5).join('\n'));
    }
    // Even on error, return OK to prevent PayGate retries
    // Log the error for manual investigation
    return new NextResponse('OK');
  }
}
