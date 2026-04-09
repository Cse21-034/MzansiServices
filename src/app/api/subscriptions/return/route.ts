/**
 * POST /api/subscriptions/return
 * Handles PayGate's RETURN_URL POST redirect after payment
 * This is different from the NOTIFY_URL - this is the user-facing redirect
 */

import { NextRequest, NextResponse } from 'next/server';
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

    console.log('[Return Handler] Received from PayGate:', {
      PAY_REQUEST_ID: data.PAY_REQUEST_ID,
      REFERENCE: data.REFERENCE,
      TRANSACTION_STATUS: data.TRANSACTION_STATUS,
      hasChecksum: !!data.CHECKSUM,
    });

    // ⚠️ Verify checksum to ensure data integrity
    if (!payGate.verifyNotifyChecksum(data)) {
      console.error('[Return Handler] Invalid checksum, data may be tampered with');
      // Still redirect, but without trusting the data
      return NextResponse.redirect(
        new URL('/namibiaservices?error=invalid_checksum', request.nextUrl.origin),
        { status: 303 }
      );
    }

    const reference = data.REFERENCE || '';
    const transactionStatus = data.TRANSACTION_STATUS || '0';
    const payRequestId = data.PAY_REQUEST_ID || '';

    // Determine success based on TRANSACTION_STATUS
    // 1 = Success, 0 = Failed
    const isSuccess = transactionStatus === '1';

    console.log(`[Return Handler] Transaction ${reference}: ${isSuccess ? 'SUCCESS' : 'FAILED'}`);

    // Extract businessId from reference: NS_SUB_{businessId}_{timestamp}
    const referenceParts = reference.split('_');
    const businessId = referenceParts[2] || '';

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
