"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getRandomAd } from "@/data/ads";

interface InlineAdProps {
  className?: string;
  style?: 'default' | 'minimal' | 'highlight';
}

const InlineAd: React.FC<InlineAdProps> = ({ className = "", style = 'default' }) => {
  const [ad, setAd] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load a random inline ad
    const inlineAds = require('@/data/ads').getAdsByType('inline');
    if (inlineAds.length > 0) {
      const randomAd = inlineAds[Math.floor(Math.random() * inlineAds.length)];
      setAd(randomAd);
    }
    setIsLoading(false);
  }, []);

  if (!isVisible || isLoading || !ad) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    window.open(ad.link, '_blank', 'noopener,noreferrer');
  };

  const baseClasses = "bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-200 dark:border-neutral-700";

  if (style === 'minimal') {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className="flex items-center gap-4 p-4">
          <div className="w-24 h-24 flex-shrink-0 relative rounded-lg overflow-hidden">
            <Image
              src={ad.image}
              alt={ad.alt}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs text-burgundy-600 dark:text-burgundy-400 font-semibold uppercase mb-1">Sponsored</p>
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-2">{ad.title}</h4>
            <button
              onClick={handleClick}
              className="text-xs bg-burgundy-600 text-white px-3 py-1.5 rounded hover:bg-burgundy-700 transition-colors"
            >
              Explore
            </button>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (style === 'highlight') {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-burgundy-50 to-red-50 dark:from-burgundy-900/20 dark:to-red-900/20 ${className}`}>
        <div className="grid grid-cols-3 gap-4 p-6">
          <div className="col-span-2 flex flex-col justify-center">
            <p className="text-xs text-burgundy-600 dark:text-burgundy-400 font-bold uppercase tracking-wide mb-2">Featured Partner</p>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{ad.title}</h3>
            <button
              onClick={handleClick}
              className="w-fit px-6 py-2 bg-burgundy-600 text-white rounded-lg font-semibold text-sm hover:bg-burgundy-700 transition-colors shadow-md"
            >
              Learn More →
            </button>
          </div>
          <div className="relative rounded-lg overflow-hidden cursor-pointer" onClick={handleClick}>
            <Image
              src={ad.image}
              alt={ad.alt}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    );
  }

  // Default style
  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="relative w-full aspect-video bg-neutral-100 dark:bg-neutral-700 cursor-pointer group" onClick={handleClick}>
        <Image
          src={ad.image}
          alt={ad.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-burgundy-600 dark:text-burgundy-400 font-semibold uppercase mb-2">Advertisement</p>
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">{ad.title}</h3>
        <button
          onClick={handleClick}
          className="w-full py-2 bg-burgundy-500 text-white rounded-lg font-semibold text-sm hover:bg-burgundy-600 transition-colors"
        >
          Visit Now
        </button>
      </div>
    </div>
  );
};

export default InlineAd;
