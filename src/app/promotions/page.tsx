'use client'
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StickyAd from "@/components/ads/StickyAd";
import InlineAd from "@/components/ads/InlineAd";
import ExternalAdScript from "@/components/ExternalAdScript";

type PromotionType = "all" | "featured" | "ending-soon" | "high-discount";

// Hero Ads with proper descriptions AND visible background images
const HERO_ADS = [
  {
    id: "hero-ad-1",
    title: "Gold Card Fridays",
    heroDescription: "Exclusive 15% cashback on all purchases when you use your FNB Gold Card every Friday. Enjoy premium banking benefits with every swipe!",
    discount: 15,
    businessName: "FNB Namibia",
    businessLogo: "/images/promotionhero/fnb.webp",
    listingRating: 4.5,
    listingReviews: 500,
    promoCode: "FNBGOLD15",
    ctaText: "Apply Now",
    image: "/images/promotionhero/fnb.webp",
    color: "from-yellow-500 via-yellow-600 to-amber-700"
  },
  {
    id: "hero-ad-2",
    title: "Wimpy Burger Feast",
    heroDescription: "Get our signature Great Burger for only P34.90! Perfectly grilled beef patty with fresh lettuce, tomato, and special sauce. Limited time offer!",
    discount: 20,
    businessName: "Wimpy Namibia",
    businessLogo: "/images/promotionhero/great-burgers.webp",
    listingRating: 4.2,
    listingReviews: 800,
    promoCode: "WIMPY3490",
    ctaText: "Order Online",
    image: "/images/promotionhero/great-burgers.webp",
    color: "from-red-500 via-red-600 to-rose-700"
  },
  {
    id: "hero-ad-3",
    title: "Nandos Family Feast",
    heroDescription: "Enjoy 20% off on all Nandos family meals! Perfect for gatherings - get our famous PERi-PERi chicken, sides, and drinks for the whole family.",
    discount: 20,
    businessName: "Nandos Namibia",
    businessLogo: "/images/promotionhero/nandos1.webp",
    listingRating: 4.7,
    listingReviews: 1500,
    promoCode: "FAMILY20",
    ctaText: "Book Table",
    image: "/images/promotionhero/nandos1.webp",
    color: "from-burgundy-600 via-burgundy-700 to-burgundy-800"
  },
  {
    id: "hero-ad-4",
    title: "Nandos Lunch Special",
    heroDescription: "Grab a delicious Nandos lunch combo for only P59.90! Includes 1/4 chicken, regular side, and regular drink. Available weekdays 11am-3pm.",
    discount: 25,
    businessName: "Nandos Namibia",
    businessLogo: "/images/promotionhero/nandos2.webp",
    listingRating: 4.6,
    listingReviews: 1200,
    promoCode: "LUNCH5990",
    ctaText: "View Menu",
    image: "/images/promotionhero/nandos2.webp",
    color: "from-burgundy-700 via-burgundy-600 to-burgundy-800"
  }
];

