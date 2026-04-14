'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getTierInfo, formatSubscriptionDisplay } from '@/lib/subscription-access';
import Link from 'next/link';

interface SubscriptionManagementProps {
  businessId: string;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  businessId,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchSubscription();
  }, [session, businessId]);

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

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCancelConfirm(false);
        fetchSubscription();
        alert('Subscription cancelled successfully');
      } else {
        alert('Failed to cancel subscription: ' + data.message);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Error cancelling subscription');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Active Subscription
            </h2>
            <p className="text-gray-600 mb-6">
              You're currently on the free WILD HORSES plan.
            </p>
            <Link
              href={`/business/${businessId}/subscription/plans`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo(subscription.tier);
  const display = formatSubscriptionDisplay(subscription.tier);
  
  // Use statusDisplay if available, otherwise use status
  const displayStatus = subscription.statusDisplay || subscription.status || 'UNKNOWN';
  const isActive = displayStatus === 'ACTIVE' || displayStatus === 'FREE';
  
  // Determine the status color
  const getStatusColor = (status: string) => {
    if (status === 'ACTIVE' || status === 'FREE') return 'bg-green-100 text-green-800';
    if (status === 'INACTIVE' || status === 'PENDING') return 'bg-yellow-100 text-yellow-800';
    if (status === 'CANCELLED') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Status Banner */}
          {displayStatus === 'INACTIVE' && subscription.tier !== 'WILD_HORSES' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                ⚠️ Your subscription payment is pending. Please complete the payment to activate your subscription.
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Subscription Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your {display.name} subscription
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(displayStatus)}`}>
              {displayStatus}
            </div>
          </div>

          {/* Current Plan Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Plan Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Current Plan
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Plan Name</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {display.name}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {display.price}
                  </p>
                </div>

                {subscription.subscription?.renewalDate && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-1">Renewal Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(
                        subscription.subscription.renewalDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Included Features
              </h2>
              <ul className="space-y-3">
                {display.features.map((feature, index) => (
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
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Limits Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Account Limits
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Maximum Photos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {display.limits.photos}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Promotions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {display.limits.promotions}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Multiple Branches</p>
                <p className="text-3xl font-bold text-gray-900">
                  {display.limits.branches}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 flex-wrap">
            <Link
              href={`/business/${businessId}/subscription/plans`}
              className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
            >
              View All Plans
            </Link>

            {displayStatus === 'INACTIVE' && subscription.tier !== 'WILD_HORSES' && (
              <Link
                href={`/business/${businessId}/subscription/plans`}
                className="flex-1 min-w-[200px] bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
              >
                Complete Payment
              </Link>
            )}

            {(displayStatus === 'ACTIVE' || displayStatus === 'FREE') && subscription.tier !== 'WILD_HORSES' && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1 min-w-[200px] bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-lg transition"
              >
                Cancel Subscription
              </button>
            )}
          </div>

          {/* Cancel Confirmation Modal */}
          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Cancel Subscription?
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel your {display.name} subscription?
                  You'll lose access to premium features.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Need Help?
          </h3>
          <p className="text-blue-800">
            Contact our support team at support@namibiaservices.com or visit our{' '}
            <Link href="/contact" className="underline font-semibold">
              contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
