/**
 * GET /api/advertising/analytics
 * Get analytics for an ad subscription
 * Query: ?subscriptionId=xxx
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscriptionId required' },
        { status: 400 }
      );
    }

    // Get the subscription
    const subscription = await prisma.advertisingSubscription.findUnique({
      where: { id: subscriptionId },
      include: {
        business: { include: { owner: { select: { email: true } } } },
        analytics: {
          orderBy: { eventDate: 'desc' },
          take: 100,
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (subscription.business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Calculate stats
    const impressions = subscription.impressions || 0;
    const clicks = subscription.clicks || 0;
    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          businessId: subscription.businessId,
          packageId: subscription.packageId,
          adTitle: subscription.adTitle,
          status: subscription.status,
          startDate: subscription.startDate,
          expiryDate: subscription.expiryDate,
        },
        stats: {
          impressions,
          clicks,
          ctr: parseFloat(ctr),
        },
        recentEvents: subscription.analytics,
      },
    });
  } catch (error) {
    console.error('Error fetching ad analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
