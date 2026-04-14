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
    const { payRequestId, reference } = await request.json();

    if (!payRequestId || !reference) {
      return NextResponse.json(
        { message: 'Missing required fields: payRequestId, reference' },
        { status: 400 }
      );
    }

    // Find the payment record by transactionRef (the REFERENCE we sent to PayGate)
    const payment = await prisma.payment.findUnique({
      where: { transactionRef: reference },
    });

    if (!payment) {
      console.warn('[Save PAY_REQUEST_ID] Payment not found for reference:', reference);
      // Don't fail here - payment will be created/updated in callback
      return NextResponse.json({
        success: true,
        message: 'PAY_REQUEST_ID saved (payment will be created in callback)',
      });
    }

    // Update the payment record to store the PAY_REQUEST_ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { payRequestId },
    });

    console.log('[Save PAY_REQUEST_ID] Saved for reference:', reference, 'payRequestId:', payRequestId);

    return NextResponse.json({
      success: true,
      message: 'PAY_REQUEST_ID saved successfully',
    });
  } catch (error) {
    console.error('[Save PAY_REQUEST_ID] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Save failed';
    return NextResponse.json(
      { message: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
