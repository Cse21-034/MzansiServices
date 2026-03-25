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

      return NextResponse.json({
        success: false,
        message: result.message,
      });
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
      return NextResponse.json({
        success: false,
        message: 'Payment record not found',
      });
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

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      subscriptionId: subscription.id,
    });
  } catch (error) {
    console.error('Subscription callback error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing payment callback',
      },
      { status: 500 }
    );
  }
}
