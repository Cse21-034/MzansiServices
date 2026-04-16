'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SUBSCRIPTION_TIERS, getAllTiers } from '@/lib/subscription-access';
import { SubscriptionTier } from '@prisma/client';

interface SubscriptionPlansProps {
  businessId: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ businessId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planTier: string, billingCycle = 'MONTHLY') => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    setProcessingTier(planTier);

    try {
      // ========== STEP 1: Get checkout params ==========
      console.log('[Payment Flow] Step 1: Getting checkout params...');
      
      const checkoutResponse = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTier,
          businessId,
          billingCycle,
        }),
      });

      const checkoutData = await checkoutResponse.json();

      if (!checkoutData.success) {
        alert('Failed: ' + checkoutData.message);
        setProcessingTier(null);
        return;
      }

      // Free plan - handle separately
      if (checkoutData.free) {
        router.push(checkoutData.redirectUrl);
        return;
      }

      const { initiateUrl, processUrl, params, reference } = checkoutData.checkout;

      console.log('[Payment Flow] Step 1 Complete: Received params and URLs');
      console.log('[Payment Flow] Reference:', reference);

      // ========== STEP 2 & 3: Submit to initiate.trans via server proxy ==========
      // The server-side proxy handles PayGate communication and saves PAY_REQUEST_ID
      console.log('[Payment Flow] Step 2 & 3: Submitting to server proxy...');

      let payRequestId: string | null = null;
      
      try {
        const initiateResponse = await fetch('/api/subscriptions/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            params,
            reference,
          }),
        });

        const initiateData = await initiateResponse.json();
        
        if (!initiateData.success) {
          console.error('[Payment Flow] Initiate failed:', initiateData.message);
          alert('Payment error: ' + initiateData.message);
          setProcessingTier(null);
          return;
        }

        payRequestId = initiateData.payRequestId;
        
        if (!payRequestId) {
          console.error('[Payment Flow] No PAY_REQUEST_ID in response');
          alert('Payment error: Failed to get payment request ID');
          setProcessingTier(null);
          return;
        }

        console.log('[Payment Flow] Step 2 & 3 Complete: PAY_REQUEST_ID extracted and saved:', payRequestId);
      } catch (error) {
        console.error('[Payment Flow] Server proxy error:', error);
        alert('Payment error: ' + (error instanceof Error ? error.message : 'Server error'));
        setProcessingTier(null);
        return;
      }

      // ========== STEP 4: Get process.trans params ==========
      console.log('[Payment Flow] Step 4: Getting process.trans parameters...');

      const processResponse = await fetch('/api/subscriptions/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payRequestId,
          reference,
        }),
      });

      const processData = await processResponse.json();

      if (!processData.success) {
        console.error('[Payment Flow] Process endpoint error:', processData.message);
        alert('Payment error: Failed to process payment request');
        setProcessingTier(null);
        return;
      }

      console.log('[Payment Flow] Step 4 Complete: Received process params');
      console.log('[Payment Flow] Process URL:', processData.processUrl);

      // ========== STEP 5: Submit to process.trans ==========
      console.log('[Payment Flow] Step 5: Submitting to process.trans...');

      const processForm = document.createElement('form');
      processForm.method = 'POST';
      processForm.action = processData.processUrl;

      // Add process parameters to form
      Object.entries(processData.params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        processForm.appendChild(input);
        console.log(`[Payment Flow] Added field: ${key}`);
      });

      document.body.appendChild(processForm);

      console.log('[Payment Flow] Step 5: Submitting form to process.trans...');
      console.log('[Payment Flow] Form HTML:', processForm.outerHTML);

      // Submit the form to PayGate's process.trans
      // User will be redirected to PayGate hosted payment page
      setTimeout(() => {
        processForm.submit();
      }, 100);

    } catch (error) {
      console.error('[Payment Flow] Unexpected error:', error);
      alert('Payment error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setProcessingTier(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  const tiers = getAllTiers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mzansi Services Packages
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the perfect plan to grow your business
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.tier}
              className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900 overflow-hidden transition-transform duration-300 hover:shadow-2xl dark:hover:shadow-lg ${
                tier.tier === currentTier ? 'ring-2 ring-blue-600 dark:ring-blue-500' : ''
              } ${tier.monthlyPrice === 0 ? 'md:scale-95' : 'md:scale-100'}`}
            >
              {/* Current Plan Badge */}
              {tier.tier === currentTier && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-lg font-semibold text-sm">
                  Current Plan
                </div>
              )}

              {/* Best Value Badge */}
              {tier.tier === 'DESERT_LIONS' && (
                <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-br-lg font-semibold text-sm">
                  Best Value
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {tier.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {tier.monthlyPrice === 0 ? 'FREE' : `R$${tier.monthlyPrice}`}
                    </span>
                    {tier.monthlyPrice > 0 && (
                      <span className="text-gray-600 dark:text-gray-400 ml-2">/month</span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                {tier.tier === currentTier ? (
                  <button disabled className="w-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 py-3 rounded-lg font-semibold cursor-default mb-6">
                    Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleSubscribe(tier.tier, 'MONTHLY')
                    }
                    disabled={processingTier === tier.tier}
                    className={`w-full py-3 rounded-lg font-semibold mb-6 text-white transition-colors ${
                      processingTier === tier.tier
                        ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed'
                        : tier.monthlyPrice === 0
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                    }`}
                  >
                    {processingTier === tier.tier ? 'Processing...' : 'Subscribe'}
                  </button>
                )}

                {/* Features List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Features:</h3>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limits Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Max Photos</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tier.limits.photos}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Promotions</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tier.limits.promotions}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Branches</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tier.limits.branches}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto mt-16 bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-slate-900 p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Subscription Details
          </h3>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Auto-renewal:</strong> Your subscription will automatically
                renew each month. You can cancel anytime.
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Secure payments:</strong> All payments are processed securely
                through PayGate.
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Instant activation:</strong> Activate features immediately
                after payment.
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Support:</strong> Premium plans include dedicated support
                from our team.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
