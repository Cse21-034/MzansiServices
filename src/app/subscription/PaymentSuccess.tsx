import React from 'react';
import Link from 'next/link';

interface PaymentSuccessProps {
  searchParams: {
    reference?: string;
    status?: string;
    businessId?: string;
  };
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ searchParams }) => {
  const { reference, businessId } = searchParams;
  const isSuccess = searchParams.status === 'success';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 flex items-center">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center">
        {isSuccess ? (
          <>
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
                <svg
                  className="h-20 w-20 text-green-500 relative"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your subscription has been activated successfully.
            </p>

            {reference && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Transaction Reference</p>
                <p className="text-lg font-mono font-semibold text-gray-900 break-all">
                  {reference}
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900">
                Your premium features are now active. Check your email for confirmation.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {businessId && (
                <Link
                  href={`/business/${businessId}/subscription`}
                  className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  View Subscription
                </Link>
              )}
              <Link
                href="/namibiaservices"
                className="block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
              >
                Return to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-400 rounded-full opacity-20 animate-pulse"></div>
                <svg
                  className="h-20 w-20 text-red-500 relative"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>

            {reference && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Reference</p>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {reference}
                </p>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-900">
                Please contact support if the problem persists.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {businessId && (
                <Link
                  href={`/business/${businessId}/subscription/plans`}
                  className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  Try Again
                </Link>
              )}
              <Link
                href="/contact"
                className="block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
              >
                Contact Support
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
