/**
 * POST /api/subscriptions/process
 * Calculate process.trans redirect params from PAY_REQUEST_ID
 * Receives the response from PayGate's initiate.trans and returns redirect params
 */

import { NextRequest, NextResponse } from 'next/server';
import { payGate } from '@/lib/paygate';

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

    // Calculate checksum for redirect: PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY
    const checksum = payGate.buildProcessChecksum(payRequestId, reference);

    // Return params for process.trans redirect
    return NextResponse.json({
      success: true,
      processUrl: payGate.PROCESS_URL,
      params: {
        PAYGATE_ID: process.env.PAYGATE_MERCHANT_ID,
        PAY_REQUEST_ID: payRequestId,
        CHECKSUM: checksum,
      },
    });
  } catch (error) {
    console.error('Process redirect error:', error);
    return NextResponse.json(
      { message: 'Error processing redirect' },
      { status: 500 }
    );
  }
}
