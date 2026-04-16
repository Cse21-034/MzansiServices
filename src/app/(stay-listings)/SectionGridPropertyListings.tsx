"use client";
import React, { FC, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PropertyCard from "@/components/PropertyCard";

export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  beds?: number;
  baths?: number;
  pricePerNight?: number;
  city: string;
  address: string;
  amenities?: string[];
  createdAt: string;
  business?: {
    id: string;
    name: string;
    slug: string;
    email: string;
    phone: string;
    location: string;
  };
}

export interface SectionGridPropertyListingsProps {
  className?: string;
}

const SectionGridPropertyListings: FC<SectionGridPropertyListingsProps> = ({
  className = "",
}) => {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch property listings
  const fetchProperties = async (page: number = 1, limit: number = 12, city?: string, search?: string) => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/property-listings?page=${page}&limit=${limit}`;
      if (city && city.trim() !== "") {
        url += `&city=${encodeURIComponent(city.trim())}`;
      }
      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      const res = await fetch(url, { cache: 'no-store' });

      if (!res.ok) {
        throw new Error('Unable to load property listings');
      }

      const data = await res.json();

      if (data.success !== false && data.data && Array.isArray(data.data)) {
        setProperties(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      } else {
        setProperties([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching property listings:', error);
      setError('Unable to load property listings at the moment. Please try again later.');
      setProperties([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1, 12, selectedCity, searchQuery);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProperties(page, 12, selectedCity, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProperties(1, 12, selectedCity, searchQuery);
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Property Listings
        </h1>
        <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Discover premium rental properties and accommodations across Namibia
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 mb-8 shadow-lg border border-neutral-200 dark:border-neutral-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search properties
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
              />
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
                fetchProperties(1, 12, e.target.value, searchQuery);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
            >
              <option value="">All Cities</option>
              <option value="Johannesburg">Johannesburg</option>
              <option value="Cape Town">Cape Town</option>
              <option value="Durban">Durban</option>
              <option value="Pretoria">Pretoria</option>
              <option value="Port Elizabeth">Port Elizabeth</option>
              <option value="Bellville">Bellville</option>
              <option value="Sandton">Sandton</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12a9 9 0 109 9m0 0a9 9 0 010-18" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No properties found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your search filters or check back later for more properties.
          </p>
        </div>
      ) : (
        <>
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-neutral-700"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === currentPage
                          ? "bg-primary-600 text-white"
                          : "bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-neutral-700"
                >
                  Next
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages} • Showing {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, totalCount)} of {totalCount} properties
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SectionGridPropertyListings;
