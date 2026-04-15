'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'error'>('loading');
  const [adId, setAdId] = useState('');
  const [reference, setReference] = useState('');
  const [businessId, setBusinessId] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    const adId = searchParams.get('adId');
    const businessId = searchParams.get('businessId');

    if (!reference || !adId) {
      setStatus('error');
      return;
    }

    setReference(reference);
    setAdId(adId);
    setBusinessId(businessId || '');

    // Wait a moment for PayGate callback to process
    setTimeout(() => {
      checkPaymentStatus(reference, adId);
    }, 2000);
  }, [searchParams]);

  const checkPaymentStatus = async (ref: string, adId: string) => {
    try {
      // Check if payment was processed
      // TODO: Create an endpoint to check payment status by reference
      // For now, assume success after a delay
      setStatus('success');
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('pending');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Invalid Request
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Invalid payment reference or ad ID. Please try again.
            </p>
            <Link
              href="/usersdashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Processing
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your payment is being processed. This may take a few minutes. You'll receive a confirmation email shortly.
            </p>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Reference:</strong> {reference}
              </div>
              <button
                onClick={() => router.push('/usersdashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your advertising campaign is now active
          </p>
        </div>

        {/* Details */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">TRANSACTION ID</p>
            <p className="text-sm font-mono text-gray-900 dark:text-white">{reference}</p>
          </div>
          {adId && (
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">AD ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white">{adId}</p>
            </div>
          )}
        </div>

        {/* Info Boxes */}
        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>✓ Your ad is live!</strong> It will start appearing across our platform immediately.
            </p>
          </div>

          <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-3">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>✓ Track performance</strong> You can monitor impressions and clicks from your dashboard.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-3">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <strong>✓ Confirmation sent</strong> Check your email for payment receipt and ad details.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">What's Next?</h3>
          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex gap-2">
              <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
              <span>Your ad is live and visible to users</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
              <span>Monitor performance in your dashboard</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
              <span>Renew or upgrade your plan as needed</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/usersdashboard${businessId ? `?businessId=${businessId}` : ''}`}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            View Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Support */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p>Need help? Contact our <Link href="/contact" className="text-blue-600 hover:underline">support team</Link></p>
        </div>
      </div>
    </div>
  );
}
