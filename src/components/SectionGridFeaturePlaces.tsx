"use client";

import React, { FC, ReactNode, useEffect, useState } from "react";
import { StayDataType, AuthorType, TaxonomyType } from "@/data/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import HeaderFilter from "./HeaderFilter";
import StayCard from "./StayCard";
import StayCard2 from "./StayCard2";
import { formatFullAddress, safeToString } from "@/utils/formatAddress";

// Define the real business data interface based on your Prisma schema
export interface BusinessDataType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: {
    id: string;
    name: string;
    slug?: string;
  };
  email: string;
  phone: string;
  website?: string;
  address?: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  establishedYear?: number;
  employees?: string;
  pricingRange?: "BUDGET" | "MODERATE" | "PREMIUM" | "LUXURY";
  services: string[];
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "SUSPENDED";
  verified: boolean;
  featured: boolean;
  viewCount: number;
  reviewCount: number;
  averageRating?: number;
  photos: {
    id: string;
    url: string;
    isPrimary: boolean;
    caption?: string;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
  }[];
  businessHours: {
    id: string;
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SectionGridFeaturePlacesProps {
  businessListings?: BusinessDataType[];
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  cardType?: "card1" | "card2";
  limit?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
}

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  businessListings,
  gridClass = "",
  heading = "Featured Business",
  subHeading = "Popular businesses in your area",
  headingIsCenter,
  tabs,
  cardType = "card2",
  limit = 8,
  showViewAll = true,
  viewAllHref = "/listing-stay",
}) => {
  const [businesses, setBusinesses] = useState<BusinessDataType[]>([]);
  const [availableTabs, setAvailableTabs] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(limit);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // Define the new categories provided by the user
  const userCategories = [
    { name: 'Food & Hospitality', subcategories: ['Restaurants', 'Hotels & Lodges', 'Cafes & Bars', 'Catering Services', 'Fast Food'] },
    { name: 'Retail & Shopping', subcategories: ['Supermarkets', 'Clothing Stores', 'Electronics', 'Furniture', 'General Dealers'] },
    { name: 'Healthcare', subcategories: ['Hospitals', 'Clinics', 'Pharmacies', 'Dental Services', 'Opticians'] },
    { name: 'Professional Services', subcategories: ['Legal Services', 'Accounting', 'Consulting', 'IT Services', 'Marketing'] },
    { name: 'Tourism & Recreation', subcategories: ['Tour Operators', 'Safari Companies', 'Travel Agencies', 'Adventure Sports', 'Cultural Tours'] }
  ];

  // Update available categories based on user-provided list
  const updateCategories = () => {
    setCategoriesLoading(true);
    const categoryNames = userCategories.map(cat => cat.name);
    setAvailableTabs(["All", ...categoryNames]);
    setCategoriesLoading(false);
  };

  // Fetch real business data from API
  const fetchBusinesses = async (category?: string, offset: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = category && category !== "All" 
        ? `/api/businesses?category=${encodeURIComponent(category)}&limit=${limit}&offset=${offset}`
        : `/api/businesses?limit=${limit}&offset=${offset}`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('Unable to load businesses');
      }
      
      const data = await res.json();
      
      if (data.success === false) {
        throw new Error(data.error || 'Unable to load businesses');
      }
      
      if (data.businesses && Array.isArray(data.businesses)) {
        if (offset === 0) {
          setBusinesses(data.businesses);
        } else {
          setBusinesses(prev => [...prev, ...data.businesses]);
        }
        setHasMore(data.pagination?.hasMore || false);
      } else {
        setBusinesses([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setError('Unable to load businesses at the moment. Please try again later.');
      setBusinesses([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Load more businesses
  const loadMoreBusinesses = async () => {
    try {
      setShowMoreLoading(true);
      await fetchBusinesses(activeTab, displayCount);
      setDisplayCount(prev => prev + limit);
    } catch (error) {
      console.error('Error loading more businesses:', error);
      setError('Unable to load more businesses. Please try again.');
    } finally {
      setShowMoreLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setDisplayCount(limit);
    fetchBusinesses(tab, 0);
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    fetchBusinesses(activeTab, 0);
  };

  useEffect(() => {
    // Fetch categories on component mount if no tabs are provided
    if (!tabs) {
      updateCategories();
    }
    
    // Use provided businessListings or fetch from API
    if (businessListings) {
      setBusinesses(businessListings);
      setLoading(false);
      setHasMore(false);
    } else {
      fetchBusinesses(activeTab, 0);
    }
  }, [businessListings]);

  // Use provided tabs or dynamically fetched tabs
  const displayTabs = tabs || availableTabs;

  // Convert business data to stay data format for compatibility
  const convertBusinessToStayData = (business: BusinessDataType): StayDataType => {
    const primaryPhoto = business.photos.find(photo => photo.isPrimary) || business.photos[0];
    const totalReviews = business.reviews.length;
    const averageRating = business.averageRating || 
      (business.reviews.length > 0 
        ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length 
        : 0);
    
    // Create proper AuthorType object
    const author: AuthorType = {
      id: business.id,
      firstName: business.name.split(' ')[0] || business.name,
      lastName: business.name.split(' ').slice(1).join(' ') || "",
      displayName: business.name,
      avatar: primaryPhoto?.url || "/images/placeholder-business.jpg",
      bgImage: primaryPhoto?.url || "/images/placeholder-business-bg.jpg",
      email: business.email,
      count: totalReviews,
      desc: business.description || `Professional ${business.category.name} services`,
      jobName: business.category?.name || "Business Owner",
      // FIX: Use the listing-stay-detail route like the old code
      href: `/listing-stay-detail/${business.slug}` as any,
      starRating: averageRating,
    };

    // Create proper TaxonomyType object
    const listingCategory: TaxonomyType = {
      id: business.category?.id || business.category?.name || "business",
      name: business.category?.name || "Business",
      href: `/category/${business.category?.slug || (business.category?.name || "business").toLowerCase()}` as any,
      thumbnail: primaryPhoto?.url || "/images/placeholder-category.jpg",
      count: 0,
      desc: business.description || `Find the best ${business.category.name} services in your area`,
      color: "blue",
      taxonomy: "category",
      listingType: "stay",
    };

    // Generate pricing based on pricing range
    const getPriceDisplay = () => {
      switch (business.pricingRange) {
        case "BUDGET": return "$";
        case "MODERATE": return "$$";
        case "PREMIUM": return "$$$";
        case "LUXURY": return "$$$$";
        default: return "$$";
      }
    };

    return {
      id: business.id,
      author: author,
      date: business.createdAt || new Date().toISOString(),
      // FIX: Use the listing-stay-detail route like the old code
      href: `/listing-stay-detail/${business.slug}` as any,
      title: business.name,
      featuredImage: primaryPhoto?.url || "/images/placeholder-business.jpg",
      commentCount: totalReviews,
      viewCount: business.viewCount || 0,
      address: formatFullAddress(business.address, business.city, business.country),
      reviewStart: Math.round(averageRating * 2) / 2, // Round to nearest 0.5
      reviewCount: totalReviews,
      like: false,
      galleryImgs: business.photos.length > 0 
        ? business.photos.map(photo => photo.url)
        : ["/images/placeholder-business.jpg"],
      price: getPriceDisplay(),
      listingCategory: listingCategory,
      maxGuests: 0,
      bedrooms: 0,
      bathrooms: 0,
      saleOff: null,
      isAds: business.featured || false,
      map: {
        lat: business.latitude || -22.5597, // Default to Windhoek coordinates
        lng: business.longitude || 17.0832,
      },
    };
  };

  const renderCard = (business: BusinessDataType) => {
    const stayData = convertBusinessToStayData(business);
    
    // Only pass businessHours to StayCard2, not to StayCard
    if (cardType === "card2") {
      return <StayCard2 key={business.id} data={stayData} businessHours={business.businessHours} />;
    }
    
    return <StayCard key={business.id} data={stayData} />;
  };

  // Show loading state
  if (loading && businesses.length === 0) {
    return (
      <div className="nc-SectionGridFeaturePlaces relative">
        <HeaderFilter
          tabActive={activeTab}
          subHeading={subHeading}
          tabs={displayTabs}
          heading={heading}
          onClickTab={handleTabChange}
          showViewAll={showViewAll}
          viewAllHref={viewAllHref}
        />
        <div className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}>
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-neutral-700 h-64 rounded-2xl mb-4"></div>
              <div className="bg-gray-300 dark:bg-neutral-700 h-4 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-300 dark:bg-neutral-700 h-4 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error && businesses.length === 0) {
    return (
      <div className="nc-SectionGridFeaturePlaces relative">
        <HeaderFilter
          tabActive={activeTab}
          subHeading={subHeading}
          tabs={displayTabs}
          heading={heading}
          onClickTab={handleTabChange}
          showViewAll={false}
        />
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 text-neutral-400 dark:text-neutral-600">
            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            Temporary Service Interruption
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto text-lg">
            We're having trouble loading businesses right now. This is usually temporary.
          </p>
          <div className="space-y-4">
            <ButtonPrimary 
              onClick={handleRetry}
              className="px-8 py-3 text-lg"
            >
              Try Again
            </ButtonPrimary>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              <p>If this continues, please check back in a few minutes.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nc-SectionGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={activeTab}
        subHeading={subHeading}
        tabs={displayTabs}
        heading={heading}
        onClickTab={handleTabChange}
        showViewAll={showViewAll}
        viewAllHref={viewAllHref}
      />
      
      {businesses.length === 0 && !loading ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 text-neutral-400 dark:text-neutral-600">
            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            {activeTab !== "All" ? `No ${activeTab} Businesses Found` : "No Businesses Available"}
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto text-lg">
            {activeTab !== "All" 
              ? `We couldn't find any businesses in the "${activeTab}" category. Try browsing other categories or check back later.` 
              : "No businesses are available at the moment. Please check back later for new listings."}
          </p>
          {activeTab !== "All" && (
            <ButtonSecondary 
              onClick={() => handleTabChange("All")}
              className="px-6 py-2"
            >
              Browse All Categories
            </ButtonSecondary>
          )}
        </div>
      ) : (
        <>
          <div
            className={`grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ${gridClass}`}
          >
            {businesses.map((business) => renderCard(business))}
          </div>
                    
          {/* Show load more button if there are more results */}
          {hasMore && (
            <div className="flex mt-16 justify-center items-center">
              <ButtonPrimary 
                onClick={loadMoreBusinesses} 
                loading={showMoreLoading}
                className="px-8 py-3"
              >
                {showMoreLoading ? "Loading..." : "Show More Businesses"}
              </ButtonPrimary>
            </div>
          )}

          {/* Show end of results message */}
          {!hasMore && businesses.length > 0 && (
            <div className="text-center mt-12 py-6">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                You've reached the end of our business listings
              </p>
            </div>
          )}
        </>
      )}

      {/* Error banner for partial errors (when some businesses loaded but then error occurred) */}
      {error && businesses.length > 0 && (
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-yellow-600 dark:text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Some businesses may not be displayed
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  There was a problem loading additional businesses
                </p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionGridFeaturePlaces;