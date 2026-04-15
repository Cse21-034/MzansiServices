/**
 * POST /api/advertising/process
 * 
 * Calculate checksum for PayGate's process.trans endpoint
 * Called after initiate.trans returns PAY_REQUEST_ID
 * 
 * Checksum = MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { payGate } from '@/lib/paygate';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { payRequestId, reference } = await request.json();

    if (!payRequestId || !reference) {
      return NextResponse.json(
        { error: 'Missing payRequestId or reference' },
        { status: 400 }
      );
    }

    console.log('[AdProcess] Building checksum for PAY_REQUEST_ID:', payRequestId);

    // Build process.trans URL and checksum
    const checksum = payGate.buildProcessChecksum(payRequestId, reference);

    const processUrl = new URL('https://secure.paygate.co.za/payweb3/process.trans');
    processUrl.searchParams.append('PAYGATE_ID', payGate['config']?.merchantId || process.env.PAYGATE_MERCHANT_ID || '');
    processUrl.searchParams.append('PAY_REQUEST_ID', payRequestId);
    processUrl.searchParams.append('REFERENCE', reference);
    processUrl.searchParams.append('CHECKSUM', checksum);

    console.log('[AdProcess] ✅ Built process URL with checksum');

    return NextResponse.json({
      success: true,
      processUrl: 'https://secure.paygate.co.za/payweb3/process.trans',
      params: {
        PAYGATE_ID: process.env.PAYGATE_MERCHANT_ID || '10011072130',
        PAY_REQUEST_ID: payRequestId,
        REFERENCE: reference,
        CHECKSUM: checksum,
      },
    });
  } catch (error) {
    console.error('[AdProcess] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
