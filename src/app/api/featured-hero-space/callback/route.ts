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

    // Verify payment with PayGate
    const verification = payGate.verifyPayment(body);

    if (!verification.success) {
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    const { customData, transactionId } = verification;
    const { spaceId } = customData;

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
        paymentGatewayId: transactionId,
        amount: verification.amount / 100,
        currency: 'NAD',
        status: 'COMPLETED',
        transactionRef: transactionId,
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
