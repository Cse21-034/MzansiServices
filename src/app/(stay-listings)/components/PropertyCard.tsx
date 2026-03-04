import React, { FC } from "react";
import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    beds?: number;
    baths?: number;
    pricePerNight?: number;
    city: string;
    address: string;
    amenities?: string[];
    createdAt: string;
    business?: {
      id: string;
      name: string;
      slug: string;
      email: string;
      phone: string;
      city?: string;
      address?: string;
    };
  };
}

const PropertyCard: FC<PropertyCardProps> = ({ property }) => {
  return (
    <Link href={`/property-listings/${property.id}`}>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-neutral-700 group cursor-pointer">
        {/* Image Placeholder */}
        <div className="relative w-full h-48 bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          <svg className="w-16 h-16 text-white/60 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12a9 9 0 0118 0M3 12a9 9 0 0018 0m-9-9a9 9 0 100 18" />
          </svg>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-5">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {property.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {property.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-2">
            <MapPinIcon className="w-4 h-4" />
            <span>{property.city}</span>
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-3 mt-3 text-sm">
            {property.beds && (
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {property.beds} Beds
              </span>
            )}
            {property.baths && (
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {property.baths} Bath
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-gray-200 dark:border-neutral-700"></div>

          {/* Business & Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">By</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {property.business?.name || "Private Owner"}
              </p>
            </div>
            {property.pricePerNight && (
              <div className="text-right">
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  N${property.pricePerNight}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">/night</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
