/**
 * POST /api/subscriptions/checkout
 * Build and return PayGate checkout params (signed but not submitted)
 * The browser will make the actual initiate.trans call to avoid CloudFront WAF blocking
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { payGate } from '@/lib/paygate';
import { SUBSCRIPTION_TIERS, getYearlyPrice } from '@/lib/subscription-access';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { planTier, businessId, billingCycle = 'MONTHLY' } = await request.json();

    if (!planTier || !businessId) {
      return NextResponse.json(
        { message: 'Missing required fields: planTier, businessId' },
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
        { message: 'Unauthorized: Not the business owner' },
        { status: 403 }
      );
    }

    // Get plan info
    const planKey = planTier as keyof typeof SUBSCRIPTION_TIERS;
    const planInfo = SUBSCRIPTION_TIERS[planKey];

    if (!planInfo) {
      return NextResponse.json(
        { message: 'Invalid plan tier' },
        { status: 400 }
      );
    }

    // Get or create plan in database
    let plan = await prisma.subscriptionPlan.findUnique({
      where: { slug: planKey.toLowerCase() },
    });

    if (!plan) {
      plan = await prisma.subscriptionPlan.create({
        data: {
          name: planInfo.name,
          slug: planKey.toLowerCase(),
          description: planInfo.description,
          monthlyPrice: planInfo.monthlyPrice,
          tier: planInfo.tier,
          features: planInfo.features,
          maxPhotos: planInfo.limits.photos,
          maxPromotions: planInfo.limits.promotions,
          maxBranches: planInfo.limits.branches,
          features_enabled: planInfo.limits,
        },
      });
    }

    // Calculate amount
    const amount = billingCycle === 'YEARLY' 
      ? getYearlyPrice(planInfo.tier)
      : plan.monthlyPrice;

    if (amount === 0) {
      // Free plan - directly create subscription
      const existingSubscription = await prisma.subscription.findUnique({
        where: { businessId },
      });

      if (existingSubscription) {
        await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            planId: plan.id,
            status: 'ACTIVE',
          },
        });
      } else {
        await prisma.subscription.create({
          data: {
            businessId,
            planId: plan.id,
            status: 'ACTIVE',
            billingCycle: billingCycle as any,
          },
        });
      }

      return NextResponse.json({
        success: true,
        free: true,
        message: 'Free plan activated',
        redirectUrl: `/business/${businessId}/subscription`,
      });
    }

    // Create reference for PayGate
    const reference = `NS_SUB_${businessId}_${Date.now()}`;
    const amountInCents = Math.round(amount * 100);

    try {
      // Get the request origin dynamically from headers (works in production)
      const origin = request.headers.get('origin') || request.nextUrl.origin || process.env.NEXTAUTH_URL || 'https://www.namibiaservices.com';
      
      // Build signed params — browser will POST these directly to PayGate
      // This avoids the server-side 403 from PayGate's CloudFront WAF blocking datacenter IPs
      const params = payGate.buildInitiateParams({
        reference,
        amount: amountInCents,
        currency: 'NAD',
        email: business.email,
        returnUrl: `${origin}/api/subscriptions/return`,
        notifyUrl: `${origin}/api/subscriptions/callback`,
      });

      // Save pending subscription record for callback to activate
      const existingSubscription = await prisma.subscription.findUnique({
        where: { businessId },
      });

      let subscription;
      if (existingSubscription) {
        subscription = await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            planId: plan.id,
            status: 'INACTIVE', // Will be activated by callback after payment
            billingCycle: billingCycle as any,
          },
        });
      } else {
        subscription = await prisma.subscription.create({
          data: {
            businessId,
            planId: plan.id,
            status: 'INACTIVE', // Will be activated by callback after payment
            billingCycle: billingCycle as any,
          },
        });
      }

      // Create payment record for callback to find and update
      await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          paymentGatewayId: '', // Will be filled in by callback with TRANSACTION_ID
          amount,
          currency: 'NAD',
          status: 'PENDING',
          transactionRef: reference, // PayGate reference: NS_SUB_${businessId}_${timestamp}
        },
      });

      console.log('[Checkout] Created payment record for reference:', reference);

      return NextResponse.json({
        success: true,
        free: false,
        // Return the params and URLs — browser makes the calls to PayGate
        checkout: {
          initiateUrl: payGate.INITIATE_URL,
          processUrl: payGate.PROCESS_URL,
          params, // signed fields for browser to POST
          reference,
        },
      });
    } catch (paymentError) {
      console.error('PayGate params error:', paymentError);
      const errorMessage = paymentError instanceof Error ? paymentError.message : 'Payment gateway error';
      return NextResponse.json(
        { message: `Failed to build checkout: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Subscription checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { message: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