const PromotionsPage = () => {
  const [selectedType, setSelectedType] = useState<PromotionType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const [allPromotions, setAllPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/promotions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add caching to avoid repeated requests
          cache: 'no-store',
        });
        if (!res.ok) {
          console.error("Failed to fetch promotions:", res.statusText);
          setError("Failed to load promotions");
          return;
        }
        const data = await res.json();
        console.log("Fetched promotions:", data);
        setAllPromotions(data || []);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setError("Error loading promotions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // Filter promotions
  const filteredPromotions = allPromotions.filter(promo => {
    const matchesSearch = 
      searchQuery === "" ||
      (promo.title && promo.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (promo.description && promo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (promo.business && promo.business.name && promo.business.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedType === "all") return matchesSearch;
    // if (selectedType === "featured") return promo.isFeatured && matchesSearch; // Need to add isFeatured to Promotion model
    if (selectedType === "ending-soon") {
      const expiryDate = new Date(promo.expiryDate);
      const today = new Date();
      const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 7 && matchesSearch;
    }
    if (selectedType === "high-discount") return promo.discount >= 20 && matchesSearch;
    
    return matchesSearch;
  });

  // Count by type
  const counts = {
    all: allPromotions.length,
    featured: allPromotions.filter(p => false).length, // Placeholder until isFeatured is added
    endingSoon: allPromotions.filter(p => {
      const expiryDate = new Date(p.expiryDate);
      const today = new Date();
      const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 7;
    }).length,
    highDiscount: allPromotions.filter(p => p.discount >= 20).length
  };

  // Auto-scroll functionality for hero ads
  useEffect(() => {
    if (HERO_ADS.length <= 1) return;

    const startAutoPlay = () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
      slideInterval.current = setInterval(() => {
        if (isAutoPlaying) {
          setCurrentSlide((prev) => (prev + 1) % HERO_ADS.length);
        }
      }, 5000);
    };

    startAutoPlay();
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_ADS.length);
    if (slideInterval.current) clearInterval(slideInterval.current);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_ADS.length) % HERO_ADS.length);
    if (slideInterval.current) clearInterval(slideInterval.current);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (slideInterval.current) clearInterval(slideInterval.current);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <StickyAd position="bottom-right" />
      {/* Hero Section with Dummy Ad Specials */}
      <div className="relative overflow-hidden">
        {/* Hero Ads Slider */}
        {HERO_ADS.length > 0 ? (
          <div className="relative h-[450px] lg:h-[500px]">
            {/* Slides */}
            <div className="absolute inset-0">
              {HERO_ADS.map((ad, index) => (
                <div
                  key={ad.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0"
                      : index < currentSlide
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                  }`}
                  style={{ zIndex: index === currentSlide ? 10 : 1 }}
                >
                  {/* BACKGROUND IMAGE - This was missing! */}
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-black/60" />
                  
                  {/* Content */}
                  <div className="container h-full flex items-center relative z-10 pt-16">
                    <div className="max-w-3xl text-white">

                      <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
                        {ad.title}
                      </h1>
                      <p className="text-lg lg:text-xl text-white/90 mb-6 drop-shadow-lg">
                        {ad.heroDescription}
                      </p>
                      {/* CTA Button */}
                      <div className="mt-4">
                        <button className="px-6 py-3 lg:px-8 lg:py-3 bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl text-base lg:text-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                          {ad.ctaText}
                        </button>
                      </div>


                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            {HERO_ADS.length > 1 && (
              <>
                {/* Navigation Dots */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                  {HERO_ADS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-white lg:w-8"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 p-2 lg:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all z-20"
                  aria-label="Previous slide"
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 p-2 lg:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all z-20"
                  aria-label="Next slide"
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Auto-play Toggle */}
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="absolute right-3 lg:right-4 bottom-20 p-1.5 lg:p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all z-20"
                  aria-label={isAutoPlaying ? "Pause auto-play" : "Play auto-play"}
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isAutoPlaying ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    )}
                  </svg>
                </button>
              </>
            )}
          </div>
        ) : (
          // Fallback if no ads
          <div className="relative h-[400px] bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-burgundy-700">
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/5" />
            <div className="container h-full flex items-center">
              <div className="max-w-3xl text-white">
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  Exclusive Promotions Hub
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl">
                  Discover limited-time offers and exclusive deals from premium businesses. 
                  Save big with featured promotions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Bridge Search Bar */}
      <div className="relative z-20 -mt-12 lg:-mt-16">
        <div className="container px-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Search Input - Modern Design */}
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search promotions, deals, or businesses..."
                    className="w-full pl-12 pr-4 py-3.5 lg:py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-burgundy-600 focus:border-transparent transition-all duration-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Handle search
                      }
                    }}
                  />
                </div>

                {/* Action Buttons - Modern and Responsive */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Filter Button */}
                  <button className="flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-sm font-medium">Filters</span>
                  </button>

                  {/* Search Button - Modern Gradient */}
                  <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-800 hover:to-burgundy-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm font-medium">Search</span>
                  </button>
                </div>
              </div>

              {/* Quick Search Tags - Modern Chips */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Popular:</span>
                  <button 
                    onClick={() => setSelectedType("featured")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </button>
                  <button 
                    onClick={() => setSelectedType("high-discount")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    High Discount
                  </button>
                  <button 
                    onClick={() => setSelectedType("ending-soon")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ending Soon
                  </button>
                  <button 
                    onClick={() => setSearchQuery("electronics")}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Electronics
                  </button>
                  <button 
                    onClick={() => setSearchQuery("beauty")}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Beauty
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pt-12 lg:pt-16 pb-12">
        {/* Promotion Type Filters - Improved Responsiveness */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Browse Promotions
            </h2>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredPromotions.length} offers found
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Grid view">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="List view">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Buttons - Responsive Grid */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-8">
            {[
              { id: "all", label: "All Promotions", count: counts.all, icon: "grid" },
              { id: "featured", label: "Featured", count: counts.featured, icon: "star", color: "yellow" },
              { id: "ending-soon", label: "Ending Soon", count: counts.endingSoon, icon: "clock", color: "red" },
              { id: "high-discount", label: "High Discount", count: counts.highDiscount, icon: "arrow-trending-up", color: "green" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as PromotionType)}
                className={`group flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedType === type.id
                    ? type.color === "yellow"
                      ? "bg-burgundy-600 text-white shadow-lg"
                      : type.color === "red"
                      ? "bg-red-500 text-white shadow-lg"
                      : type.color === "green"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-burgundy-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-burgundy-600 dark:hover:border-burgundy-700"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getPromotionIcon(type.icon)}
                </svg>
                <span className="text-sm">{type.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedType === type.id
                    ? "bg-white/20"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}>
                  {type.count}
                </span>
              </button>
            ))}
          </div>

          {/* External Ad Scripts - Partnership Programs */}
          <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExternalAdScript 
              scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2910&campaign=1"
              className="rounded-xl overflow-hidden"
            />
            <ExternalAdScript 
              scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2891&campaign=1"
              className="rounded-xl overflow-hidden"
            />
          </div>

          {/* Promotions Grid */}
          <div className="space-y-8 mt-8 lg:mt-12">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-burgundy-600"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">Loading promotions...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <p className="text-red-700 dark:text-red-300 font-medium mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Regular Promotions */}
            {!isLoading && !error && (
              <>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-6">
                    {selectedType === "featured" ? "" : 
                     selectedType === "ending-soon" ? "Promotions Ending Soon" :
                     selectedType === "high-discount" ? "High Discount Promotions" : 
                     "All Promotions"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPromotions.map((promo, index) => (
                      <React.Fragment key={promo.id}>
                        <PromotionCard promo={promo} />
                        {/* Insert inline ad after 6th promotion */}
                        {index === 5 && (
                          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-4">
                            <InlineAd style="highlight" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Empty State */}
                {filteredPromotions.length === 0 && (
                  <div className="text-center py-12 lg:py-16">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No promotions found
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 max-w-md mx-auto">
                      {searchQuery 
                        ? `No results for "${searchQuery}". Try a different search.`
                        : "No promotions available in this category."}
                    </p>
                    <button 
                      onClick={() => { setSelectedType("all"); setSearchQuery(""); }}
                      className="px-5 py-2.5 lg:px-6 lg:py-3 bg-burgundy-600 hover:bg-burgundy-800 text-white text-sm lg:text-base font-medium rounded-xl transition-colors"
                    >
                      View All Promotions
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* External Ad Section - After Promotions */}
          <div className="mt-12 lg:mt-16">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-6">Featured Partnerships</h3>
            <ExternalAdScript 
              scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2911&campaign=1"
              className="rounded-xl overflow-hidden"
            />
          </div>
        </div>

        {/* Business Promotion CTA - Improved Responsive
        <div className="mt-12 lg:mt-16 p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="max-w-2xl">
              <h3 className="text-xl lg:text-2xl font-bold mb-4">Feature Your Promotion Here</h3>
              <p className="text-gray-300 mb-4 lg:mb-6 text-sm lg:text-base">
                Get your promotions seen by thousands of potential customers. 
                Our premium featured spots offer maximum visibility and higher conversion rates.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm lg:text-base">10x More Views</div>
                    <div className="text-xs lg:text-sm text-gray-400">Featured placements</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm lg:text-base">Verified Badge</div>
                    <div className="text-xs lg:text-sm text-gray-400">Trust & credibility</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm lg:text-base">Detailed Analytics</div>
                    <div className="text-xs lg:text-sm text-gray-400">Track performance</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button className="w-full lg:w-auto px-6 py-3.5 lg:px-8 lg:py-4 bg-burgundy-600 hover:bg-burgundy-800 text-white font-bold rounded-xl text-base lg:text-lg transition-all duration-300 hover:shadow-xl">
                Promote Now
                <span className="block text-xs lg:text-sm font-normal mt-1">Starting from $49/month</span>
              </button>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

// Regular Promotion Card Component
function PromotionCard({ promo }: { promo: any }) {
  const expiryDate = new Date(promo.expiryDate);
  const today = new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-5 hover:border-burgundy-600 dark:hover:border-burgundy-700 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between mb-3 lg:mb-4">
        <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg overflow-hidden">
            <img 
              src={promo.business.logo || "/images/placeholder-business.jpg"} 
              alt={promo.business.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">{promo.business.name}</div>
          </div>
        </div>
        <span className="px-2.5 py-1 lg:px-3 lg:py-1 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white text-xs lg:text-sm font-bold rounded-full shadow-sm">
          -{promo.discount}%
        </span>
      </div>
      
      <div className="mb-3 lg:mb-4">
        <h4 className="font-bold text-gray-900 dark:text-white text-base lg:text-lg mb-1 lg:mb-2 line-clamp-1">{promo.title}</h4>
        <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{promo.description}</p>
      </div>
      
      <div className="pt-3 lg:pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2 lg:mb-3">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1 lg:gap-2">
              <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {daysLeft} days left
            </div>
          </div>
        </div>
        <Link 
          href={`/promotions/${promo.id}`}
          className="w-full py-2 lg:py-2.5 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-800 hover:to-burgundy-700 text-white text-sm lg:text-base font-medium rounded-lg text-center transition-all duration-300 hover:shadow-md block"
        >
          View Offer
        </Link>
      </div>
    </div>
  );
}

// Helper function for promotion icons
function getPromotionIcon(iconName: string) {
  switch(iconName) {
    case 'grid':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />;
    case 'star':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />;
    case 'clock':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
    case 'arrow-trending-up':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />;
    default:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />;
  }
}

export default PromotionsPage;