"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AdConfig, getAdsByType } from "@/data/ads";

interface NormalizedAd {
  image: string;
  title: string;
  alt: string;
  link: string;
  isPaid?: boolean;
}

interface RotatingBannerAdProps {
  className?: string;
  autoRotate?: boolean;
  rotationInterval?: number;
}

const RotatingBannerAd: React.FC<RotatingBannerAdProps> = ({ 
  className = "", 
  autoRotate = true,
  rotationInterval = 5000
}) => {
  const [ads, setAds] = useState<NormalizedAd[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadAds = async () => {
      // Get static ads
      const staticAds = getAdsByType('banner');
      
      // Fetch paid featured hero spaces
      try {
        const response = await fetch('/api/featured-hero-space');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Convert featured spaces to ad format
          const featuredSpaces = result.data.map((space: any) => ({
            image: space.imageUrl,
            title: space.title,
            alt: space.title,
            link: space.linkUrl || '#',
            isPaid: true,
          }));

          // Combine paid spaces (prioritized) with static ads
          setAds([...featuredSpaces, ...staticAds]);
        } else {
          setAds(staticAds);
        }
      } catch (error) {
        console.error('Error fetching featured hero spaces:', error);
        setAds(staticAds);
      }
      
      setIsLoading(false);
    };

    loadAds();
  }, []);

  useEffect(() => {
    if (!autoRotate || ads.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [ads.length, autoRotate, rotationInterval, isHovered]);

  if (isLoading || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handleAdClick = () => {
    window.open(currentAd.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-neutral-100 dark:bg-neutral-800">
        {/* Ad Image */}
        <div 
          className="relative w-full aspect-[4/1] lg:aspect-[5/1] cursor-pointer group overflow-hidden"
          onClick={handleAdClick}
        >
          <Image
            src={currentAd.image}
            alt={currentAd.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* Text Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent flex items-center px-8">
            <div className="text-white">
              <p className={`text-sm font-bold uppercase tracking-widest opacity-90 mb-2 ${(currentAd as any).isPaid ? 'text-yellow-300' : ''}`}>
                {(currentAd as any).isPaid ? '⭐ Featured Business' : 'Featured Offer'}
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">{currentAd.title}</h2>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAdClick();
                }}
                className="px-6 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-lg font-semibold transition-colors inline-block"
              >
                Learn More →
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {ads.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white dark:bg-neutral-700/80 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Previous ad"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white dark:bg-neutral-700/80 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Next ad"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-3 bg-white'
                  : 'w-3 h-3 bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to ad ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Advertisement Label */}
      <div className="text-center mt-3">
        <span className={`inline-block text-xs font-semibold px-4 py-1.5 rounded-full border ${
          (currentAd as any).isPaid 
            ? 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'
            : 'text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
        }`}>
          {(currentAd as any).isPaid ? '⭐ Featured Business Listing' : '💡 Advertisement'}
        </span>
      </div>
    </div>
  );
};

export default RotatingBannerAd;
