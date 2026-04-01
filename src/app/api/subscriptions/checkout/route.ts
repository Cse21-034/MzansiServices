/**
 * POST /api/subscriptions/checkout
 * Initiate a PayGate checkout session for subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { payGate } from '@/lib/paygate';
import { SUBSCRIPTION_TIERS, getTierInfo, getYearlyPrice } from '@/lib/subscription-access';
import { authOptions } from '@/lib/auth';

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
        message: 'Free plan activated',
        subscriptionUrl: `/business/${businessId}/subscription`,
      });
    }

    // Create reference for PayGate
    const reference = `NS_SUB_${businessId}_${Date.now()}`;

    try {
      // Return checkout details
      const checkoutData = await payGate.createCheckout({
        reference,
        amount: amount * 100, // Convert to cents
        currency: 'NAD',
        email: business.email,
        description: `${planInfo.name} Subscription - ${business.name}`,
        returnUrl: `${process.env.NEXTAUTH_URL}/business/${businessId}/subscription/success`,
        notifyUrl: `${process.env.NEXTAUTH_URL}/api/subscriptions/callback`,
        customData: {
          businessId,
          planId: plan.id,
          billingCycle,
        },
      });

      return NextResponse.json({
        success: true,
        checkout: {
          redirectUrl: checkoutData.redirect,
          payRequestId: checkoutData.payRequestId,
          checksum: checkoutData.checksum,
          reference,
          sessionId: checkoutData.sessionId,
        },
      });
    } catch (paymentError) {
      console.error('PayGate checkout error:', paymentError);
      const errorMessage = paymentError instanceof Error ? paymentError.message : 'Payment gateway error';
      return NextResponse.json(
        { message: `Failed to initiate payment: ${errorMessage}` },
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
