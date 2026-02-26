import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ListingCard from "@/components/Listingcard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path if needed

const ListingsPage = async () => {
  const session = await getServerSession(authOptions);
  const listings = await prisma.listing.findMany({
    include: {
      business: true,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header with Navigation */}
      <div className="container py-6 lg:py-10">
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Business Marketplace
              </h1>
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Discover premium products and services from verified businesses.
              </p>
            </div>
            
            <Link 
              href="/promotions" 
              className="group inline-flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-800 hover:to-burgundy-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Promotions
            </Link>
          </div>
        </div>

        {/* Content Area - Listings Only */}
        <div>
          {/* Listings Grid/List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 sm:gap-1.5 md:gap-2">
            {listings.map((listing: any) => (
              <ListingCard 
                key={listing.id} 
                data={listing} 
                viewMode="grid"
                showPromotionsTab={true}
              />
            ))}
          </div>

          {/* Empty State */}
          {listings.length === 0 && (
            <div className="text-center py-12 lg:py-16">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No listings found
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                No listings available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Business CTA - Modernized - Only show when NOT logged in */}
        {!session?.user && (
          <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl lg:rounded-2xl p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    List Your Business
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-3 lg:mb-4 max-w-xl">
                    Reach thousands of customers and grow your business with our premium marketplace.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4 text-burgundy-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Analytics dashboard
                    </div>
                  </div>
                </div>
                <Link href="/signup?tab=business-registration" className="px-5 py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-800 hover:to-burgundy-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg text-sm lg:text-base inline-block">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;