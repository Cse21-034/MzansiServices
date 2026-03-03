import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, PercentBadgeIcon, SparklesIcon } from "@heroicons/react/24/outline";
import ExternalAdScript from "@/components/ExternalAdScript";

interface PromotionDetailPageProps {
  params: {
    id: string;
  };
}

const PromotionDetailPage = async ({ params }: PromotionDetailPageProps) => {
  const promotion = await prisma.promotion.findUnique({
    where: { id: params.id },
    include: {
      business: true,
    },
  });

  if (!promotion) {
    notFound();
  }

  const expiryDate = new Date(promotion.expiryDate);
  const today = new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container py-4">
          <Link href="/promotions" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Promotions
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Promotion Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="aspect-video w-full bg-gradient-to-br from-burgundy-100 to-burgundy-200 flex items-center justify-center relative overflow-hidden">
                {promotion.image ? (
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <SparklesIcon className="w-16 h-16 text-burgundy-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{promotion.title}</p>
                  </div>
                )}
                {promotion.discount && (
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-lg">
                    {promotion.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Promotion Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {promotion.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Exclusive offer from <span className="font-semibold text-gray-900 dark:text-white">{promotion.business.name}</span>
                  </p>
                </div>

                {/* Description */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About this Offer</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base lg:text-lg">
                    {promotion.description}
                  </p>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="bg-gradient-to-br from-burgundy-50 to-burgundy-100 rounded-xl p-4 border border-burgundy-200">
                    <div className="flex items-center gap-3 mb-2">
                      <PercentBadgeIcon className="w-6 h-6 text-burgundy-600" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Discount Amount</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{promotion.discount}%</p>
                  </div>

                  <div className={`rounded-xl p-4 border ${ isExpiringSoon ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <CalendarIcon className={`w-6 h-6 ${isExpiringSoon ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
                      <span className={`text-sm font-medium ${isExpiringSoon ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                        {isExpired ? "Expired" : isExpiringSoon ? "Expires Soon" : "Valid Until"}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${isExpiringSoon ? 'text-red-900 dark:text-red-100' : 'text-green-900 dark:text-green-100'}`}>
                      {expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {!isExpired && (
                      <p className={`text-sm mt-2 ${isExpiringSoon ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-green-600 dark:text-green-400'}`}>
                        {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* External Ad Script - Featured Partnership */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="p-6 lg:p-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Featured Partnership</h3>
                <ExternalAdScript 
                  scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2891&campaign=1"
                  className="rounded-lg overflow-hidden"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Business Info & CTA */}
          <div className="space-y-6">
            {/* Business Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg sticky top-24">
              <div className="text-center mb-6">
                {promotion.business.logo && (
                  <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={promotion.business.logo} alt={promotion.business.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{promotion.business.name}</h3>
                {promotion.business.city && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{promotion.business.city}</p>
                )}
              </div>

              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
                {promotion.business.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {promotion.business.description.substring(0, 150)}...
                  </p>
                )}
                
                <div className="flex flex-col gap-3">
                  <Link
                    href={`/listings?business=${promotion.business.id}`}
                    className="w-full py-3 px-4 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-800 hover:to-burgundy-700 text-white font-semibold rounded-xl text-center transition-all duration-300 hover:shadow-lg"
                  >
                    View Business
                  </Link>
                  {promotion.business.website && (
                    <a
                      href={promotion.business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 border-2 border-burgundy-600 text-burgundy-600 hover:bg-burgundy-600 hover:text-white font-semibold rounded-xl text-center transition-all duration-300"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>

              {/* Promotion Status Badge */}
              {isExpired ? (
                <div className="mt-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                  <p className="text-red-700 dark:text-red-300 font-semibold">This promotion has expired</p>
                </div>
              ) : isExpiringSoon ? (
                <div className="mt-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                  <p className="text-red-700 dark:text-red-300 font-semibold">⏰ Hurry! Ending in {daysLeft} days</p>
                </div>
              ) : (
                <div className="mt-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                  <p className="text-green-700 dark:text-green-300 font-semibold">✓ Promotion is active</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* External Ad Section - Bottom */}
      <div className="container py-12 lg:py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">More Great Offers</h2>
          <ExternalAdScript 
            scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2910&campaign=1"
            className="rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;
