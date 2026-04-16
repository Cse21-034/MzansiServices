"use client";
import React, { FC, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import Pagination from "@/shared/Pagination";
import StayCard2 from "@/components/StayCard2";
import BusinessSidebarFilters from "@/components/BusinessSidebarFilters";
const logoMobile = "/images/mzansi-logo/squarelogo.PNG";

// Define the real business data interface
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
  services: string[];
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "SUSPENDED";
  verified: boolean;
  featured: boolean;
  viewCount: number;
  reviewCount: number;
  averageRating?: number;
  isBranch: boolean;
  branchName?: string;
  parentBusinessId?: string;
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

export interface SectionGridFilterCardProps {
  className?: string;
}

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [businesses, setBusinesses] = useState<BusinessDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');
  const urlLocation = searchParams.get('location');

  // Fetch real business data from API
  const fetchBusinesses = async (page: number = 1, limit: number = 12, category?: string, search?: string, location?: string) => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/businesses?limit=${limit}&offset=${(page - 1) * limit}`;
      if (category && category !== "All") {
        url += `&category=${encodeURIComponent(category)}`;
      }
      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      if (location && location.trim() !== "") {
        url += `&location=${encodeURIComponent(location.trim())}`;
      }

      console.log('🔄 Fetching businesses from:', url);
      const res = await fetch(url, { cache: 'no-store' });

      if (!res.ok) {
        throw new Error('Unable to load businesses');
      }

      const data = await res.json();
      console.log('📊 Businesses API response:', data);

      if (data.success === false) {
        throw new Error(data.error || 'Unable to load businesses');
      }

      if (data.businesses && Array.isArray(data.businesses)) {
        setBusinesses(data.businesses);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
        console.log(`✅ Loaded ${data.businesses.length} businesses`);
      } else {
        console.warn('⚠️ No businesses array in response');
        setBusinesses([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('❌ Error fetching businesses:', error);
      setError('Unable to load businesses at the moment. Please try again later.');
      setBusinesses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBusinesses(page, 12, selectedCategory, searchQuery, selectedLocation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category change from sidebar
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchBusinesses(1, 12, category, searchQuery, selectedLocation);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBusinesses(1, 12, selectedCategory, searchQuery, selectedLocation);
  };

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage(1);
    fetchBusinesses(1, 12, selectedCategory, searchQuery, location);
  };

  // Handle real-time search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchBusinesses(1, 12, selectedCategory, searchQuery, selectedLocation);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle Enter key in search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Handle filter changes from BusinessSidebarFilters
  const handleFilterChange = (filters: any) => {
    if (filters.category) {
      handleCategoryChange(filters.category);
    }
  };

  // Convert business data to stay data format for compatibility
  const convertBusinessToStayData = (business: BusinessDataType) => {
    const primaryPhoto = business.photos.find(photo => photo.isPrimary) || business.photos[0];
    const totalReviews = business.reviews.length;
    const averageRating = business.averageRating ||
      (business.reviews.length > 0
        ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
        : 0);

    const author = {
      id: business.id,
      firstName: business.name.split(' ')[0] || business.name,
      lastName: business.name.split(' ').slice(1).join(' ') || "",
      displayName: business.name,
      avatar: primaryPhoto?.url || logoMobile,
      bgImage: primaryPhoto?.url || logoMobile,
      email: business.email,
      count: totalReviews,
      desc: business.description || `Professional ${business.category.name} services`,
      jobName: business.category?.name || "Business Owner",
      href: `/listing-stay-detail/${business.slug}` as any,
      starRating: averageRating,
    };

    const listingCategory = {
      id: business.category?.id || business.category?.name || "business",
      name: business.category?.name || "Business",
      href: `/category/${business.category?.slug || (business.category?.name || "business").toLowerCase()}` as any,
      thumbnail: primaryPhoto?.url || logoMobile,
      count: 0,
      desc: business.description || `Find the best ${business.category.name} services in your area`,
      color: "blue" as "pink" | "red" | "gray" | "green" | "yellow" | "blue" | "indigo" | "purple",
      taxonomy: "category" as "category" | "tag",
      listingType: "stay" as "stay" | "experiences" | "car",
    };

    const getMapCoordinates = () => {
      if (business.latitude && business.longitude) {
        return {
          lat: business.latitude,
          lng: business.longitude,
        };
      }
      return {
        lat: -24.6282,
        lng: 25.9231,
      };
    };

    return {
      id: business.id,
      author: author,
      date: business.createdAt || new Date().toISOString(),
      href: `/listing-stay-detail/${business.slug}` as any,
      title: business.isBranch && business.branchName ? `${business.name} - ${business.branchName}` : business.name,
      featuredImage: primaryPhoto?.url || logoMobile,
      commentCount: totalReviews,
      viewCount: business.viewCount || 0,
      address: business.address || `${business.city}, ${business.country}`,
      reviewStart: Math.round(averageRating * 2) / 2,
      reviewCount: totalReviews,
      like: false,
      galleryImgs: business.photos.length > 0
        ? business.photos.map(photo => photo.url)
        : [logoMobile],
      price: "",
      listingCategory: listingCategory,
      maxGuests: 0,
      bedrooms: 0,
      bathrooms: 0,
      saleOff: null,
      isAds: business.featured || false,
      map: getMapCoordinates(),
    };
  };

  // Initialize from URL parameters
  useEffect(() => {
    const category = urlCategory || "";
    const search = urlSearch || "";
    const location = urlLocation || "";

    setSelectedCategory(category);
    setSearchQuery(search);
    setSelectedLocation(location);

    fetchBusinesses(1, 12, category, search, location);
  }, [urlCategory, urlSearch, urlLocation]);

  // Get page title based on search criteria
  const getPageTitle = () => {
    if (searchQuery) {
      return `Results for "${searchQuery}"`;
    }
    if (selectedCategory) {
      return `${selectedCategory} in Namibia`;
    }
    if (selectedLocation) {
      return `Businesses in ${selectedLocation}`;
    }
    return "Namibia Business Directory";
  };

  // Get page description based on search criteria and count
  const getPageDescription = () => {
    if (loading) {
      return "Loading businesses...";
    }

    let description = "";
    if (searchQuery) {
      description += `Search: "${searchQuery}"`;
    }
    if (selectedCategory) {
      if (description) description += " • ";
      description += `Category: ${selectedCategory}`;
    }
    if (selectedLocation) {
      if (description) description += " • ";
      description += `Location: ${selectedLocation}`;
    }

    if (description) {
      return `${description} • Found ${totalCount} businesses`;
    }

    return `Discover ${totalCount} businesses across Namibia. Use filters to refine your search.`;
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLocation("");
    setCurrentPage(1);
    fetchBusinesses(1, 12);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedLocation;

  return (
    <section
      className={`nc-SectionGridFilterCard relative ${className} container mx-auto px-4 py-10`}
      data-nc-id="SectionGridFilterCard"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {getPageTitle()}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {getPageDescription()}
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            className="inline-flex items-center px-4 py-2 rounded-full text-white shadow-md hover:bg-[#1fb4a9] transition lg:hidden"
            style={{ backgroundColor: '#27bcc0' }}
            onClick={() => setShowMobileFilters(true)}
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h18M3 12h18M3 20h18"
              />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#e6f7f7', borderColor: '#27bcc0' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#1a5c5a' }}>
                Active Filters
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {searchQuery && (
                  <span className="px-3 py-1 bg-white rounded-full text-sm border" style={{ borderColor: '#27bcc0', color: '#1a5c5a' }}>
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-3 py-1 bg-white rounded-full text-sm border" style={{ borderColor: '#27bcc0', color: '#1a5c5a' }}>
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedLocation && (
                  <span className="px-3 py-1 bg-white rounded-full text-sm border" style={{ borderColor: '#27bcc0', color: '#1a5c5a' }}>
                    Location: {selectedLocation}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={clearAllFilters}
              className="font-medium hover:underline"
              style={{ color: '#27bcc0' }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block w-full lg:w-1/4 flex-shrink-0 sticky top-20 h-fit">
          <BusinessSidebarFilters
            onFilter={handleFilterChange}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-xs mx-auto p-6 relative animate-fadeInUp">
              <button
                className="absolute top-3 right-3 text-neutral-500 hover:text-primary-600 text-2xl"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
              >
                &times;
              </button>
              <BusinessSidebarFilters
                onFilter={handleFilterChange}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        )}

        {/* Business Cards Grid */}
        <div className="w-full lg:w-3/4">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-neutral-700 h-64 rounded-2xl mb-4"></div>
                  <div className="bg-gray-300 dark:bg-neutral-700 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-300 dark:bg-neutral-700 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 text-neutral-400 dark:text-neutral-600">
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Unable to Load Businesses
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto text-lg">
                {error}
              </p>
              <button
                onClick={() => fetchBusinesses(currentPage, 12, selectedCategory, searchQuery, selectedLocation)}
                className="px-6 py-3 text-white rounded-xl transition-colors"
                style={{ backgroundColor: '#27bcc0' }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Success State */}
          {!loading && !error && (
            <>
              {businesses.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 text-neutral-400 dark:text-neutral-600">
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                    {(() => {
                      let what = "businesses";
                      if (selectedCategory && selectedCategory !== "All") {
                        what = selectedCategory;
                      } else if (searchQuery) {
                        what = searchQuery;
                      }

                      let where = "";
                      if (selectedLocation) {
                        where = ` in ${selectedLocation}`;
                      }

                      return `No ${what}${where} Registered yet`;
                    })()}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto text-lg">
                    Please try adjusting your search criteria or check back later.
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 text-white rounded-xl transition-colors"
                      style={{ backgroundColor: '#27bcc0' }}
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {businesses.map((business) => {
                      const stayData = convertBusinessToStayData(business);
                      return <StayCard2 key={business.id} data={stayData} businessHours={business.businessHours} />;
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex mt-16 justify-center items-center">
                      <Pagination />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionGridFilterCard;
