/**
 * POST /api/subscriptions/initiate
 * Server-side proxy for PayGate's initiate.trans
 * Handles PAY_REQUEST_ID extraction and saving automatically
 * 
 * This avoids CORS issues with direct POST to PayGate
 */

import { NextRequest, NextResponse } from 'next/server';
import { payGate } from '@/lib/paygate';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { params, reference } = await request.json();

    console.log('[Initiate] Received request for reference:', reference);

    if (!params || !reference) {
      return NextResponse.json(
        { success: false, message: 'Missing params or reference' },
        { status: 400 }
      );
    }

    // Build FormData for PayGate
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    console.log('[Initiate] Submitting to PayGate initiate.trans');

    // Submit to PayGate's initiate.trans endpoint
    const response = await fetch(payGate.INITIATE_URL, {
      method: 'POST',
      body: formData,
    });

    const html = await response.text();
    console.log('[Initiate] Received response, length:', html.length);

    // Extract PAY_REQUEST_ID from response
    let payRequestId: string | null = null;

    // Try HTML form field first
    const htmlMatch = html.match(
      /name=['"]PAY_REQUEST_ID['"][\s\S]*?value=['"]([^'"]+)['"]/i
    );
    if (htmlMatch?.[1]) {
      payRequestId = htmlMatch[1];
      console.log('[Initiate] Extracted PAY_REQUEST_ID from HTML:', payRequestId);
    } else {
      // Try JSON response
      try {
        const jsonResponse = JSON.parse(html);
        payRequestId = jsonResponse.PAY_REQUEST_ID;
        console.log('[Initiate] Extracted PAY_REQUEST_ID from JSON:', payRequestId);
      } catch (e) {
        console.log('[Initiate] Response is neither HTML nor JSON');
      }
    }

    if (!payRequestId) {
      console.error('[Initiate] Failed to extract PAY_REQUEST_ID');
      console.error('[Initiate] Response excerpt:', html.substring(0, 500));
      return NextResponse.json({
        success: false,
        message: 'Failed to extract PAY_REQUEST_ID from PayGate',
      }, { status: 400 });
    }

    console.log('[Initiate] Saving PAY_REQUEST_ID to database');

    // Save PAY_REQUEST_ID to database immediately
    try {
      const payment = await prisma.payment.findUnique({
        where: { transactionRef: reference },
      });

      if (!payment) {
        console.error('[Initiate] Payment record not found for reference:', reference);
        return NextResponse.json({
          success: false,
          message: 'Payment record not found in database',
        }, { status: 404 });
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: { payRequestId },
      });

      console.log('[Initiate] Successfully saved PAY_REQUEST_ID');

      return NextResponse.json({
        success: true,
        payRequestId,
        reference,
      });
    } catch (dbError) {
      console.error('[Initiate] Database error:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('[Initiate] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      message: `Initiate transaction failed: ${message}`,
    }, { status: 500 });
  }
}
