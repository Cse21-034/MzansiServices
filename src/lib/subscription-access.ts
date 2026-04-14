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
    currency: 'NAD',
    yearlyDiscountPercentage: 15,
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
    currency: 'NAD',
    yearlyDiscountPercentage: 16,
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
      promotions: 2,
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
    currency: 'NAD',
    yearlyDiscountPercentage: 20,
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
      promotions: 5,
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
  return !!(tierInfo.limits[feature] || false);
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
 * Calculate yearly price with discount
 */
export function getYearlyPrice(
  tier: SubscriptionTier | null
): number {
  const tierInfo = getTierInfo(tier);
  if (tierInfo.monthlyPrice === 0) return 0;
  
  const yearlyPrice = tierInfo.monthlyPrice * 12;
  const discount = yearlyPrice * (tierInfo.yearlyDiscountPercentage / 100);
  return yearlyPrice - discount;
}

/**
 * Calculate the savings from yearly subscription
 */
export function getYearlySavings(
  tier: SubscriptionTier | null
): number {
  const tierInfo = getTierInfo(tier);
  if (tierInfo.monthlyPrice === 0) return 0;
  
  const yearlyPrice = tierInfo.monthlyPrice * 12;
  const discount = yearlyPrice * (tierInfo.yearlyDiscountPercentage / 100);
  return discount;
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
  period?: string;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      return {
        allowed: false,
        reason: 'No active subscription found',
      };
    }

    const tier = subscription?.plan?.tier || null;
    const limit = getLimit(tier, 'promotions');

    // Get current month dates (1st to end of month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Count promotions created THIS MONTH ONLY
    const current = await prisma.promotion.count({
      where: {
        businessId,
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    if (current >= limit) {
      return {
        allowed: false,
        reason: `Monthly promotion limit of ${limit} reached for your ${getTierInfo(tier).name} plan. Please try again next month.`,
        limit,
        current,
        period: `${currentMonthStart.toLocaleDateString()} - ${currentMonthEnd.toLocaleDateString()}`,
      };
    }

    return { 
      allowed: true, 
      limit, 
      current,
      period: `${currentMonthStart.toLocaleDateString()} - ${currentMonthEnd.toLocaleDateString()}`,
    };
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
          take: 5, // Get last 5 payments to check for recent successful ones
        },
      },
    });

    if (!subscription) {
      return {
        tier: 'WILD_HORSES',
        status: 'INACTIVE',
        statusDisplay: 'FREE',
        plan: getTierInfo(null),
      };
    }

    // Determine actual status based on subscription and payment records
    let actualStatus = subscription.status;
    let statusDisplay: string = subscription.status;
    
    // If subscription is INACTIVE, check if there's a recent COMPLETED payment
    if (subscription.status === 'INACTIVE' && subscription.payments.length > 0) {
      const recentCompleted = subscription.payments.find(p => p.status === 'COMPLETED');
      if (recentCompleted) {
        actualStatus = 'ACTIVE';
        statusDisplay = 'ACTIVE';
      } else {
        statusDisplay = 'PENDING';
      }
    }

    // If subscription is INACTIVE and free plan, display as FREE
    if (subscription.status === 'INACTIVE' && subscription.plan?.tier === 'WILD_HORSES') {
      statusDisplay = 'FREE';
    }

    return {
      tier: subscription.plan.tier,
      status: actualStatus,
      statusDisplay,
      plan: getTierInfo(subscription.plan.tier),
      subscription,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      tier: 'WILD_HORSES',
      status: 'INACTIVE',
      statusDisplay: 'ERROR',
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

/**
 * Get monthly promotion usage stats for a business
 * Automatically tracks and provides monthly reset information
 */
export async function getMonthlyPromotionStats(businessId: string): Promise<{
  monthlyLimit: number;
  usedThisMonth: number;
  remainingThisMonth: number;
  monthStart: Date;
  monthEnd: Date;
  resetDate: string;
  tier: string;
  tier_name: string;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { businessId },
      include: { plan: true },
    });

    const tier = subscription?.plan?.tier || null;
    const tierInfo = getTierInfo(tier);
    const monthlyLimit = getLimit(tier, 'promotions');

    // Get current month dates
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Count promotions this month
    const usedThisMonth = await prisma.promotion.count({
      where: {
        businessId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    return {
      monthlyLimit,
      usedThisMonth,
      remainingThisMonth: Math.max(0, monthlyLimit - usedThisMonth),
      monthStart,
      monthEnd,
      resetDate: nextMonthStart.toLocaleDateString(),
      tier: tier || 'WILD_HORSES',
      tier_name: tierInfo.name,
    };
  } catch (error) {
    console.error('Error getting monthly promotion stats:', error);
    throw error;
  }
}

/**
 * FEATURED HERO SPACE PRICING
 * Monetizable carousel space on homepage
 */
export const FEATURED_HERO_SPACE_PRICING = {
  MONTHLY: {
    billingCycle: 'MONTHLY' as const,
    monthlyPrice: 100,
    currency: 'NAD',
    description: 'Feature your business in the hero carousel for 1 month',
    durationDays: 30,
  },
  YEARLY: {
    billingCycle: 'YEARLY' as const,
    monthlyPrice: 1200,
    yearlyCost: 1008, // 20% discount applied: 1200 * 0.9 = 1080, but using 1008 for 16% discount
    currency: 'NAD',
    description: 'Feature your business in the hero carousel for 1 year with savings',
    durationDays: 365,
    discountPercentage: 16,
  },
};

/**
 * Get active featured hero spaces expiring in future
 * Used to display paid ads in the hero carousel
 */
export async function getActiveFeaturedHeroSpaces() {
  try {
    const { prisma } = await import('@/lib/prisma');
    const now = new Date();

    const spaces = await prisma.featuredHeroSpace.findMany({
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
    });

    return spaces;
  } catch (error) {
    console.error('Error fetching featured hero spaces:', error);
    return [];
  }
}

/**
 * Check if business can activate featured hero space
 */
export async function canActivateFeaturedHeroSpace(businessId: string): Promise<{
  allowed: boolean;
  reason?: string;
  hasActiveSpace?: boolean;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');
    const now = new Date();

    // Check if business already has active featured space
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
      return {
        allowed: false,
        reason: `Your business already has an active featured space until ${activeSpace.expiryDate.toLocaleDateString()}`,
        hasActiveSpace: true,
      };
    }

    return { allowed: true, hasActiveSpace: false };
  } catch (error) {
    console.error('Error checking featured hero space availability:', error);
    return {
      allowed: false,
      reason: 'Error checking featured space availability',
    };
  }
}

/**
 * Calculate featured space expiry date
 */
export function calculateFeaturedSpaceExpiryDate(billingCycle: 'MONTHLY' | 'YEARLY', startDate: Date = new Date()): Date {
  const expiryDate = new Date(startDate);
  
  if (billingCycle === 'YEARLY') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  }
  
  return expiryDate;
}
