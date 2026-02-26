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

  // Grid View (Default) - Premium E-Commerce Style
  return (
    <Link href={`/listings/${data.id}`}>
      <div className="group flex flex-col h-full rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
        {/* Image Container with Premium Look */}
        <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex-shrink-0">
          <img
            src={data.image || data.business.coverImage || "/images/placeholder-business.jpg"}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Membership Badge */}
          {data.business.membershipStatus && data.business.membershipStatus !== "NONE" && (
            <div className="absolute top-2 right-2">
              <MembershipBadge
                status={data.business.membershipStatus}
                membershipType={data.business.membershipType}
              />
            </div>
          )}
          
          {/* Quick View Icon on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white dark:bg-neutral-900 rounded-full p-3 shadow-lg">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Section - Professional Layout */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col">
          {/* Business Name Badge */}
          <div className="mb-2 inline-block">
            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
              {data.business.name.split(' ')[0]}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
            {data.title}
          </h3>
          
          {/* Rating and Location */}
          <div className="flex items-center justify-between mb-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(Math.floor(data.business.averageRating || 0))].map((_, i) => (
                  <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {data.business.averageRating || "N/A"}
              </span>
              <span className="text-neutral-500">({data.business.reviewCount})</span>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 mb-3">
            <MapPin size={14} className="flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
            <span className="truncate font-medium">{data.business.city}</span>
          </div>
          
          {/* View Button - Premium Style */}
          <button className="w-full mt-auto py-2 px-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold rounded-lg transition-all duration-300 transform group-hover:shadow-lg text-sm uppercase tracking-wide">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;