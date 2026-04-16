import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { payGate } from '@/lib/paygate';

/**
 * POST /api/featured-hero-space/callback
 * Handle PayGate payment callback for featured hero spaces
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Process payment notification with PayGate
    const verification = await payGate.processNotification(body);

    if (!verification.success) {
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    const reference = verification.reference;
    
    // Extract custom data from the request
    const customDataStr = body.CUSTOM_DATA || body.customData;
    let customData = null;
    
    if (customDataStr) {
      try {
        customData = typeof customDataStr === 'string' ? JSON.parse(customDataStr) : customDataStr;
      } catch (e) {
        console.warn('Could not parse custom data:', customDataStr);
      }
    }

    const spaceId = customData?.spaceId;

    if (!spaceId) {
      return NextResponse.json({
        success: false,
        message: 'Missing space ID in payment data',
      });
    }

    // Activate the featured space
    const activatedSpace = await prisma.featuredHeroSpace.update({
      where: { id: spaceId },
      data: {
        isActive: true,
        startDate: new Date(),
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        subscriptionId: 'featured_space', // You might want to track this differently
        paymentGatewayId: reference,
        amount: (body.AMOUNT ? parseInt(body.AMOUNT) : 0) / 100,
        currency: body.CURRENCY || 'ZAR',
        status: 'COMPLETED',
        transactionRef: body.TRANSACTION_ID || reference,
        paidAt: new Date(),
      },
    });

    console.log(`✅ Featured space activated: ${spaceId}`);

    return NextResponse.json({
      success: true,
      message: 'Featured space activated successfully',
      spaceId,
    });
  } catch (error) {
    console.error('Error processing featured space payment:', error);
    return NextResponse.json({
      success: false,
      message: 'Payment processing error',
    });
  }
}
