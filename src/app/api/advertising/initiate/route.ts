/**
 * POST /api/advertising/initiate
 * Server proxy for PayGate's initiate.trans endpoint
 * 
 * This ensures the request comes from the user's IP (not server datacenter IP),
 * which bypasses PayGate's CloudFront WAF restrictions.
 * 
 * Response includes PAY_REQUEST_ID which we save to database.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const { params, reference } = await request.json();

    if (!params || !reference) {
      return NextResponse.json(
        { error: 'Missing params or reference' },
        { status: 400 }
      );
    }

    console.log('[AdInitiate] Calling PayGate initiate.trans for reference:', reference);

    // Submit form data to PayGate's initiate.trans endpoint
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const initiateResponse = await fetch(
      'https://secure.paygate.co.za/payweb3/initiate.trans',
      {
        method: 'POST',
        body: formData.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // Use user's IP, not server's datacenter IP
        // This is crucial to bypass PayGate's CloudFront WAF
      }
    );

    const responseText = await initiateResponse.text();
    console.log('[AdInitiate] PayGate response:', responseText);

    // Parse response: "PAYGATE_ID=xxx&PAY_REQUEST_ID=yyy&REFERENCE=zzz&CHECKSUM=..."
    const parseParams = (response: string) => {
      const params: Record<string, string> = {};
      response.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        if (key && value) {
          params[key] = decodeURIComponent(value);
        }
      });
      return params;
    };

    const payGateResponse = parseParams(responseText);
    const payRequestId = payGateResponse.PAY_REQUEST_ID;

    if (!payRequestId) {
      console.error('[AdInitiate] ❌ No PAY_REQUEST_ID from PayGate:', payGateResponse);
      return NextResponse.json(
        { error: 'Failed to get PAY_REQUEST_ID from PayGate' },
        { status: 500 }
      );
    }

    console.log('[AdInitiate] ✅ Got PAY_REQUEST_ID:', payRequestId);

    // Save PAY_REQUEST_ID to database (linked to the payment record)
    try {
      await prisma.adPayment.update({
        where: { transactionRef: reference },
        data: { payRequestId },
      });
      console.log('[AdInitiate] ✅ Saved PAY_REQUEST_ID to database');
    } catch (dbError) {
      console.error('[AdInitiate] Warning: Could not save PAY_REQUEST_ID:', dbError);
      // Continue anyway - payment still initiated
    }

    return NextResponse.json({
      success: true,
      payRequestId,
      reference,
    });
  } catch (error) {
    console.error('[AdInitiate] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
