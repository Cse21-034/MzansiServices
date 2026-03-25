/**
 * Subscription Access Middleware
 * Checks if a business has access to specific features
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getLimit, hasFeature, getTierInfo } from '@/lib/subscription-access';
import { SubscriptionTier } from '@prisma/client';

/**
 * Verify business has access to feature
 */
export async function verifyFeatureAccess(
  businessId: string,
  feature: string
): Promise<{
  allowed: boolean;
  tier?: SubscriptionTier;
  reason?: string;
}> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: { plan: true },
    });

    const tier = subscription?.plan?.tier || null;

    // Check if tier is active
    if (subscription && subscription.status !== 'ACTIVE') {
      return {
        allowed: false,
        reason: `Subscription is ${subscription.status.toLowerCase()}`,
      };
    }

    // Check if feature is available
    if (!hasFeature(tier, feature as any)) {
      return {
        allowed: false,
        tier: tier || undefined,
        reason: `Feature not available in ${getTierInfo(tier).name} plan`,
      };
    }

    return {
      allowed: true,
      tier: tier || undefined,
    };
  } catch (error) {
    console.error('Feature access verification error:', error);
    return {
      allowed: false,
      reason: 'Error verifying access',
    };
  }
}

/**
 * Middleware for feature access routes
 */
export async function featureAccessMiddleware(
  businessId: string,
  feature: string,
  request: NextRequest
) {
  const access = await verifyFeatureAccess(businessId, feature);

  if (!access.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: access.reason || 'Feature not available in your plan',
        upgradeTier: getTierInfo(access.tier ?? null).name,
      },
      { status: 403 }
    );
  }

  return null; // Allow request to continue
}

/**
 * Check subscription validity and limits
 */
export async function checkSubscriptionLimits(
  businessId: string,
  limitType: string
): Promise<{
  withinLimit: boolean;
  current: number;
  limit: number;
  tier: SubscriptionTier | null;
}> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: { plan: true },
    });

    const tier = subscription?.plan?.tier || null;
    const limit = getLimit(tier, limitType as any);

    let current = 0;

    // Count based on limit type
    switch (limitType) {
      case 'photos':
        current = await prisma.businessPhoto.count({
          where: { businessId },
        });
        break;
      case 'promotions':
        current = await prisma.promotion.count({
          where: { businessId },
        });
        break;
      case 'branches':
        current = await prisma.business.count({
          where: {
            parentBusinessId: businessId,
            isBranch: true,
          },
        });
        break;
      default:
        return {
          withinLimit: true,
          current: 0,
          limit: 0,
          tier: null,
        };
    }

    return {
      withinLimit: current < limit,
      current,
      limit,
      tier: tier || null,
    };
  } catch (error) {
    console.error('Check subscription limits error:', error);
    return {
      withinLimit: false,
      current: 0,
      limit: 0,
      tier: null,
    };
  }
}

/**
 * Enforce subscription limit for request
 */
export async function enforceLimit(
  businessId: string,
  limitType: string,
  request: NextRequest
) {
  const check = await checkSubscriptionLimits(businessId, limitType);

  if (!check.withinLimit) {
    return NextResponse.json(
      {
        success: false,
        message: `${limitType} limit reached for your subscription`,
        current: check.current,
        limit: check.limit,
        tier: getTierInfo(check.tier).name,
      },
      { status: 429 }
    );
  }

  return null;
}
