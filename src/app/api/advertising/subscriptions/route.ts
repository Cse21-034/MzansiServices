/**
 * GET /api/advertising/subscriptions
 * Get ad subscriptions for a business
 * Query: ?businessId=xxx
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
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId required' },
        { status: 400 }
      );
    }

    // Verify business ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { owner: { select: { email: true } } },
    });

    if (!business || business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get subscriptions with package info
    const subscriptions = await prisma.advertisingSubscription.findMany({
      where: { businessId },
      include: {
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.error('Error fetching ad subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
