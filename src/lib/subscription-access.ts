/**
 * Subscription Access Control Utilities
 * Manages feature access based on subscription tier
 */

import { SubscriptionTier } from '@prisma/client';

export const SUBSCRIPTION_TIERS = {
  WILD_HORSES: {
    name: 'WILD HORSES',
    tier: 'WILD_HORSES' as SubscriptionTier,
    monthlyPrice: 0,
    description: 'Establish your business presence quickly.',
    features: [
      'Free business listing',
      'Business profile',
      'Appears in searches',
    ],
    limits: {
      photos: 1,
      promotions: 0,
      branches: 1,
      reviewsDisplay: true,
      socialMediaLinks: false,
      videoIntro: false,
      whatsappChatbot: false,
      featuredBadge: false,
      enhancedProfile: false,
      expandedGallery: false,
      dedicatedSupport: false,
      topSearchPlacement: false,
    },
  },
  DESERT_ELEPHANTS: {
    name: 'DESERT ELEPHANTS',
    tier: 'DESERT_ELEPHANTS' as SubscriptionTier,
    monthlyPrice: 100,
    currency: 'BWP',
    description: 'Boost visibility and build customer trust.',
    features: [
      'Enhanced business profile',
      'Photo uploads',
      'Higher search ranking',
      'Customer reviews display',
      'Promotions and updates board',
      'Social media links',
      'Priority support',
    ],
    limits: {
      photos: 10,
      promotions: 5,
      branches: 1,
      reviewsDisplay: true,
      socialMediaLinks: true,
      videoIntro: false,
      whatsappChatbot: false,
      featuredBadge: false,
      enhancedProfile: true,
      expandedGallery: true,
      dedicatedSupport: false,
      topSearchPlacement: false,
    },
  },
  DESERT_LIONS: {
    name: 'DESERT LIONS',
    tier: 'DESERT_LIONS' as SubscriptionTier,
    monthlyPrice: 200,
    currency: 'BWP',
    description: 'Unlock powerful tools for rapid growth.',
    features: [
      'Top search placement',
      'Featured business badge',
      'Video introduction',
      'Expanded photo gallery',
      'Multiple branch listings',
      'WhatsApp chatbot',
      'Dedicated support',
    ],
    limits: {
      photos: 50,
      promotions: 20,
      branches: 5,
      reviewsDisplay: true,
      socialMediaLinks: true,
      videoIntro: true,
      whatsappChatbot: true,
      featuredBadge: true,
      enhancedProfile: true,
      expandedGallery: true,
      dedicatedSupport: true,
      topSearchPlacement: true,
    },
  },
};

export type SubscriptionLimits = typeof SUBSCRIPTION_TIERS.WILD_HORSES.limits;

/**
 * Get tier info by tier name
 */
export function getTierInfo(tier: SubscriptionTier | null) {
  if (!tier) {
    return SUBSCRIPTION_TIERS.WILD_HORSES;
  }

  const tierKey = tier as keyof typeof SUBSCRIPTION_TIERS;
  return SUBSCRIPTION_TIERS[tierKey] || SUBSCRIPTION_TIERS.WILD_HORSES;
}

/**
 * Get all available tiers
 */
export function getAllTiers() {
  return Object.values(SUBSCRIPTION_TIERS);
}

/**
 * Check if feature is available for tier
 */
export function hasFeature(
  tier: SubscriptionTier | null,
  feature: keyof SubscriptionLimits
): boolean {
  const tierInfo = getTierInfo(tier);
  return tierInfo.limits[feature] || false;
}

/**
 * Get limit for feature
 */
export function getLimit(
  tier: SubscriptionTier | null,
  limitKey: keyof SubscriptionLimits
): any {
  const tierInfo = getTierInfo(tier);
  return tierInfo.limits[limitKey];
}

/**
 * Check if business can upload more photos
 */
export async function canUploadPhoto(
  businessId: string,
  currentPhotoCount: number
): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        plan: true,
      },
    });

    const tier = subscription?.plan?.tier || null;
    const limit = getLimit(tier, 'photos');

    if (currentPhotoCount >= limit) {
      return {
        allowed: false,
        reason: `Photo limit of ${limit} reached for your ${getTierInfo(tier).name} plan`,
        limit,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking photo upload permission:', error);
    return {
      allowed: false,
      reason: 'Error checking subscription limits',
    };
  }
}

/**
 * Check if business can create more promotions
 */
export async function canCreatePromotion(businessId: string): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        plan: true,
      },
    });

    const tier = subscription?.plan?.tier || null;
    const limit = getLimit(tier, 'promotions');

    // Count existing promotions
    const current = await prisma.promotion.count({
      where: { businessId },
    });

    if (current >= limit) {
      return {
        allowed: false,
        reason: `Promotion limit of ${limit} reached for your ${getTierInfo(tier).name} plan`,
        limit,
        current,
      };
    }

    return { allowed: true, limit, current };
  } catch (error) {
    console.error('Error checking promotion creation permission:', error);
    return {
      allowed: false,
      reason: 'Error checking subscription limits',
    };
  }
}

/**
 * Check if business can add more branches
 */
export async function canAddBranch(businessId: string): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        plan: true,
      },
    });

    const tier = subscription?.plan?.tier || null;
    const limit = getLimit(tier, 'branches');

    // Count existing branches
    const current = await prisma.business.count({
      where: {
        parentBusinessId: businessId,
        isBranch: true,
      },
    });

    if (current >= limit) {
      return {
        allowed: false,
        reason: `Branch limit of ${limit} reached for your ${getTierInfo(tier).name} plan`,
        limit,
        current,
      };
    }

    return { allowed: true, limit, current };
  } catch (error) {
    console.error('Error checking branch creation permission:', error);
    return {
      allowed: false,
      reason: 'Error checking subscription limits',
    };
  }
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus(businessId: string) {
  try {
    const { prisma } = await import('@/lib/prisma');

    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        plan: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!subscription) {
      return {
        tier: 'WILD_HORSES',
        status: 'free',
        plan: getTierInfo(null),
      };
    }

    return {
      tier: subscription.plan.tier,
      status: subscription.status,
      plan: getTierInfo(subscription.plan.tier),
      subscription,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      tier: 'WILD_HORSES',
      status: 'error',
      plan: getTierInfo(null),
    };
  }
}

/**
 * Format subscription display info
 */
export function formatSubscriptionDisplay(tier: SubscriptionTier | null) {
  const tierInfo = getTierInfo(tier);
  return {
    name: tierInfo.name,
    price:
      tierInfo.monthlyPrice === 0
        ? 'FREE'
        : `${tierInfo.currency} ${tierInfo.monthlyPrice}/month`,
    features: tierInfo.features,
    limits: tierInfo.limits,
  };
}
