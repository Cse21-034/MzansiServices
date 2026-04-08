/**
 * GET /api/subscriptions/status?businessId=xxx
 * Get subscription status for a business
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { getSubscriptionStatus, getTierInfo } from '@/lib/subscription-access';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { message: 'Missing businessId' },
        { status: 400 }
      );
    }

    // Verify ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true, subscriptionId: true },
    });

    if (!business) {
      return NextResponse.json(
        { message: 'Business not found' },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (business.ownerId !== user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get subscription details
    const statusInfo = await getSubscriptionStatus(businessId);

    return NextResponse.json({
      success: true,
      subscription: statusInfo,
      business: {
        id: businessId,
        subscriptionId: business.subscriptionId,
      },
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
