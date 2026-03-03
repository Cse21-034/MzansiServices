"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdConfig, getAdsByType } from "@/data/ads";

interface SidebarAdProps {
  className?: string;
}

const SidebarAd: React.FC<SidebarAdProps> = ({ className = "" }) => {
  const [ads, setAds] = useState<AdConfig[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async ad loading
    const sidebarAds = getAdsByType('sidebar');
    setAds(sidebarAds);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 8000); // Change ad every 8 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  if (isLoading || ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(currentAd.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`sticky top-20 ${className}`}>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700">
        {/* Ad Header */}
        <div className="px-4 py-2 bg-gradient-to-r from-burgundy-500 to-burgundy-600">
          <p className="text-xs font-semibold text-white uppercase tracking-wide">Featured Ad</p>
        </div>

        {/* Ad Image */}
        <div 
          className="relative w-full aspect-[3/4] cursor-pointer overflow-hidden bg-neutral-100 dark:bg-neutral-700 group"
          onClick={handleClick}
        >
          <Image
            src={currentAd.image}
            alt={currentAd.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Ad Info */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-2">
            {currentAd.title}
          </h3>

          {/* Indicators */}
          <div className="flex justify-center gap-1.5">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentAdIndex
                    ? 'bg-burgundy-600 w-6'
                    : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400'
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClick}
            className="w-full py-2.5 bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white rounded-lg font-semibold text-sm hover:from-burgundy-600 hover:to-burgundy-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Learn More
          </button>
        </div>

        {/* Ad Label */}
        <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">Advertisement</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarAd;
