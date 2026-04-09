import PaymentSuccess from '@/app/subscription/PaymentSuccess';
import Link from 'next/link';

export const metadata = {
  title: 'Payment Status | Namibia Services',
  description: 'View your payment status',
};

export default function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    reference?: string;
    status?: string;
    businessId?: string;
  };
}) {
  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 hover:text-blue-700">
              ← Back to Home
            </Link>
            <div className="flex gap-4">
              {searchParams.businessId && (
                <Link 
                  href={`/business/${searchParams.businessId}`}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
              )}
              <Link 
                href="/namibiaservices"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Services
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
        <PaymentSuccess searchParams={searchParams} />
      </main>
    </>
  );
}
