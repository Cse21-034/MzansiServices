import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { calculateFeaturedSpaceExpiryDate, FEATURED_HERO_SPACE_PRICING } from '@/lib/subscription-access';
import { payGate } from '@/lib/paygate';

/**
 * GET /api/featured-hero-space
 * Get all active featured hero spaces
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userSpacesOnly = searchParams.get('userSpaces') === 'true';
    const businessId = searchParams.get('businessId');

    if (userSpacesOnly && !businessId) {
      return NextResponse.json(
        { error: 'businessId required for userSpaces query' },
        { status: 400 }
      );
    }

    const now = new Date();

    if (userSpacesOnly) {
      // Get user's featured spaces
      if (!businessId) {
        return NextResponse.json(
          { error: 'businessId required' },
          { status: 400 }
        );
      }

      const spaces = await prisma.featuredHeroSpace.findMany({
        where: { businessId: businessId as string },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: spaces });
    }

    // Get all active spaces for display
    const activeSpaces = await prisma.featuredHeroSpace.findMany({
      where: {
        isActive: true,
        expiryDate: {
          gt: now,
        },
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            website: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: activeSpaces,
    });
  } catch (error) {
    console.error('Error fetching featured hero spaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured spaces' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/featured-hero-space
 * Create/Purchase featured hero space
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { businessId, imageUrl, title, description, linkUrl, billingCycle } = await req.json();

    if (!businessId || !imageUrl || !title || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields: businessId, imageUrl, title, billingCycle' },
        { status: 400 }
      );
    }

    if (!['MONTHLY', 'YEARLY'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Invalid billing cycle. Use MONTHLY or YEARLY' },
        { status: 400 }
      );
    }

    // Verify business ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        owner: {
          select: { email: true },
        },
      },
    });

    if (!business || business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized: Not the business owner' },
        { status: 403 }
      );
    }

    // Check if business already has active featured space
    const now = new Date();
    const activeSpace = await prisma.featuredHeroSpace.findFirst({
      where: {
        businessId,
        isActive: true,
        expiryDate: {
          gt: now,
        },
      },
    });

    if (activeSpace) {
      return NextResponse.json(
        {
          error: 'Business already has an active featured space',
          activeUntil: activeSpace.expiryDate,
        },
        { status: 409 }
      );
    }

    const pricingInfo = FEATURED_HERO_SPACE_PRICING[billingCycle as keyof typeof FEATURED_HERO_SPACE_PRICING];
    const amount = billingCycle === 'YEARLY' ? (pricingInfo as any).yearlyCost : pricingInfo.monthlyPrice;
    const expiryDate = calculateFeaturedSpaceExpiryDate(billingCycle);

    // Create reference for PayGate
    const reference = `FHS_${businessId}_${Date.now()}`;

    // Store pending featured space
    const pendingSpace = await prisma.featuredHeroSpace.create({
      data: {
        businessId,
        imageUrl,
        title,
        description: description || null,
        linkUrl: linkUrl || null,
        billingCycle: billingCycle as any,
        monthlyPrice: pricingInfo.monthlyPrice,
        expiryDate,
        isActive: false, // Will activate after payment
      },
    });

    // Create checkout with browser-side PayGate call
    let params;
    try {
      // Get the request origin dynamically from headers (works in production)
      const origin = req.headers.get('origin') || req.nextUrl.origin || process.env.NEXTAUTH_URL || 'https://www.namibiaservices.com';
      
      // Build signed params — browser will POST these directly to PayGate
      // This avoids the server-side 403 from PayGate's CloudFront WAF blocking datacenter IPs
      params = payGate.buildInitiateParams({
        reference,
        amount: amount * 100, // Convert to cents
        currency: 'ZAR',
        email: business.email,
        returnUrl: `${origin}/business/${businessId}/featured-hero/success?reference=${reference}`,
        notifyUrl: `${origin}/api/featured-hero-space/callback`,
      });
    } catch (paymentError) {
      console.error('PayGate params error:', paymentError);
      const errorMessage = paymentError instanceof Error ? paymentError.message : 'Payment gateway error';
      return NextResponse.json(
        { error: `Failed to build payment params: ${errorMessage}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        spaceId: pendingSpace.id,
        reference,
      },
      checkout: {
        initiateUrl: payGate.INITIATE_URL,
        processUrl: payGate.PROCESS_URL,
        params,
      },
    });
  } catch (error) {
    console.error('Error creating featured hero space:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
