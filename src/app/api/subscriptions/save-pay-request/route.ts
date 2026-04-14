/**
 * POST /api/subscriptions/save-pay-request
 * Save the PAY_REQUEST_ID from PayGate initiate.trans response
 * Called by browser after it receives the response from PayGate's initiate.trans
 * This allows us to map PAY_REQUEST_ID back to the transaction REFERENCE for later verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[Save PAY_REQUEST_ID] ===== START =====');
    
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[Save PAY_REQUEST_ID] ❌ Failed to parse JSON:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { payRequestId, reference } = body;
    console.log('[Save PAY_REQUEST_ID] Received:', { payRequestId, reference });

    if (!payRequestId || !reference) {
      console.error('[Save PAY_REQUEST_ID] ❌ Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Missing required fields: payRequestId, reference' },
        { status: 400 }
      );
    }

    // Find the payment record by transactionRef (the REFERENCE we sent to PayGate)
    console.log('[Save PAY_REQUEST_ID] Looking up payment record with transactionRef:', reference);
    
    const payment = await prisma.payment.findUnique({
      where: { transactionRef: reference },
    });

    if (!payment) {
      console.error('[Save PAY_REQUEST_ID] ❌ Payment not found for reference:', reference);
      return NextResponse.json({
        success: false,
        message: 'Payment record not found',
      }, { status: 404 });
    }

    console.log('[Save PAY_REQUEST_ID] ✅ Found payment:', payment.id);

    // Update using raw SQL to avoid TypeScript type issues
    console.log('[Save PAY_REQUEST_ID] Updating payment record with raw SQL...');
    
    await (prisma as any).$executeRaw`
      UPDATE "payments" 
      SET "pay_request_id" = ${payRequestId}, "updated_at" = NOW()
      WHERE "id" = ${payment.id}
    `;
    
    console.log('[Save PAY_REQUEST_ID] ✅ Successfully updated payment');
    console.log('[Save PAY_REQUEST_ID] Updated:', {
      paymentId: payment.id,
      payRequestId,
    });

    return NextResponse.json({
      success: true,
      message: 'PAY_REQUEST_ID saved successfully',
      paymentId: payment.id,
      payRequestId,
    });
  } catch (error) {
    console.error('[Save PAY_REQUEST_ID] ===== ERROR =====');
    console.error('[Save PAY_REQUEST_ID] ❌ Exception:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
