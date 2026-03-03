"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AdConfig, getAdsByType } from "@/data/ads";

interface StickyAdProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-right';
  className?: string;
}

const StickyAd: React.FC<StickyAdProps> = ({ position = 'bottom-right', className = "" }) => {
  const [ads, setAds] = useState<AdConfig[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get banner ads for sticky display
    const bannerAds = getAdsByType('banner');
    if (bannerAds.length > 0) {
      setAds(bannerAds);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;

    const timer = setTimeout(() => {
      // Auto-rotate every 10 seconds
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 10000);

    return () => clearTimeout(timer);
  }, [ads.length, currentAdIndex]);

  if (!isVisible || isLoading || ads.length === 0) return null;

  const ad = ads[currentAdIndex];
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
  };

  const handleNext = () => {
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
  };

  const handlePrev = () => {
    setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleAdClick = () => {
    window.open(ad.link, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-40 max-w-xs ${className}`}>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-3xl transition-shadow duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-50 bg-white dark:bg-neutral-700 rounded-full p-1.5 shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
        >
          <XMarkIcon className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
        </button>

        {/* Ad Image */}
        <div 
          className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-700 cursor-pointer group overflow-hidden"
          onClick={handleAdClick}
        >
          <Image
            src={ad.image}
            alt={ad.alt}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Ad Details */}
        <div className="p-4">
          <p className="text-xs font-bold text-burgundy-600 dark:text-burgundy-400 uppercase tracking-wide mb-1">
            💼 Hot Deal
          </p>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-3 line-clamp-2">
            {ad.title}
          </h3>

          {/* Navigation & Indicators */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>

            <div className="flex gap-1.5">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAdIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentAdIndex
                      ? 'bg-burgundy-600 w-6'
                      : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAdClick}
            className="w-full py-2 bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white rounded-lg font-semibold text-xs hover:from-burgundy-600 hover:to-burgundy-700 transition-all shadow-md hover:shadow-lg"
          >
            Check It Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyAd;
