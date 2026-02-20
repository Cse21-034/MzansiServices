"use client";

import React, { FC, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/Checkbox";
import Pagination from "@/shared/Pagination";
import TabFilters from "./TabFilters";
const logoMobile = "/images/namibia-logo/squarelogo.PNG";
import Heading2 from "@/shared/Heading2";
import StayCard2 from "@/components/StayCard2";
import { useSearchParams, useRouter } from "next/navigation";
import StayCard from "@/components/StayCard";
import { formatFullAddress, safeToString } from "@/utils/formatAddress";

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

export interface SectionGridHasMapProps {}

const SectionGridHasMap: FC<SectionGridHasMapProps> = () => {
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);
  const [businesses, setBusinesses] = useState<BusinessDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryCounts, setCategoryCounts] = useState<{[key: string]: number}>({});
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get('category');

  // Custom Leaflet icon
  const customIcon = new L.Icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Geocoding function using Nominatim
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    // Add a basic check for obviously invalid addresses
    if (!address) {
      console.warn("Skipping geocoding: address is empty");
      return null;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return [parseFloat(lat), parseFloat(lon)];
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
    }
    return null;
  };

  // Fetch category counts from API
  const fetchCategoryCounts = async () => {
    try {
      console.log('🔄 Fetching category counts from API...');
      const res = await fetch('/api/businesses/category-counts', { cache: 'no-store' });
      
      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📊 Category counts API response:', data);
      
      if (data.success && data.categoryCounts) {
        setCategoryCounts(data.categoryCounts);
        console.log('✅ Category counts set successfully:', data.categoryCounts);
      } else {
        console.warn('⚠️ No category counts data in response');
        setCategoryCounts({});
      }
    } catch (error) {
      console.error('❌ Error fetching category counts:', error);
      setCategoryCounts({});
    }
  };

  // Fetch real business data from API
  const fetchBusinesses = async (page: number = 1, limit: number = 12, category?: string): Promise<BusinessDataType[]> => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/businesses?limit=${limit}&offset=${(page - 1) * limit}`;
      if (category && category !== "All") {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      console.log('🔄 Fetching businesses from:', url);
      const res = await fetch(url, { cache: 'no-store' });
      
      if (!res.ok) {
        throw new Error(`Failed to load businesses: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📊 Businesses API response:', data);
      
      if (data.success === false) {
        throw new Error(data.error || 'Unable to load businesses');
      }
      
      if (data.businesses && Array.isArray(data.businesses)) {
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || data.businesses.length);
        console.log(`✅ Loaded ${data.businesses.length} businesses, total: ${data.pagination?.total}`);
        return data.businesses;
      } else {
        console.warn('⚠️ No businesses array in response');
        setTotalCount(0);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching businesses:', error);
      setError('Unable to load businesses at the moment. Please try again later.');
      setTotalCount(0);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBusinesses(page, 12, selectedCategory).then(geocodedBusinesses => setBusinesses(geocodedBusinesses));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    
    // Update URL
    if (category) {
      router.push(`/listing-stay-map?category=${encodeURIComponent(category)}`);
    } else {
      router.push('/listing-stay-map');
    }
    
    fetchBusinesses(1, 12, category).then(geocodedBusinesses => setBusinesses(geocodedBusinesses));
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

    const displayAddress = business.address ? safeToString(business.address) : formatFullAddress("", business.city, business.country);

    return {
      id: business.id,
      author: author,
      date: business.createdAt || new Date().toISOString(),
      href: `/listing-stay-detail/${business.slug}` as any,
      title: business.name,
      featuredImage: primaryPhoto?.url || logoMobile,
      commentCount: totalReviews,
      viewCount: business.viewCount || 0,
      address: displayAddress, // Use the cleaned address
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

  useEffect(() => {
    const loadBusinessesAndGeocode = async () => {
      // Set initial category from URL
      const fetchedBusinesses = await fetchBusinesses(currentPage, 12, urlCategory || selectedCategory);
      
      const geocodedBusinesses = await Promise.all(
        fetchedBusinesses.map(async (business) => {
          if (!business.latitude || !business.longitude) {
            const fullAddress = `${business.address || ''}, ${business.city}, ${business.country}`;
            const coords = await geocodeAddress(fullAddress);
            if (coords) {
              return { ...business, latitude: coords[0], longitude: coords[1] };
            }
          }
          return business;
        })
      );
      setBusinesses(geocodedBusinesses);
    };

    loadBusinessesAndGeocode();
    fetchCategoryCounts();
  }, [urlCategory, currentPage, selectedCategory]);

  const getPageTitle = () => {
    if (selectedCategory) {
      return `${selectedCategory} in Your Area`;
    }
    return "Discover Local Businesses";
  };

  const getPageDescription = () => {
    if (loading) {
      return "Loading businesses...";
    }
    
    if (selectedCategory) {
      const categoryCount = categoryCounts[selectedCategory];
      if (categoryCount !== undefined) {
        return `Discover ${categoryCount} ${selectedCategory.toLowerCase()} in your area`;
      }
      return `Discover ${selectedCategory.toLowerCase()} in your area`;
    }
    
    return `Discover ${totalCount} local businesses in your area`;
  };

  const getDefaultCenter = (): [number, number] => {
    const validBusinesses = businesses.filter(b => b.latitude && b.longitude);
    if (validBusinesses.length > 0) {
      const totalLat = validBusinesses.reduce((sum, b) => sum + b.latitude!, 0);
      const totalLng = validBusinesses.reduce((sum, b) => sum + b.longitude!, 0);
      return [totalLat / validBusinesses.length, totalLng / validBusinesses.length];
    }
    return [-22.5597, 17.0832]; // Default to Windhoek if no valid business coordinates
  };

  // Get display count for current category
  const getDisplayCount = () => {
    if (selectedCategory) {
      return categoryCounts[selectedCategory] || totalCount;
    }
    return totalCount;
  };

  // Show loading state
  if (loading && businesses.length === 0) {
    return (
      <div className="relative flex min-h-screen">
        {/* CARDS LOADING */}
        <div className="min-h-screen w-full xl:w-[60%] 2xl:w-[60%] max-w-[1184px] flex-shrink-0 xl:px-8">
          <Heading2 
            heading={getPageTitle()}
            subHeading={getPageDescription()}
          />
          <div className="mb-8 lg:mb-11">
            <TabFilters 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 2xl:gap-x-6 gap-y-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-neutral-700 h-64 rounded-2xl mb-4"></div>
                <div className="bg-gray-300 dark:bg-neutral-700 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-300 dark:bg-neutral-700 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* MAP LOADING */}
        <div className="xl:flex-1 xl:static hidden xl:block">
          <div className="sticky top-0 xl:top-[88px] left-0 w-full h-[calc(100vh-88px)] rounded-md overflow-hidden bg-gray-300 dark:bg-neutral-700"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && businesses.length === 0) {
    return (
      <div className="relative flex min-h-screen">
        <div className="min-h-screen w-full xl:w-[60%] 2xl:w-[60%] max-w-[1184px] flex-shrink-0 xl:px-8">
          <Heading2 
            heading={getPageTitle()}
            subHeading="We're having trouble loading businesses right now"
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
            <button
              onClick={() => fetchBusinesses(currentPage, 12, selectedCategory)}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative flex min-h-screen">
        {/* BUSINESS CARDS */}
        <div className="min-h-screen w-full xl:w-[60%] 2xl:w-[60%] max-w-[1184px] flex-shrink-0 xl:px-8">
          <Heading2 
            heading={getPageTitle()}
            subHeading={getPageDescription()}
          />
          <div className="mb-8 lg:mb-11">
            <TabFilters 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          {businesses.length === 0 && !loading ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 text-neutral-400 dark:text-neutral-600">
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {selectedCategory ? `No ${selectedCategory} Found` : "No Businesses Available"}
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto text-lg">
                {selectedCategory 
                  ? `We couldn't find any ${selectedCategory.toLowerCase()} in your area. Try browsing other categories.` 
                  : "No businesses are available at the moment. Please check back later for new listings."}
              </p>
            </div>
          ) : (
            <>
              {/* Real Business Count Display */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      {selectedCategory ? `${selectedCategory} Businesses` : "All Businesses"}
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      {selectedCategory 
                        ? `Showing ${businesses.length} of ${getDisplayCount()} ${selectedCategory.toLowerCase()} in your area`
                        : `Showing ${businesses.length} of ${totalCount} total businesses in your area`
                      }
                    </p>
                  </div>
                  {selectedCategory && categoryCounts[selectedCategory] !== undefined && (
                    <div className="mt-2 sm:mt-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {categoryCounts[selectedCategory]} total in this category
                      </span>
                    </div>
                  )}
                </div>
                
               
                
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 2xl:gap-x-6 gap-y-8">
                {businesses.map((business) => {
                  const stayData = convertBusinessToStayData(business);
                  return (
                    <div
                      key={business.id}
                      onMouseEnter={() => setCurrentHoverID((_) => business.id)}
                      onMouseLeave={() => setCurrentHoverID((_) => -1)}
                    >
                      <StayCard2 data={stayData} />
                    </div>
                  );
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
        </div>

        {/* SHOW MAP BUTTON FOR MOBILE */}
        {!showFullMapFixed && (
          <div
            className={`flex xl:hidden items-center justify-center fixed bottom-16 md:bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-neutral-900 text-white shadow-2xl rounded-full z-30 space-x-3 text-sm cursor-pointer`}
            onClick={() => setShowFullMapFixed(true)}
          >
            <i className="text-lg las la-map"></i>
            <span>Show map</span>
          </div>
        )}

        {/* MAP */}
        <div
          className={`xl:flex-1 xl:static xl:block ${
            showFullMapFixed ? "fixed inset-0 z-50" : "hidden"
          }`}
        >
          {showFullMapFixed && (
            <ButtonClose
              onClick={() => setShowFullMapFixed(false)}
              className="bg-white absolute z-50 left-3 top-3 shadow-lg rounded-xl w-10 h-10"
            />
          )}

          <div className="fixed xl:sticky top-0 xl:top-[88px] left-0 w-full h-full xl:h-[calc(100vh-88px)] rounded-md overflow-hidden">
            <div className="absolute bottom-5 left-3 lg:bottom-auto lg:top-2.5 lg:left-1/2 transform lg:-translate-x-1/2 py-2 px-4 bg-white dark:bg-neutral-800 shadow-xl z-10 rounded-2xl min-w-max">
              <Checkbox
                className="text-xs xl:text-sm"
                name="xx"
                label="Search as I move the map"
              />
            </div>
            
            {businesses.length > 0 ? (
              <MapContainer center={getDefaultCenter()} zoom={12} scrollWheelZoom={false} className="w-full h-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {businesses.map((business) => (
                  business.latitude && business.longitude ? (
                    <Marker
                      key={business.id}
                      position={[business.latitude, business.longitude]}
                      icon={customIcon}
                    >
                      <Popup>
                        <div className="w-64">
                          <StayCard size="small" data={convertBusinessToStayData(business)} className="shadow-2xl" />
                        </div>
                      </Popup>
                    </Marker>
                  ) : null
                ))}
              </MapContainer>
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 text-neutral-400">
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400">No businesses to display on map</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionGridHasMap;
