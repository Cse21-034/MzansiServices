"use client";
import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { StayDataType } from "@/data/types";
import { DEMO_STAY_LISTINGS } from "@/data/listings";
import StartRating from "@/components/StartRating";
import Badge from "@/shared/Badge";
import BtnLikeIcon from "@/components/BtnLikeIcon";
import { cleanAddress } from "@/utils/formatAddress";

export interface StayCard2Props {
  className?: string;
  data?: StayDataType;
  businessHours?: Array<{
    id: string;
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed: boolean;
  }>;
}

const DEMO_DATA = DEMO_STAY_LISTINGS[0];

// Utility function to check if business is currently open
const isBusinessOpen = (businessHours?: Array<{ dayOfWeek: number; openTime?: string; closeTime?: string; isClosed: boolean }>) => {
  if (!businessHours || businessHours.length === 0) {
    // Smart dummy: Open Mon-Fri 8:30AM-4:30PM, Sat 8AM-2PM
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // Sunday - Closed
    if (currentDay === 0) return false;

    // Monday - Friday: 8:30 AM - 4:30 PM
    if (currentDay >= 1 && currentDay <= 5) {
      // 8:30 AM = 8 * 60 + 30 = 510 minutes
      // 4:30 PM = 16 * 60 + 30 = 990 minutes
      return currentTime >= 510 && currentTime < 990;
    }

    // Saturday: 8:00 AM - 2:00 PM
    if (currentDay === 6) {
      return currentTime >= 8 * 60 && currentTime < 14 * 60;
    }

    return false;
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const todayHours = businessHours.find(h => h.dayOfWeek === currentDay);

  if (!todayHours || todayHours.isClosed || !todayHours.openTime || !todayHours.closeTime) {
    return false;
  }

  // Parse open and close times
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const openTime = parseTime(todayHours.openTime);
  const closeTime = parseTime(todayHours.closeTime);

  return currentTime >= openTime && currentTime < closeTime;
};

// Generate operating days display
const getOperatingDays = (businessHours?: Array<{ dayOfWeek: number; openTime?: string; closeTime?: string; isClosed: boolean }>) => {
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (!businessHours || businessHours.length === 0) {
    // Smart dummy data based on current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    return dayNames.map((day, index) => {
      let open = true;
      let hours = "8:30 AM - 4:30 PM";

      if (index === 0) {
        // Sunday - Closed
        open = false;
        hours = "Closed";
      } else if (index === 6) {
        // Saturday - Half day
        hours = "8:00 AM - 2:00 PM";
        open = currentTime >= 8 * 60 && currentTime < 14 * 60;
      } else {
        // Monday - Friday
        // 8:30 AM = 510 min, 4:30 PM = 990 min
        open = currentTime >= 510 && currentTime < 990;
      }

      return {
        day,
        name: fullDayNames[index],
        open,
        hours
      };
    });
  }

  return dayNames.map((day, index) => {
    const dayHours = businessHours.find(h => h.dayOfWeek === index);

    if (!dayHours || dayHours.isClosed || !dayHours.openTime || !dayHours.closeTime) {
      return {
        day,
        name: fullDayNames[index],
        open: false,
        hours: "Closed"
      };
    }

    // Format time from 24h to 12h format
    const formatTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return {
      day,
      name: fullDayNames[index],
      open: true,
      hours: `${formatTime(dayHours.openTime)} - ${formatTime(dayHours.closeTime)}`
    };
  });
};

const StayCard2: FC<StayCard2Props> = ({
  className = "",
  data = DEMO_DATA,
  businessHours,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [operatingDays, setOperatingDays] = useState<any[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const {
    galleryImgs,
    title,
    listingCategory,
    address,
    href,
    like,
    isAds,
    reviewStart,
    reviewCount,
    id,
  } = data;

  const imgSrc = typeof galleryImgs?.[0] === "string" ? galleryImgs[0] : galleryImgs?.[0]?.src;

  // Calculate time on client side only to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setIsOpenNow(isBusinessOpen(businessHours));
    setOperatingDays(getOperatingDays(businessHours));
    setCurrentDayIndex(new Date().getDay());
  }, [businessHours]);

  // Default loading state or server state
  if (!isMounted) {
    return (
      <div className={`group relative bg-white dark:bg-neutral-900 rounded-xl border-2 border-burgundy-600 shadow-sm overflow-hidden ${className}`}>
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-32 sm:h-auto sm:w-28 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 animate-pulse" />
          <div className="flex-1 p-3 space-y-3">
            <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2 animate-pulse" />
            <div className="h-8 bg-neutral-100 dark:bg-neutral-800 rounded w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative bg-white dark:bg-neutral-900 rounded-xl border-2 border-burgundy-600 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Compact Image Box - Even Smaller */}
        <div className="relative h-32 sm:h-auto sm:w-28 overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
          {imgSrc && (
            <>
              <div className={`absolute inset-0 bg-neutral-200 dark:bg-neutral-700 transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
              <Image
                src={imgSrc}
                alt={title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                onLoad={() => setImageLoaded(true)}
              />
            </>
          )}

          {/* Premium Badge */}
          {isAds && (
            <div className="absolute top-2 left-2">
              <div className="bg-black/90 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20 shadow-lg">
                <span className="text-xs font-medium text-white flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </div>
            </div>
          )}

          {/* Like Button */}
          <div className="absolute top-2 right-2">
            <BtnLikeIcon
              isLiked={like}
              className="bg-black/90 backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform duration-200 text-white hover:text-red-500 shadow-lg"
            />
          </div>
        </div>

        {/* Content Section - More Compact */}
        <div className="flex-1 p-3">
          {/* Header - More Compact */}
          <div className="mb-2">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight line-clamp-1 mb-1">
              {title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-neutral-600 dark:text-neutral-400 capitalize bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                {listingCategory?.name || "Business"}
              </span>
              {reviewStart && (
                <div className="flex items-center gap-1">
                  <StartRating point={reviewStart} reviewCount={reviewCount} />
                  <span className="text-xs text-neutral-500">({reviewCount})</span>
                </div>
              )}
            </div>
          </div>

          {/* Location - Bold and Prominent */}
          <div className="flex items-start gap-1 mb-2">
            <svg className="w-3 h-3 text-neutral-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            </svg>
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2 flex-1">
              {cleanAddress(address) || 'Location not available'}
            </p>
          </div>

          {/* Status & Hours - Combined */}
          <div className="flex items-center justify-between mb-2 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-xs font-semibold ${isOpenNow ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isOpenNow ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              {operatingDays[currentDayIndex]?.hours}
            </span>
          </div>

          {/* Operating Days - More Compact & Scannable */}
          <div className="mb-3">
            <div className="flex justify-between gap-1">
              {operatingDays.map((day, index) => (
                <div
                  key={day.day}
                  className={`flex flex-col items-center p-1 rounded flex-1 min-w-0 transition-all ${index === currentDayIndex
                    ? 'bg-burgundy-600 text-white shadow-sm'
                    : day.open
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600'
                    }`}
                >
                  <span className="text-[10px] font-medium truncate w-full text-center">
                    {day.day}
                  </span>
                  <div className="mt-0.5">
                    {day.open ? (
                      <svg className="w-2 h-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-2 h-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <Link
            href={href}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-burgundy-600 hover:bg-burgundy-800 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-md hover:scale-[1.02] group"
          >
            <span>View Details</span>
            <svg
              className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StayCard2;