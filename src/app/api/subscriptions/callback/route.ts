/**
 * POST /api/subscriptions/callback
 * Handle PayGate payment callback notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { payGate } from '@/lib/paygate';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // ⚠️ CRITICAL: Verify checksum before processing any data
    if (!payGate.verifyNotifyChecksum(data)) {
      console.error('Invalid checksum in PayGate notification:', data);
      // Still respond with OK to prevent retries, but don't process
      return new NextResponse('OK');
    }

    // Process PayGate notification
    const result = await payGate.processNotification(data);

    if (!result.success) {
      console.error('Payment failed:', data);

      // Update payment record
      const payment = await prisma.payment.findUnique({
        where: { transactionRef: data.REFERENCE },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            failureReason: data.FAILURE_REASON || 'Payment declined',
            paymentGatewayId: data.TRANSACTION_ID || '',
          },
        });
      }

      // Response with plain text OK for PayGate (required by documentation)
      return new NextResponse('OK');
    }

    // Get payment details
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
      console.error('Payment record not found:', data.REFERENCE);
      // Still return OK to prevent PayGate retries
      return new NextResponse('OK');
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
        paymentGatewayId: data.TRANSACTION_ID || '',
      },
    });

    // Activate subscription
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

    // Log successful activation
    console.log(`✓ Subscription activated for business: ${subscription.businessId}`);

    // IMPORTANT: Respond with plain text OK (required by PayGate documentation)
    return new NextResponse('OK');
  } catch (error) {
    console.error('Subscription callback error:', error);
    // Even on error, return OK to prevent PayGate retries
    // Log the error for manual investigation
    return new NextResponse('OK');
  }
}
