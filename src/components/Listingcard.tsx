import React from "react";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import { MembershipBadge } from "./MembershipBadge";

interface ListingCardProps {
  data: any;
  viewMode: "grid" | "list";
  showPromotionsTab?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ data, viewMode }) => {
  if (viewMode === "list") {
    return (
      <div className="group flex flex-col lg:flex-row gap-6 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-lg">
        {/* Image */}
        <div className="lg:w-64 h-48 lg:h-auto rounded-xl overflow-hidden flex-shrink-0 relative">
          <img
            src={data.image || data.business.coverImage || "/images/placeholder-business.jpg"}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-neutral-500">by {data.business.name}</span>
                {data.business.membershipStatus && data.business.membershipStatus !== "NONE" && (
                  <MembershipBadge
                    status={data.business.membershipStatus}
                    membershipType={data.business.membershipType}
                  />
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {data.title}
              </h3>
              
              <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                {data.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {data.business.city}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  {data.business.averageRating || "N/A"} ({data.business.reviewCount} reviews)
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href={`/listings/${data.id}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
              >
                View Details
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="group flex flex-col h-full rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-md overflow-hidden bg-white dark:bg-neutral-900">
      {/* Image with Promotion Badge - Fixed Size */}
      <div className="relative w-full h-32 sm:h-40 overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
        <img
          src={data.image || data.business.coverImage || "/images/placeholder-business.jpg"}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {data.business.membershipStatus && data.business.membershipStatus !== "NONE" && (
          <div className="absolute top-0.5 right-0.5">
            <MembershipBadge
              status={data.business.membershipStatus}
              membershipType={data.business.membershipType}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-2 flex flex-col">
        <div className="mb-0.5">
          <div className="flex items-center gap-0.5 text-xs text-neutral-600 dark:text-neutral-400 mb-0.5 truncate">
            <MapPin size={9} className="flex-shrink-0" />
            <span className="truncate">{data.business.city}</span>
          </div>
          <div className="flex items-center gap-0.5 text-xs">
            <Star size={10} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
            <span className="font-medium flex-shrink-0 text-neutral-900 dark:text-neutral-100">{data.business.averageRating || "N/A"}</span>
            <span className="text-neutral-500 flex-shrink-0 text-xs">({data.business.reviewCount})</span>
          </div>
        </div>

        <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 flex-1">
          {data.title}
        </h3>

        <div className="flex items-center justify-center mt-auto pt-1">
          <Link
            href={`/listings/${data.id}`}
            className="px-2 py-0.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs font-medium transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;