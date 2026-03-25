'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTierInfo } from '@/lib/subscription-access';
import { SubscriptionTier } from '@prisma/client';

interface SubscriptionWidgetProps {
  businessId: string;
  businessName?: string;
  compact?: boolean;
}

const SubscriptionWidget: React.FC<SubscriptionWidgetProps> = ({
  businessId,
  businessName = 'Your Business',
  compact = false,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, [businessId]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch(
        `/api/subscriptions/status?businessId=${businessId}`
      );
      const data = await response.json();
      if (data.success) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  const tierInfo = getTierInfo(subscription?.tier || null);
  const isPremium = subscription?.tier === 'DESERT_LIONS';
  const isStandard = subscription?.tier === 'DESERT_ELEPHANTS';
  const isFree = !subscription?.tier || subscription?.tier === 'WILD_HORSES';

  if (compact) {
    return (
      <div className={`p-4 rounded-lg border-2 ${
        isPremium
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20'
          : isStandard
          ? 'border-burgundy-300 dark:border-burgundy-700 bg-burgundy-50 dark:bg-burgundy-900 dark:bg-opacity-20'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {tierInfo.name}
            </p>
            {subscription?.tier !== 'WILD_HORSES' && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                P{tierInfo.monthlyPrice}/month
              </p>
            )}
          </div>
          <Link
            href={`/business/${businessId}/subscription/plans`}
            className="inline-flex items-center gap-1 px-4 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Upgrade →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className={`px-6 py-6 ${
        isPremium
          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
          : isStandard
          ? 'bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white'
          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {
                subscription?.tier === 'WILD_HORSES' && '🐴'
              }
              {
                subscription?.tier === 'DESERT_ELEPHANTS' && '🐘'
              }
              {
                subscription?.tier === 'DESERT_LIONS' && '🦁'
              }
              {' '}{tierInfo.name}
            </h3>
            <p className="text-sm text-gray-100">Your current subscription plan</p>
          </div>
          {subscription?.status === 'ACTIVE' && (
            <span className="bg-white text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
              ✓ Active
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Price Info */}
        {subscription?.tier !== 'WILD_HORSES' && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Monthly Cost
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              P{tierInfo.monthlyPrice}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                per month
              </span>
            </p>
          </div>
        )}

        {/* Features */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Included Features
          </h4>
          <ul className="space-y-2">
            {tierInfo.features.slice(0, 5).map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
            {tierInfo.features.length > 5 && (
              <li className="text-sm text-gray-600 dark:text-gray-400 italic">
                + {tierInfo.features.length - 5} more...
              </li>
            )}
          </ul>
        </div>

        {/* Limits */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Max Photos
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tierInfo.limits.photos}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Promotions
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tierInfo.limits.promotions}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Branches
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tierInfo.limits.branches}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/business/${businessId}/subscription/plans`}
            className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
          >
            View Plans
          </Link>
          <Link
            href={`/business/${businessId}/subscription`}
            className="flex-1 border border-burgundy-600 hover:bg-burgundy-50 dark:hover:bg-burgundy-900 dark:hover:bg-opacity-20 text-burgundy-600 dark:text-burgundy-400 font-semibold py-3 px-4 rounded-lg text-center transition-colors"
          >
            Manage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionWidget;
