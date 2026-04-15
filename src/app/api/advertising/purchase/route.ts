/**
 * POST /api/advertising/purchase
 * Create/Purchase advertising subscription with PayGate payment
 * 
 * Request body:
 * {
 *   businessId: string,
 *   packageId: string, // e.g., "advert1", "advert2"
 *   adTitle: string,
 *   adImageUrl: string,
 *   destinationUrl: string,
 *   billingCycle: "MONTHLY" | "YEARLY"
 * }
 * 
 * Response includes checkout params for PayGate integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { payGate } from '@/lib/paygate';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      businessId, 
      packageId, 
      adTitle, 
      adImageUrl, 
      destinationUrl, 
      billingCycle 
    } = await request.json();

    // Validate required fields
    if (!businessId || !packageId || !adTitle || !adImageUrl || !destinationUrl || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        owner: { select: { email: true } },
      },
    });

    if (!business || business.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized: Not the business owner' },
        { status: 403 }
      );
    }

    // Get the advertisement package
    const pkg = await prisma.advertisementPackage.findUnique({
      where: { packageId },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: 'Advertisement package not found' },
        { status: 404 }
      );
    }

    // Calculate pricing based on billing cycle
    let monthlyPrice = pkg.monthlyPrice;
    let yearlyPrice = pkg.yearlyPrice || pkg.monthlyPrice * 12;
    const amount = billingCycle === 'YEARLY' ? yearlyPrice : monthlyPrice;

    // Calculate expiry date
    const now = new Date();
    const expiryDate = new Date(now);
    if (billingCycle === 'YEARLY') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Calculate next billing date (same as expiry for now)
    const nextBillingDate = new Date(expiryDate);

    // Create transaction reference
    const reference = `AD_${businessId}_${packageId}_${Date.now()}`;

    // Create advertising subscription record (initially PENDING payment)
    const adSubscription = await prisma.advertisingSubscription.create({
      data: {
        businessId,
        packageId,
        adTitle,
        adImageUrl,
        destinationUrl,
        billingCycle: billingCycle as any,
        monthlyPrice,
        yearlyPrice,
        startDate: now,
        expiryDate,
        nextBillingDate,
        status: 'ACTIVE', // Will remain ACTIVE (payment status tracked separately)
        autoRenew: true,
      },
    });

    // Create AdPayment record to track the transaction
    const adPayment = await prisma.adPayment.create({
      data: {
        adSubscriptionId: adSubscription.id,
        amount,
        currency: 'NAD',
        billingCycle: billingCycle as any,
        paymentGatewayId: reference,
        transactionRef: reference,
        status: 'PENDING',
        paymentMethod: 'PayGate',
      },
    });

    // Build PayGate params for browser to submit directly
    const origin = request.headers.get('origin') || request.nextUrl.origin || process.env.NEXTAUTH_URL || 'https://namibiaservices.com';

    try {
      const params = payGate.buildInitiateParams({
        reference,
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'NAD',
        email: business.email,
        returnUrl: `${origin}/business/${businessId}/ads/success?reference=${reference}&adId=${adSubscription.id}`,
        notifyUrl: `${origin}/api/advertising/callback`,
      });

      return NextResponse.json({
        success: true,
        data: {
          subscriptionId: adSubscription.id,
          reference,
          amount,
          billingCycle,
        },
        checkout: {
          initiateUrl: payGate.INITIATE_URL,
          processUrl: payGate.PROCESS_URL,
          params,
        },
      });
    } catch (paymentError) {
      console.error('PayGate params error:', paymentError);
      const errorMessage = paymentError instanceof Error ? paymentError.message : 'Payment gateway error';
      return NextResponse.json(
        { error: `Failed to build payment params: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating advertising subscription:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
