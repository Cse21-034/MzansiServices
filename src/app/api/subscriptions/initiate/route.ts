/**
 * POST /api/subscriptions/initiate
 * Server-side proxy for PayGate's initiate.trans
 * Handles PAY_REQUEST_ID extraction and saving automatically
 * 
 * This avoids CORS issues with direct POST to PayGate
 * Updated: 2026-04-14 - Fixed FormData parsing
 */

import { NextRequest, NextResponse } from 'next/server';
import { payGate } from '@/lib/paygate';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { params, reference } = await request.json();

    console.log('[Initiate] ===== START =====');
    console.log('[Initiate] Received request for reference:', reference);

    if (!params || !reference) {
      console.error('[Initiate] Missing required fields');
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

    console.log('[Initiate] Submitting to PayGate:', payGate.INITIATE_URL);

    // Submit to PayGate's initiate.trans endpoint
    const response = await fetch(payGate.INITIATE_URL, {
      method: 'POST',
      body: formData,
    });

    console.log('[Initiate] Response status:', response.status);
    
    const responseText = await response.text();
    console.log('[Initiate] Response length:', responseText.length);
    console.log('[Initiate] Response preview:', responseText.substring(0, 200));

    // Extract PAY_REQUEST_ID from response
    let payRequestId: string | null = null;

    // Try URLSearchParams first (PayGate's actual response format)
    try {
      const params = new URLSearchParams(responseText);
      payRequestId = params.get('PAY_REQUEST_ID');
      if (payRequestId) {
        console.log('[Initiate] ✅ Extracted PAY_REQUEST_ID from URLSearchParams:', payRequestId);
      }
    } catch (e) {
      console.warn('[Initiate] Failed to parse as URLSearchParams:', e);
    }

    // If not found, try HTML form field
    if (!payRequestId) {
      const htmlMatch = responseText.match(
        /name=['"]PAY_REQUEST_ID['"][\s\S]*?value=['"]([^'"]+)['"]/i
      );
      if (htmlMatch?.[1]) {
        payRequestId = htmlMatch[1];
        console.log('[Initiate] ✅ Extracted PAY_REQUEST_ID from HTML:', payRequestId);
      }
    }

    // If still not found, try JSON
    if (!payRequestId) {
      try {
        console.log('[Initiate] Trying JSON parse...');
        const jsonResponse = JSON.parse(responseText);
        payRequestId = jsonResponse.PAY_REQUEST_ID;
        console.log('[Initiate] ✅ Extracted PAY_REQUEST_ID from JSON:', payRequestId);
      } catch (e) {
        console.warn('[Initiate] Response is not JSON');
      }
    }

    if (!payRequestId) {
      console.error('[Initiate] ❌ Failed to extract PAY_REQUEST_ID');
      console.error('[Initiate] Full response:', responseText);
      return NextResponse.json({
        success: false,
        message: 'Failed to extract PAY_REQUEST_ID from PayGate',
        debug: {
          responseLength: responseText.length,
          responsePreview: responseText.substring(0, 300),
        }
      }, { status: 400 });
    }

    console.log('[Initiate] Saving PAY_REQUEST_ID to database...');

    // Save PAY_REQUEST_ID to database immediately
    try {
      const payment = await prisma.payment.findUnique({
        where: { transactionRef: reference },
      });

      if (!payment) {
        console.error('[Initiate] ❌ Payment record not found for reference:', reference);
        return NextResponse.json({
          success: false,
          message: 'Payment record not found in database',
        }, { status: 404 });
      }

      console.log('[Initiate] Found payment:', payment.id);

      // Use raw SQL update due to Prisma type generation issue
      await (prisma as any).$executeRaw`
        UPDATE "payments" 
        SET "pay_request_id" = ${payRequestId}, "updated_at" = NOW()
        WHERE "id" = ${payment.id}
      `;

      console.log('[Initiate] SQL update executed, verifying read-back...');

      // ⚠️ CRITICAL: Verify the pay_request_id was actually saved
      const verified = await (prisma as any).$queryRaw`
        SELECT "pay_request_id" 
        FROM "payments" 
        WHERE "id" = ${payment.id}
      `;

      if (!verified || verified.length === 0 || !verified[0].pay_request_id) {
        console.error('[Initiate] ❌ VERIFICATION FAILED: pay_request_id is still NULL after update');
        console.error('[Initiate] Query result:', verified);
        return NextResponse.json({
          success: false,
          message: 'CRITICAL: Failed to persist PAY_REQUEST_ID to database',
          debug: { paymentId: payment.id, payRequestId, queryResult: verified }
        }, { status: 500 });
      }

      console.log('[Initiate] ✅ VERIFIED: pay_request_id successfully saved:', verified[0].pay_request_id);
      console.log('[Initiate] ===== END (SUCCESS) =====');

      return NextResponse.json({
        success: true,
        payRequestId,
        reference,
      });
    } catch (dbError) {
      console.error('[Initiate] ❌ Database error:', dbError);
      console.error('[Initiate] Error details:', dbError instanceof Error ? dbError.message : String(dbError));
      throw dbError;
    }
  } catch (error) {
    console.error('[Initiate] ===== EXCEPTION =====');
    console.error('[Initiate] Error:', error);
    console.error('[Initiate] Error type:', error?.constructor?.name);
    if (error instanceof Error) {
      console.error('[Initiate] Stack:', error.stack?.split('\n').slice(0, 5).join('\n'));
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      message: `Initiate transaction failed: ${message}`,
    }, { status: 500 });
  }
}
