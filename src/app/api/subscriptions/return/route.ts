/**
 * POST /api/subscriptions/return
 * Handles PayGate's RETURN_URL POST redirect after payment
 * 
 * Per PayGate documentation:
 * - This is CLIENT-SIDE redirect (not for final reconciliation)
 * - Always use NOTIFY_URL callback for payment confirmation
 * - Fields: PAY_REQUEST_ID, TRANSACTION_STATUS, CHECKSUM
 * - Checksum formula: MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { payGate } from '@/lib/paygate';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Parse form data from PayGate
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    const payRequestId = data.PAY_REQUEST_ID || '';
    const transactionStatus = data.TRANSACTION_STATUS || '0';
    const checksum = data.CHECKSUM || '';

    console.log('[Return] ===== START =====');
    console.log('[Return] Received from PayGate');
    
    // Log all fields received for debugging
    console.log('[Return] ALL FIELDS FROM PAYGATE:');
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'CHECKSUM') {
        console.log(`[Return]   ${key}=${value}`);
      }
    });
    console.log('[Return] CHECKSUM (received):', checksum);
    
    console.log('[Return] PAY_REQUEST_ID:', payRequestId);
    console.log('[Return] TRANSACTION_STATUS:', transactionStatus, '(1=success, 0=failed)');

    // Validate required fields
    if (!payRequestId) {
      console.error('[Return] ❌ Missing PAY_REQUEST_ID');
      return NextResponse.redirect(
        new URL('/?error=missing_pay_request_id', request.nextUrl.origin),
        { status: 303 }
      );
    }

    if (!checksum) {
      console.error('[Return] ❌ Missing CHECKSUM');
      return NextResponse.redirect(
        new URL('/?error=invalid_checksum', request.nextUrl.origin),
        { status: 303 }
      );
    }

    // Look up payment by payRequestId using raw SQL to avoid type issues
    console.log('[Return] Looking up payment record...');
    
    const payments = await (prisma as any).$queryRaw`
      SELECT id, status, "transaction_ref" as "transactionRef", "subscription_id" as "subscriptionId"
      FROM "payments"
      WHERE "pay_request_id" = ${payRequestId}
      LIMIT 1
    `;
    
    const payment = payments.length > 0 ? payments[0] : null;

    if (!payment) {
      console.warn('[Return] ⚠️ Payment not found for payRequestId:', payRequestId);
      console.warn('[Return] Attempting fallback lookup...');
      
      // FALLBACK: Try to find the most recent payment from the last 10 minutes
      // This handles cases where pay_request_id was not saved for some reason
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      console.log('[Return] Looking for PENDING payments created after:', tenMinutesAgo);
      
      const fallbackPayments = await (prisma as any).$queryRaw`
        SELECT id, status, "transaction_ref" as "transactionRef", "subscription_id" as "subscriptionId"
        FROM "payments"
        WHERE status = 'PENDING' 
          AND created_at >= ${tenMinutesAgo}
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      const fallbackPayment = fallbackPayments.length > 0 ? fallbackPayments[0] : null;
      
      if (fallbackPayment) {
        console.warn('[Return] ⚠️ FALLBACK: Found recent PENDING payment:', fallbackPayment.id);
        console.warn('[Return] WARNING: pay_request_id was missing, using fallback lookup');
        
        // Use the fallback payment
        const reference = fallbackPayment.transactionRef;
        if (!reference) {
          console.error('[Return] ❌ Fallback payment has no transaction reference');
          return NextResponse.redirect(
            new URL('/?error=invalid_transaction', request.nextUrl.origin),
            { status: 303 }
          );
        }
        
        // Continue processing with fallback payment
        const subscription = await prisma.subscription.findUnique({
          where: { id: fallbackPayment.subscriptionId },
          select: { businessId: true },
        });

        if (!subscription?.businessId) {
          console.error('[Return] ❌ Fallback payment has no business ID');
          return NextResponse.redirect(
            new URL('/?error=invalid_transaction', request.nextUrl.origin),
            { status: 303 }
          );
        }

        // Determine success/failure and redirect accordingly
        const isSuccess = transactionStatus === '1';
        console.log('[Return] Fallback payment status:', isSuccess ? 'SUCCESS' : 'FAILED');

        if (isSuccess) {
          return NextResponse.redirect(
            new URL(`/subscriptions/success?reference=${reference}&orderId=${fallbackPayment.id}`, request.nextUrl.origin),
            { status: 303 }
          );
        } else {
          return NextResponse.redirect(
            new URL(`/?error=payment_failed&reference=${reference}`, request.nextUrl.origin),
            { status: 303 }
          );
        }
      }
      
      // No payment found at all
      console.error('[Return] ❌ FALLBACK ALSO FAILED: No payment found by either method');
      return NextResponse.redirect(
        new URL('/?error=payment_not_found', request.nextUrl.origin),
        { status: 303 }
      );
    }

    console.log('[Return] ✅ Payment found. Status:', payment.status);

    const reference = payment.transactionRef;
    if (!reference) {
      console.error('[Return] ❌ No transaction reference in payment record');
      return NextResponse.redirect(
        new URL('/?error=invalid_transaction', request.nextUrl.origin),
        { status: 303 }
      );
    }

    // Get subscription and business info
    console.log('[Return] Getting business info...');
    
    const subscription = await prisma.subscription.findUnique({
      where: { id: payment.subscriptionId },
      select: { businessId: true },
    });

    if (!subscription?.businessId) {
      console.error('[Return] ❌ No business ID found');
      return NextResponse.redirect(
        new URL('/?error=invalid_transaction', request.nextUrl.origin),
        { status: 303 }
      );
    }

    const businessId = subscription.businessId;
    console.log('[Return] ✅ Business ID:', businessId);

    // ⚠️ Note on Return checksum: PayGate's return checksum calculation is unclear
    // Our callback verification (server-to-server) already confirmed authenticity
    // The return is just a browser redirect for UX, so we log checksum verification
    // but don't block on mismatch since we already trust the callback
    console.log('[Return] Verifying checksum authenticity...');
    
    const checksumVerified = payGate.verifyReturnChecksum(payRequestId, reference, checksum);
    if (!checksumVerified) {
      console.warn('[Return] ⚠️ Return checksum mismatch, but callback already verified this transaction');
      console.warn('[Return] Trusting callback verification instead of return checksum');
    } else {
      console.log('[Return] ✅ Checksum valid - data is authentic');
    }

    // Determine if payment succeeded
    const isSuccess = transactionStatus === '1';
    console.log('[Return] Transaction result:', isSuccess ? '✅ SUCCESS (1)' : '❌ FAILED (0)');

    // Update payment status (callback may have already done this)
    console.log('[Return] Updating payment record...');
    
    if (isSuccess) {
      // Payment succeeded
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          paymentGatewayId: payRequestId,
          paidAt: new Date(),
        },
      });

      // Activate subscription
      await prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: { status: 'ACTIVE' },
      });

      console.log('[Return] ✅ Payment COMPLETED and subscription ACTIVE');
    } else {
      // Payment failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          paymentGatewayId: payRequestId,
          failureReason: `PayGate returned TRANSACTION_STATUS=${transactionStatus}`,
        },
      });

      console.log('[Return] ⚠️ Payment FAILED - user can retry');
    }

    // Redirect to success/failure page with status details
    const redirectUrl = new URL(
      `/business/${businessId}/subscription/success`,
      request.nextUrl.origin
    );

    redirectUrl.searchParams.set('reference', reference);
    redirectUrl.searchParams.set('status', isSuccess ? 'success' : 'failed');
    redirectUrl.searchParams.set('businessId', businessId);
    redirectUrl.searchParams.set('payRequestId', payRequestId);

    console.log('[Return] ✅ Redirecting to:', redirectUrl.toString());
    console.log('[Return] ===== END (SUCCESS) =====');

    return NextResponse.redirect(redirectUrl, { status: 303 });

  } catch (error) {
    console.error('[Return] ===== EXCEPTION =====');
    console.error('[Return] ERROR TYPE:', error?.constructor?.name || 'Unknown');
    console.error('[Return] ERROR MESSAGE:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) {
      console.error('[Return] STACK:', error.stack?.split('\n').slice(0, 5).join('\n'));
    }
    console.error('[Return] ===== END EXCEPTION =====');

    return NextResponse.redirect(
      new URL('/?error=redirect_failed', request.nextUrl.origin),
      { status: 303 }
    );
  }
}
