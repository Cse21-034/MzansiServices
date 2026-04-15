/**
 * POST /api/advertising/track
 * Track ad events (impressions, clicks)
 * 
 * Request body:
 * {
 *   adSubscriptionId: string,
 *   eventType: "impression" | "click",
 *   referrer?: string,
 *   userAgent?: string,
 *   ipAddress?: string,
 *   country?: string,
 *   city?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { adSubscriptionId, eventType, referrer, userAgent, ipAddress, country, city } = data;

    if (!adSubscriptionId || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: adSubscriptionId, eventType' },
        { status: 400 }
      );
    }

    if (!['impression', 'click'].includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid eventType. Use "impression" or "click"' },
        { status: 400 }
      );
    }

    // Record the event
    const analytic = await prisma.adAnalytics.create({
      data: {
        adSubscriptionId,
        eventType,
        referrer: referrer || null,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
        country: country || null,
        city: city || null,
      },
    });

    // Update subscription's impression/click counters
    if (eventType === 'impression') {
      await prisma.advertisingSubscription.update({
        where: { id: adSubscriptionId },
        data: { impressions: { increment: 1 } },
      });
    } else if (eventType === 'click') {
      await prisma.advertisingSubscription.update({
        where: { id: adSubscriptionId },
        data: { clicks: { increment: 1 } },
      });
    }

    return NextResponse.json({
      success: true,
      data: analytic,
    });
  } catch (error) {
    console.error('Error tracking ad event:', error);
    // Don't expose errors to clients tracking ads
    return NextResponse.json(
      { success: true }, // Always return success to avoid retries
      { status: 200 }
    );
  }
}
