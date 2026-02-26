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
    <div className="group flex flex-col h-full rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-lg overflow-hidden">
      {/* Image with Promotion Badge */}
      <div className="relative w-full aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={data.image || data.business.coverImage || "/images/placeholder-business.jpg"}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {data.business.membershipStatus && data.business.membershipStatus !== "NONE" && (
          <div className="absolute top-1 right-1">
            <MembershipBadge
              status={data.business.membershipStatus}
              membershipType={data.business.membershipType}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3">
        <div className="mb-1">
          <div className="flex items-center gap-1 text-xs text-neutral-500 mb-0.5">
            <MapPin size={10} />
            <span className="line-clamp-1">{data.business.city}</span>
          </div>
          <div className="flex items-center gap-0.5 text-xs mb-1">
            <Star size={11} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
            <span className="font-medium flex-shrink-0">{data.business.averageRating || "N/A"}</span>
            <span className="text-neutral-500 flex-shrink-0">({data.business.reviewCount})</span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-1">
          {data.title}
        </h3>
        
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-1">
          {data.description}
        </p>

        <div className="flex items-center justify-center mt-auto">
          <Link
            href={`/listings/${data.id}`}
            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition-colors text-xs"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;