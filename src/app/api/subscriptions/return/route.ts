/**
 * POST /api/subscriptions/return
 * Handles PayGate's RETURN_URL POST redirect after payment
 * This is different from the NOTIFY_URL - this is the user-facing redirect
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { payGate } from '@/lib/paygate';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Convert FormData to object
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    const payRequestId = data.PAY_REQUEST_ID || '';
    const transactionStatus = data.TRANSACTION_STATUS || '0';
    const checksum = data.CHECKSUM || '';

    console.log('[Return Handler] Received from PayGate:', {
      payRequestId,
      transactionStatus,
      hasChecksum: !!checksum,
    });

    if (!payRequestId) {
      console.error('[Return Handler] Missing PAY_REQUEST_ID');
      return NextResponse.redirect(
        new URL('/?error=missing_pay_request_id', request.nextUrl.origin),
        { status: 303 }
      );
    }

    // Look up the payment record by payRequestId to get the REFERENCE
    const payment = await prisma.payment.findUnique({
      where: { payRequestId },
      include: {
        subscription: {
          select: { businessId: true },
        },
      },
    });

    if (!payment) {
      console.error('[Return Handler] Payment not found for payRequestId:', payRequestId);
      return NextResponse.redirect(
        new URL('/?error=payment_not_found', request.nextUrl.origin),
        { status: 303 }
      );
    }

    const reference = payment.transactionRef || '';
    const businessId = payment.subscription.businessId;

    if (!reference) {
      console.error('[Return Handler] No transaction reference found for payment:', payment.id);
      return NextResponse.redirect(
        new URL('/?error=invalid_transaction', request.nextUrl.origin),
        { status: 303 }
      );
    }

    console.log('[Return Handler] Retrieved reference:', reference, 'for payRequestId:', payRequestId);

    // ⚠️ Verify checksum using the correct formula from PayGate docs
    // Checksum = MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
    if (!payGate.verifyReturnChecksum(payRequestId, reference, checksum)) {
      console.error('[Return Handler] Invalid checksum, data may be tampered with');
      console.error('[Return Handler] Checksum verification failed:', {
        payRequestId,
        reference,
        receivedChecksum: checksum,
      });
      // Don't trust the data - redirect to home with error
      return NextResponse.redirect(
        new URL('/?error=invalid_checksum', request.nextUrl.origin),
        { status: 303 }
      );
    }

    // Determine success based on TRANSACTION_STATUS
    // 1 = Success, 0 = Failed
    const isSuccess = transactionStatus === '1';

    console.log(`[Return Handler] Transaction ${reference}: ${isSuccess ? 'SUCCESS' : 'FAILED'}`);

    // Update the payment status based on transaction result
    if (isSuccess) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          paymentGatewayId: payRequestId,
          paidAt: new Date(),
        },
      });

      // Activate the subscription
      await prisma.subscription.update({
        where: { businessId },
        data: { status: 'ACTIVE' },
      });
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          paymentGatewayId: payRequestId,
          failureReason: `PayGate returned TRANSACTION_STATUS=${transactionStatus}`,
        },
      });
    }

    // Build redirect URL with query parameters
    const redirectUrl = new URL(
      `/business/${businessId}/subscription/success`,
      request.nextUrl.origin
    );

    redirectUrl.searchParams.set('reference', reference);
    redirectUrl.searchParams.set('status', isSuccess ? 'success' : 'failed');
    redirectUrl.searchParams.set('businessId', businessId);
    redirectUrl.searchParams.set('payRequestId', payRequestId);

    console.log(`[Return Handler] Redirecting to: ${redirectUrl.pathname}?${redirectUrl.searchParams}`);

    // Use 303 (See Other) so browser follows with GET request
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    console.error('[Return Handler] Error:', error);
    return NextResponse.redirect(
      new URL('/namibiaservices?error=redirect_failed', request.nextUrl.origin),
      { status: 303 }
    );
  }
}
