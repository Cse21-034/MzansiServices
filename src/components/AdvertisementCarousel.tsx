'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Advertisement {
  id: string;
  adTitle: string;
  adImageUrl: string;
  destinationUrl: string;
  packageId: string;
  startDate: string;
  expiryDate: string;
  status: string;
  impressions: number;
  clicks: number;
}

interface AdvertisementCarouselProps {
  placement?: 'homepage' | 'sidebar' | 'featured';
  maxAds?: number;
  autoRotate?: boolean;
  rotateDuration?: number; // in seconds
}

export function AdvertisementCarousel({
  placement = 'homepage',
  maxAds = 6,
  autoRotate = true,
  rotateDuration = 5,
}: AdvertisementCarouselProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const impressionTrackedRef = useRef<Set<string>>(new Set());

  // Fetch active advertisements
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch('/api/advertising/packages');
        // TODO: Replace with actual endpoint that fetches active ad subscriptions for this placement
        // For now, we'll implement a proper endpoint
        if (res.ok) {
          const data = await res.json();
          // Filter and format ads
          setAds(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [placement]);

  // Track impression when ad is displayed
  useEffect(() => {
    if (ads.length > 0 && currentIndex < ads.length) {
      const currentAd = ads[currentIndex];
      
      // Only track impression once per ad per session
      if (!impressionTrackedRef.current.has(currentAd.id)) {
        trackEvent(currentAd.id, 'impression');
        impressionTrackedRef.current.add(currentAd.id);
      }
    }
  }, [currentIndex, ads]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!autoRotate || ads.length === 0) return;

    rotationIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, rotateDuration * 1000);

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, [ads, autoRotate, rotateDuration]);

  // Track ad click
  const handleAdClick = (adId: string, destinationUrl: string) => {
    // Track click event
    trackEvent(adId, 'click');

    // Open destination URL in new tab
    window.open(destinationUrl, '_blank');
  };

  // Track events (impression/click)
  const trackEvent = async (adSubscriptionId: string, eventType: 'impression' | 'click') => {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => null);
      const ipData = ipResponse ? await ipResponse.json().catch(() => ({})) : {};

      await fetch('/api/advertising/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adSubscriptionId,
          eventType,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          ipAddress: ipData.ip || null,
        }),
      });
    } catch (error) {
      console.error('Error tracking ad event:', error);
      // Silently fail - don't break ad display
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading advertisements...</div>
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentIndex];

  return (
    <div className="w-full">
      {/* Main Carousel */}
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-64 md:h-80">
        {/* Ad Image */}
        <div
          onClick={() => handleAdClick(currentAd.id, currentAd.destinationUrl)}
          className="relative w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
        >
          {currentAd.adImageUrl && (
            <Image
              src={currentAd.adImageUrl}
              alt={currentAd.adTitle}
              fill
              className="object-cover"
              priority
            />
          )}
          
          {/* Ad Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-semibold text-lg">{currentAd.adTitle}</h3>
          </div>

          {/* Click CTA */}
          <div className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
            Learn More →
          </div>
        </div>

        {/* Previous Button */}
        {ads.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition-colors z-10"
            aria-label="Previous ad"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {ads.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition-colors z-10"
            aria-label="Next ad"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Ads Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {currentIndex + 1} / {ads.length}
        </div>
      </div>

      {/* Thumbnail Indicators */}
      {ads.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {ads.map((ad, index) => (
            <button
              key={ad.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? 'border-blue-600'
                  : 'border-gray-300 dark:border-gray-600 opacity-70 hover:opacity-100'
              }`}
            >
              {ad.adImageUrl && (
                <Image
                  src={ad.adImageUrl}
                  alt={ad.adTitle}
                  width={96}
                  height={64}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Ad Info */}
      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        <p>🎯 Impressions: {currentAd.impressions} | Clicks: {currentAd.clicks}</p>
      </div>
    </div>
  );
}

// Single Ad Display Component (for sidebar or specific placement)
interface SingleAdDisplayProps {
  adSubscriptionId?: string;
  placement?: string;
}

export function SingleAdDisplay({ adSubscriptionId, placement }: SingleAdDisplayProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const impressionTrackedRef = useRef(false);

  useEffect(() => {
    if (!adSubscriptionId) {
      setLoading(false);
      return;
    }

    // Fetch single ad
    const fetchAd = async () => {
      try {
        // TODO: Implement endpoint to fetch single ad by subscription ID
        // const res = await fetch(`/api/advertising/subscriptions/${adSubscriptionId}`);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ad:', error);
        setLoading(false);
      }
    };

    fetchAd();
  }, [adSubscriptionId]);

  // Track impression
  useEffect(() => {
    if (ad && !impressionTrackedRef.current) {
      trackEvent(ad.id, 'impression');
      impressionTrackedRef.current = true;
    }
  }, [ad]);

  const trackEvent = async (adSubscriptionId: string, eventType: 'impression' | 'click') => {
    try {
      await fetch('/api/advertising/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adSubscriptionId,
          eventType,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Error tracking ad event:', error);
    }
  };

  if (loading || !ad) return null;

  return (
    <div
      onClick={() => {
        trackEvent(ad.id, 'click');
        window.open(ad.destinationUrl, '_blank');
      }}
      className="relative cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden"
    >
      {ad.adImageUrl && (
        <Image
          src={ad.adImageUrl}
          alt={ad.adTitle}
          width={300}
          height={250}
          className="w-full h-auto"
        />
      )}
    </div>
  );
}
