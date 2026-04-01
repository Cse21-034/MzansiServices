'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SUBSCRIPTION_TIERS, getAllTiers, getYearlyPrice, getYearlySavings } from '@/lib/subscription-access';
import { SubscriptionTier } from '@prisma/client';
import Heading from '@/shared/Heading';
import ButtonPrimary from '@/shared/ButtonPrimary';
import { SelectBusinessModal } from './SelectBusinessModal';

interface SectionSubscriptionPackagesProps {
  businessId?: string;
}

type BillingCycle = 'MONTHLY' | 'YEARLY';

const SectionSubscriptionPackages: React.FC<SectionSubscriptionPackagesProps> = ({ businessId = '' }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  const [showBusinessSelector, setShowBusinessSelector] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');

  useEffect(() => {
    if (businessId) {
      fetchSubscriptionStatus();
    }
  }, [businessId]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch(
        `/api/subscriptions/status?businessId=${businessId}`
      );
      const data = await response.json();
      if (data.success) {
        setCurrentTier(data.subscription.tier);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  };

  const handleSubscribe = async (planTier: string) => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (!businessId) {
      // Show business selector modal if no businessId provided
      setSelectedPlanTier(planTier);
      setShowBusinessSelector(true);
      return;
    }

    setProcessingTier(planTier);

    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTier,
          businessId,
          billingCycle: billingCycle,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.subscriptionUrl) {
          // Free plan
          router.push(data.subscriptionUrl);
        } else if (data.checkout?.payRequestId && data.checkout?.checksum) {
          // Paid plan - Step 2: Submit form to PayGate process.trans
          const form = document.createElement("form");
          form.method = "POST";
          form.action = data.checkout.redirectUrl; // process.trans URL

          const payRequestIdInput = document.createElement("input");
          payRequestIdInput.type = "hidden";
          payRequestIdInput.name = "PAY_REQUEST_ID";
          payRequestIdInput.value = data.checkout.payRequestId;
          form.appendChild(payRequestIdInput);

          const checksumInput = document.createElement("input");
          checksumInput.type = "hidden";
          checksumInput.name = "CHECKSUM";
          checksumInput.value = data.checkout.checksum;
          form.appendChild(checksumInput);

          document.body.appendChild(form);
          form.submit();
        }
      } else {
        alert('Failed to initiate subscription: ' + data.message);
      }
    } catch (error) {
      console.error('Error processing subscription:', error);
      alert('Error processing subscription. Please try again.');
    } finally {
      setProcessingTier(null);
    }
  };

  const handleBusinessSelect = async (selectedBusinessId: string) => {
    if (selectedPlanTier) {
      setProcessingTier(selectedPlanTier);
      try {
        const response = await fetch('/api/subscriptions/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planTier: selectedPlanTier,
            businessId: selectedBusinessId,
            billingCycle: billingCycle,
          }),
        });

        const data = await response.json();

        if (data.success) {
          if (data.subscriptionUrl) {
            // Free plan
            router.push(data.subscriptionUrl);
          } else if (data.checkout?.payRequestId && data.checkout?.checksum) {
            // Paid plan - Step 2: Submit form to PayGate process.trans
            const form = document.createElement("form");
            form.method = "POST";
            form.action = data.checkout.redirectUrl; // process.trans URL

            const payRequestIdInput = document.createElement("input");
            payRequestIdInput.type = "hidden";
            payRequestIdInput.name = "PAY_REQUEST_ID";
            payRequestIdInput.value = data.checkout.payRequestId;
            form.appendChild(payRequestIdInput);

            const checksumInput = document.createElement("input");
            checksumInput.type = "hidden";
            checksumInput.name = "CHECKSUM";
            checksumInput.value = data.checkout.checksum;
            form.appendChild(checksumInput);

            document.body.appendChild(form);
            form.submit();
          }
        } else {
          alert('Failed to initiate subscription: ' + data.message);
        }
      } catch (error) {
        console.error('Error processing subscription:', error);
        alert('Error processing subscription. Please try again.');
      } finally {
        setProcessingTier(null);
      }
    }
  };

  const handleCreateNewBusiness = () => {
    setShowBusinessSelector(false);
    router.push('/business/create?fromSubscription=true&planTier=' + selectedPlanTier);
  };

  const tiers = getAllTiers();

  return (
    <div className="relative pt-4">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Heading isCenter desc="Choose the perfect plan for your business and unlock powerful features">
          Namibia Services Packages
        </Heading>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="mt-10 flex justify-center items-center gap-4">
        <span className={`text-sm font-medium ${billingCycle === 'MONTHLY' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
          className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors"
          style={{
            backgroundColor: billingCycle === 'YEARLY' ? '#612C30' : '#d1d5db',
          }}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              billingCycle === 'YEARLY' ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${billingCycle === 'YEARLY' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          Yearly
        </span>
        {billingCycle === 'YEARLY' && (
          <span className="ml-2 inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs font-semibold px-3 py-1 rounded-full">
            Save 15%
          </span>
        )}
      </div>

      {/* Packages Grid */}
      <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {tiers.map((tier, idx) => {
          const isPremium = tier.tier === 'DESERT_LIONS';
          const isStandard = tier.tier === 'DESERT_ELEPHANTS';
          const isFree = tier.tier === 'WILD_HORSES';

          return (
            <div
              key={tier.tier}
              className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                isPremium
                  ? 'nc-shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white md:scale-105 md:-mt-6'
                  : isStandard
                  ? 'nc-shadow-lg bg-white dark:bg-slate-900 border-2 border-burgundy-200 dark:border-burgundy-700'
                  : 'nc-shadow-lg bg-white dark:bg-slate-900'
              } ${currentTier === tier.tier ? 'ring-2 ring-burgundy-600' : ''}`}
            >
              {/* Best Value Badge */}
              {isPremium && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-300 to-yellow-400 text-orange-900 px-4 py-2 rounded-bl-lg font-semibold text-xs uppercase tracking-wider">
                  🏆 Best Value
                </div>
              )}

              {/* Current Plan Badge */}
              {currentTier === tier.tier && (
                <div className="absolute top-0 left-0 bg-burgundy-600 text-white px-4 py-2 rounded-br-lg font-semibold text-xs uppercase">
                  ✓ Active Plan
                </div>
              )}

              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                {/* Icon/Emoji */}
                <div className="mb-4 text-4xl">
                  {tier.tier === 'WILD_HORSES' && '🐴'}
                  {tier.tier === 'DESERT_ELEPHANTS' && '🐘'}
                  {tier.tier === 'DESERT_LIONS' && '🦁'}
                </div>

                {/* Tier Name */}
                <h3
                  className={`text-2xl sm:text-3xl font-bold mb-2 ${
                    isPremium ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {tier.name}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm mb-6 ${
                    isPremium
                      ? 'text-orange-100'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-5xl font-bold ${
                        isPremium
                          ? 'text-white'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {tier.monthlyPrice === 0 
                        ? 'FREE' 
                        : billingCycle === 'YEARLY'
                        ? `N$${getYearlyPrice(tier.tier as any)}`
                        : `N$${tier.monthlyPrice}`
                      }
                    </span>
                    {tier.monthlyPrice > 0 && (
                      <span
                        className={
                          isPremium
                            ? 'text-orange-100'
                            : 'text-gray-600 dark:text-gray-400'
                        }
                      >
                        {billingCycle === 'YEARLY' ? '/year' : '/month'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'YEARLY' && tier.monthlyPrice > 0 && (
                    <p className={`text-sm mt-2 ${isPremium ? 'text-orange-100' : 'text-green-600 dark:text-green-400'} font-medium`}>
                      Save N$${getYearlySavings(tier.tier as any)} per year
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mb-8">
                  {currentTier === tier.tier && businessId ? (
                    <button
                      disabled
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        isPremium
                          ? 'bg-white text-orange-600 cursor-default opacity-80'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-default'
                      }`}
                    >
                      ✓ Your Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(tier.tier)}
                      disabled={processingTier === tier.tier}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                        isPremium
                          ? 'bg-white text-orange-600 hover:bg-orange-50 disabled:bg-gray-300 disabled:text-gray-600'
                          : 'bg-burgundy-600 hover:bg-burgundy-700 text-white disabled:bg-gray-400'
                      }`}
                    >
                      {processingTier === tier.tier ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                              opacity="0.25"
                            />
                            <path
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `${
                          tier.monthlyPrice === 0 ? 'Get Started' : 'Subscribe Now'
                        } →`
                      )}
                    </button>
                  )}
                </div>

                {/* Features List */}
                <div className={`flex-grow space-y-4 mb-6 pb-6 border-b ${
                  isPremium
                    ? 'border-orange-400 border-opacity-50'
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <p
                    className={`text-sm font-semibold uppercase tracking-widest ${
                      isPremium
                        ? 'text-orange-100'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Features
                  </p>
                  <ul className="space-y-3">
                    {tier.features.slice(0, 4).map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-3 text-sm ${
                          isPremium
                            ? 'text-orange-50'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span
                          className={`mt-1 flex-shrink-0 ${
                            isPremium
                              ? 'text-yellow-300'
                              : 'text-burgundy-500'
                          }`}
                        >
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limits Info */}
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    isPremium
                      ? 'bg-orange-400 bg-opacity-30'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <span
                      className={`text-sm font-medium ${
                        isPremium
                          ? 'text-orange-50'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      📸 Max Photos
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isPremium
                          ? 'text-white'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {tier.limits.photos}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    isPremium
                      ? 'bg-orange-400 bg-opacity-30'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <span
                      className={`text-sm font-medium ${
                        isPremium
                          ? 'text-orange-50'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      🎯 Promotions
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isPremium
                          ? 'text-white'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {tier.limits.promotions}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    isPremium
                      ? 'bg-orange-400 bg-opacity-30'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <span
                      className={`text-sm font-medium ${
                        isPremium
                          ? 'text-orange-50'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      🏢 Branches
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isPremium
                          ? 'text-white'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {tier.limits.branches}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          🚀 All plans include free business listing. Upgrade anytime to unlock premium features.
        </p>
      </div>

      {/* Business Selection Modal */}
      <SelectBusinessModal
        isOpen={showBusinessSelector}
        onClose={() => setShowBusinessSelector(false)}
        onSelect={handleBusinessSelect}
        onCreateNew={handleCreateNewBusiness}
        planTier={selectedPlanTier || 'WILD_HORSES'}
      />
    </div>
  );
};

export default SectionSubscriptionPackages;
