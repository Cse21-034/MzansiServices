/**
 * GET /api/business/my-businesses
 * Get all businesses owned by the current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get all businesses owned by user (not branches)
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: user.id,
        isBranch: false,
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      businesses: businesses.map(b => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        status: b.status,
        verified: b.verified,
        category: b.category.name,
        subscription: b.subscription ? {
          tier: b.subscription.plan.tier,
          status: b.subscription.status,
          plan: {
            name: b.subscription.plan.name,
            monthlyPrice: b.subscription.plan.monthlyPrice,
          },
        } : null,
      })),
    });
  } catch (error) {
    console.error('Get my businesses error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
