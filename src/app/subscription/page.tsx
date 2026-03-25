'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SectionSubscriptionPackages from '@/components/SectionSubscriptionPackages';

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not logged in, just show packages without businessId
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    // If logged in, try to fetch their first business
    if (status === 'authenticated' && session?.user?.email) {
      fetchUserBusiness();
    }
  }, [session, status]);

  const fetchUserBusiness = async () => {
    try {
      const response = await fetch('/api/business/my-businesses');
      const data = await response.json();
      if (data.success && data.businesses && data.businesses.length > 0) {
        setBusinessId(data.businesses[0].id);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  return (
    <main className="nc-PageSubscription">
      <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Grow Your Business with Namibia Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the perfect subscription plan to unlock powerful features and reach more customers across Namibia.
          </p>
        </div>

        {/* Subscription Packages Component */}
        <SectionSubscriptionPackages businessId={businessId || ''} />

        {/* Comparison Section */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-burgundy-50 dark:bg-burgundy-900 dark:bg-opacity-20">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">
                    🐴 Wild Horses
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">
                    🐘 Desert Elephants
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">
                    🦁 Desert Lions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Free Business Listing', wh: '✓', de: '✓', dl: '✓' },
                  { feature: 'Business Profile', wh: '✓', de: '✓', dl: '✓' },
                  { feature: 'Search Visibility', wh: '✓', de: '✓', dl: '✓' },
                  { feature: 'Photo Uploads', wh: '1', de: '10', dl: '50' },
                  { feature: 'Promotions', wh: '0', de: '5', dl: '20' },
                  { feature: 'Enhanced Profile', wh: '✗', de: '✓', dl: '✓' },
                  { feature: 'Social Media Links', wh: '✗', de: '✓', dl: '✓' },
                  { feature: 'Higher Search Ranking', wh: '✗', de: '✓', dl: '✓' },
                  { feature: 'Customer Reviews', wh: '✓', de: '✓', dl: '✓' },
                  { feature: 'Multiple Branches', wh: '1', de: '1', dl: '5' },
                  { feature: 'Top Search Placement', wh: '✗', de: '✗', dl: '✓' },
                  { feature: 'Featured Badge', wh: '✗', de: '✗', dl: '✓' },
                  { feature: 'Video Introduction', wh: '✗', de: '✗', dl: '✓' },
                  { feature: 'WhatsApp Chatbot', wh: '✗', de: '✗', dl: '✓' },
                  { feature: 'Priority Support', wh: '✗', de: '✓', dl: '✓' },
                  { feature: 'Dedicated Support', wh: '✗', de: '✗', dl: '✓' },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 dark:hover:bg-opacity-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                      {row.wh === '✓' ? (
                        <span className="text-green-600 text-lg">✓</span>
                      ) : row.wh === '✗' ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        row.wh
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                      {row.de === '✓' ? (
                        <span className="text-green-600 text-lg">✓</span>
                      ) : row.de === '✗' ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        row.de
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300 font-semibold">
                      {row.dl === '✓' ? (
                        <span className="text-green-600 text-lg">✓</span>
                      ) : row.dl === '✗' ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        row.dl
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes! You can upgrade or downgrade your subscription plan at any time. Changes take effect immediately.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major payment methods through PayGate, including bank transfers, credit cards, and mobile payments.',
              },
              {
                q: 'Is there a contract or long-term commitment?',
                a: 'No contracts or commitments required. Your subscription is month-to-month and can be cancelled anytime.',
              },
              {
                q: 'What happens when my subscription expires?',
                a: 'Your subscription automatically renews each month. You can disable auto-renewal at any time.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer full refunds for failed payments. Contact support for special cases.',
              },
              {
                q: 'How do I get help with my subscription?',
                a: 'Contact our support team at support@namibiaservices.com or use the contact form on our website.',
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <summary className="font-semibold text-gray-900 dark:text-white text-lg flex items-center justify-between">
                  {item.q}
                  <span className="text-2xl text-burgundy-600 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {!session ? (
          <div className="max-w-2xl mx-auto text-center bg-burgundy-50 dark:bg-burgundy-900 dark:bg-opacity-20 rounded-3xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Create a business account and choose your subscription plan to unlock powerful features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
              >
                Sign Up Now
              </Link>
              <Link
                href="/namibiaservices"
                className="inline-flex items-center justify-center gap-2 border border-burgundy-600 hover:bg-burgundy-50 dark:hover:bg-burgundy-900 dark:hover:bg-opacity-20 text-burgundy-600 dark:text-burgundy-400 font-semibold py-4 px-8 rounded-lg transition-colors"
              >
                Explore Directory
              </Link>
            </div>
          </div>
        ) : !businessId ? (
          <div className="max-w-2xl mx-auto text-center bg-burgundy-50 dark:bg-burgundy-900 dark:bg-opacity-20 rounded-3xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create Your Business
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              You don't have a business yet. Create one to choose your subscription plan.
            </p>
            <Link
              href="/add-listing"
              className="inline-flex items-center justify-center gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Create Business
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
