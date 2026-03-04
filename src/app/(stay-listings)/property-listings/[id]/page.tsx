import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await prisma.propertyListing.findUnique({
    where: { id: params.id },
    include: {
      business: true,
    },
  });

  if (!property || property.status !== "APPROVED") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {property.title}
          </h1>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <a href="/property-listings" className="hover:text-primary-600">Property Listings</a>
            <span>/</span>
            <span>{property.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Placeholder */}
            <div className="w-full h-96 bg-gradient-to-br from-primary-300 to-primary-600 rounded-xl flex items-center justify-center mb-8">
              <svg className="w-20 h-20 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12a9 9 0 0118 0M3 12a9 9 0 0018 0m-9-9a9 9 0 100 18" />
              </svg>
            </div>

            {/* Overview */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-neutral-700 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About this property</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {property.description}
              </p>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.beds && (
                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bedrooms</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.beds}</p>
                  </div>
                )}
                {property.baths && (
                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bathrooms</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.baths}</p>
                  </div>
                )}
                {property.pricePerNight && (
                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">N${property.pricePerNight}</p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Type</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.type}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-neutral-700 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(property.amenities as string[]).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules */}
            {property.rules && (
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-neutral-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">House Rules</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{property.rules}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700 sticky top-20">
              {property.pricePerNight && (
                <div className="mb-6">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    N${property.pricePerNight}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">per night</p>
                </div>
              )}

              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-4">
                Contact Owner
              </button>

              {/* Location */}
              <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Location</h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPinIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{property.address}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{property.city}</p>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              {property.business && (
                <div className="border-t border-gray-200 dark:border-neutral-700 pt-6 mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Owner</h3>
                  <div className="space-y-3">
                    <p className="text-gray-900 dark:text-white font-medium">{property.business.name}</p>
                    {property.business.email && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <EnvelopeIcon className="w-4 h-4" />
                        <a href={`mailto:${property.business.email}`} className="hover:text-primary-600">
                          {property.business.email}
                        </a>
                      </div>
                    )}
                    {property.business.phone && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <PhoneIcon className="w-4 h-4" />
                        <a href={`tel:${property.business.phone}`} className="hover:text-primary-600">
                          {property.business.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
