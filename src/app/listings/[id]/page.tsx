"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, CheckCircleIcon, ShareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ListingDetailPageProps {
  params: {
    id: string;
  };
}

const ListingDetailPage = ({ params }: ListingDetailPageProps) => {
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings/${params.id}`);
        if (!res.ok) {
          throw new Error('Listing not found');
        }
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Listing Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The listing you are looking for does not exist.'}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const title = listing.title || "Untitled Listing";
  const description = listing.description || "";
  const businessName = listing.business?.name || "Business";
  const businessCity = listing.business?.city || "";
  const businessPhone = listing.business?.phone || "";
  const businessEmail = listing.business?.email || "";
  const businessWebsite = listing.business?.website || "";
  const businessId = listing.business?.id || "";
  
  // Use listing image first, then business cover image as fallback
  const imageUrl = listing.image || listing.business?.coverImage || "";
  const hasImage = imageUrl && !imageError;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium text-sm">Back</span>
          </button>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white flex-1 text-center mx-4 truncate">
            {title}
          </h1>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Section with Business Image */}
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden bg-gray-200 dark:bg-gray-800">
        {hasImage ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burgundy-100 to-blue-500/20 dark:from-burgundy-900/20 dark:to-blue-500/10">
            <svg className="w-32 h-32 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Floating Business Card */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-6">
          <div className="container mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-2xl">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Business Logo */}
                {hasImage && (
                  <div className="hidden md:block flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-700 shadow-lg">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    </div>
                  </div>
                )}

                {/* Business Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {title}
                      </h2>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mt-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="text-sm">{businessCity}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-semibold text-green-700 dark:text-green-300">Active</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    From <span className="font-bold text-gray-900 dark:text-white">{businessName}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Listing</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {description || "No detailed description provided for this listing. Please contact the business for more information."}
              </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                    <MapPinIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">Location</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{businessCity}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <CheckCircleIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Status</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{listing.status || "Active"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Business Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Contact Card */}
              <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-xl p-8 space-y-6">
                {/* Business Header */}
                <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{businessName}</h3>
                  {businessCity && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {businessCity}
                    </p>
                  )}
                </div>

                {/* Contact Methods */}
                <div className="space-y-3">
                  {businessPhone && (
                    <a
                      href={`tel:${businessPhone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/70 transition-colors">
                        <PhoneIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">Call</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{businessPhone}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}

                  {businessEmail && (
                    <a
                      href={`mailto:${businessEmail}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
                        <EnvelopeIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Email</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{businessEmail}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}

                  {businessWebsite && (
                    <a
                      href={businessWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
                        <GlobeAltIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Website</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Visit</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Primary CTA */}
                {businessId && (
                  <Link href={`/listing-stay-detail/${listing.business?.slug || businessId}`}>
                    <button className="w-full py-4 px-4 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-800 hover:to-burgundy-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                      View Full Profile
                    </button>
                  </Link>
                )}

                {/* Secondary CTA */}
                <button className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
                  <ShareIcon className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Info Box */}
              <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 p-4">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <span className="font-semibold">💡 Tip:</span> Contact the business directly to learn more about this listing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
