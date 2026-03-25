/**
 * GET /api/user/businesses
 * Get all businesses owned by the authenticated user
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

    // Get businesses owned by user
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: user.id,
        isBranch: false, // Only get main businesses, not branches
      },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        phone: true,
        city: true,
        status: true,
        subscriptionId: true,
        subscription: {
          select: {
            id: true,
            status: true,
            planId: true,
            plan: {
              select: {
                tier: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      businesses,
      count: businesses.length,
    });
  } catch (error) {
    console.error('Get businesses error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/businesses
 * Create a new business for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, phone, city, categoryId, description } =
      await request.json();

    if (!name || !email || !phone || !city || !categoryId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
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

    // Generate slug
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // Create business
    const business = await prisma.business.create({
      data: {
        name,
        slug,
        email,
        phone,
        city,
        categoryId,
        description: description || '',
        ownerId: user.id,
        status: 'DRAFT',
      },
    });

    // Auto-subscribe to free WILD_HORSES plan
    const freePlan = await prisma.subscriptionPlan.findUnique({
      where: { slug: 'wild_horses' },
    });

    if (freePlan) {
      await prisma.subscription.create({
        data: {
          businessId: business.id,
          planId: freePlan.id,
          status: 'ACTIVE',
        },
      });
    }

    return NextResponse.json({
      success: true,
      business,
      message: 'Business created successfully',
    });
  } catch (error) {
    console.error('Create business error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
