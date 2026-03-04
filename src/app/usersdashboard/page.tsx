"use client";

import React, { FC, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import type { DashboardUser, ReviewWithBusiness, FavoriteWithBusiness, BookingWithBusiness } from "./types";
import type { Notification } from "@prisma/client";
import { 
  UserIcon,
  StarIcon,
  HeartIcon,
  EyeIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Badge from "@/shared/Badge";
import Avatar from "@/shared/Avatar";
import StartRating from "@/components/StartRating";
import UserNav from "@/components/UserNav";

export interface UserDashboardPageProps {}

// Mock data for demonstration

const mockReviews = [
  {
    id: 1,
    business: "Sprint Couriers & Logistics",
    rating: 5,
    comment: "Excellent service! My package arrived faster than expected. Highly recommended for urgent deliveries.",
    date: "2024-01-15",
    likes: 12,
    businessCategory: "Logistics",
    businessLocation: "Windhoek"
  },
  {
    id: 2,
    business: "Namibia Tech Solutions",
    rating: 4,
    comment: "Good technical support, but had to wait a bit longer for the on-site service.",
    date: "2024-01-08",
    likes: 5,
    businessCategory: "Technology",
    businessLocation: "Walvis Bay"
  },
  {
    id: 3,
    business: "Masa Square Hotel",
    rating: 3,
    comment: "Beautiful hotel but the room service was slow. Great location though.",
    date: "2023-12-20",
    likes: 3,
    businessCategory: "Hospitality",
    businessLocation: "Windhoek"
  }
];

const mockFavorites = [
  {
    id: 1,
    business: "Sprint Couriers & Logistics",
    category: "Logistics & Courier",
    location: "Windhoek",
    rating: 4.8,
    reviews: 127,
    isOpen: true,
    lastVisited: "2024-01-10"
  },
  {
    id: 2,
    business: "Fresh Farms Namibia",
    category: "Agriculture",
    location: "Rundu",
    rating: 4.2,
    reviews: 45,
    isOpen: true,
    lastVisited: "2024-01-05"
  },
  {
    id: 3,
    business: "BuildPro Construction",
    category: "Construction",
    location: "Windhoek",
    rating: 3.8,
    reviews: 23,
    isOpen: false,
    lastVisited: "2023-12-15"
  }
];

const mockRecentActivity = [
  {
    id: 1,
    type: "review",
    action: "You reviewed Sprint Couriers",
    time: "2 days ago",
    business: "Sprint Couriers & Logistics"
  },
  {
    id: 2,
    type: "favorite",
    action: "You added Fresh Farms to favorites",
    time: "1 week ago",
    business: "Fresh Farms Namibia"
  },
  {
    id: 3,
    type: "booking",
    action: "You booked a service with Namibia Tech",
    time: "2 weeks ago",
    business: "Namibia Tech Solutions"
  },
  {
    id: 4,
    type: "photo",
    action: "You uploaded photos for Masa Square Hotel",
    time: "3 weeks ago",
    business: "Masa Square Hotel"
  }
];

const UserDashboardPage: FC<UserDashboardPageProps> = ({}) => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || "overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Property listings state
  type PropertyListing = {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt?: string;
  };
  const [propertyListings, setPropertyListings] = useState<PropertyListing[]>([]);
  
  const [dashboardData, setDashboardData] = useState<{
    user: DashboardUser;
    stats: {
      totalReviews: number;
      totalFavorites: number;
      totalBookings: number;
      averageRating: number;
      totalLikes: number;
    };
    recentActivity: {
      reviews: ReviewWithBusiness[];
      favorites: FavoriteWithBusiness[];
      bookings: BookingWithBusiness[];
      notifications: Notification[];
    };
    allData: {
      reviews: ReviewWithBusiness[];
      favorites: FavoriteWithBusiness[];
      bookings: BookingWithBusiness[];
      notifications: Notification[];
    };
  } | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/user/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
        
        // Fetch user's property listings
        const listingsResponse = await fetch('/api/user/listings');
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json();
          setPropertyListings(listingsData.listings || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  // Update active tab when search params change
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // API interaction handlers
  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/user/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Refresh dashboard data
      const updatedData = await fetch('/api/user/dashboard').then(res => res.json());
      setDashboardData(updatedData);
    } catch (err) {
      console.error('Error deleting review:', err);
      // Show error notification
    }
  };

  const handleRemoveFavorite = async (businessId: string) => {
    try {
      const response = await fetch(`/api/user/favorites?businessId=${businessId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      // Refresh dashboard data
      const updatedData = await fetch('/api/user/dashboard').then(res => res.json());
      setDashboardData(updatedData);
    } catch (err) {
      console.error('Error removing favorite:', err);
      // Show error notification
    }
  };

  const renderOverviewTab = () => {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {dashboardData?.user.name || "User"}! 👋</h2>
              <p className="text-primary-100">
                Thanks for helping others discover great businesses in Namibia.
              </p>
            </div>
            <div className="hidden md:block">
              <Avatar sizeClass="w-20 h-20" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Reviews Written</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{dashboardData?.stats.totalReviews}</p>
                <p className="text-xs text-green-600 font-medium mt-1">+2 this month</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <StarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Average Rating</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{dashboardData?.stats.averageRating.toFixed(1)}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Your contribution</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <CheckBadgeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Favorites</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{dashboardData?.stats.totalFavorites}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Saved businesses</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <HeartIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Review Likes</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{dashboardData?.stats.totalLikes}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Helpful votes</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <EyeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 py-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'review' ? 'bg-blue-500' : 
                    activity.type === 'favorite' ? 'bg-red-500' : 
                    activity.type === 'booking' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {activity.action}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {activity.business} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <ButtonSecondary className="w-full justify-center mt-4">
              View All Activity
            </ButtonSecondary>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <ButtonPrimary className="w-full justify-center" onClick={() => setActiveTab('reviews')}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Write a Review
              </ButtonPrimary>
              <ButtonSecondary className="w-full justify-center" onClick={() => setActiveTab('favorites')}>
                <HeartIcon className="w-4 h-4 mr-2" />
                View Favorites
              </ButtonSecondary>
              <ButtonSecondary className="w-full justify-center" onClick={() => setActiveTab('profile')}>
                <UserIcon className="w-4 h-4 mr-2" />
                Edit Profile
              </ButtonSecondary>
              <ButtonSecondary className="w-full justify-center" onClick={() => setActiveTab('reviews')}>
                <StarIcon className="w-4 h-4 mr-2" />
                Review History
              </ButtonSecondary>
            </div>
          </div>
        </div>

        {/* Recent Reviews Preview */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Your Recent Reviews
            </h3>
            <ButtonSecondary>
              View All
            </ButtonSecondary>
          </div>
          <div className="space-y-4">
            {dashboardData?.recentActivity.reviews.slice(0, 2).map((review: ReviewWithBusiness) => (
              <div key={review.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {review.business?.name}
                      </h4>
                      <StartRating point={review.rating} />
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
                      {review.comment}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-neutral-500">
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{review.likes} likes</span>
                      <span>•</span>
                      <span>{review.business?.category?.name}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-4"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderReviewsTab = () => {
    return (
      <div className="space-y-6">
        {/* Reviews Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                My Reviews
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Manage and view all your business reviews
              </p>
            </div>
            <ButtonPrimary className="mt-4 lg:mt-0">
              <PlusIcon className="w-4 h-4 mr-2" />
              Write New Review
            </ButtonPrimary>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {dashboardData?.allData.reviews.map((review: ReviewWithBusiness) => (
            <div key={review.id} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <BuildingStorefrontIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {review.business?.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-neutral-500">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{review.business?.city}</span>
                        <span>•</span>
                        <span>{review.business?.category?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <StartRating point={review.rating} />
                    <span className="text-sm text-neutral-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                    {review.comment}
                  </p>

                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                      <HeartIcon className="w-4 h-4" />
                      <span>{review.likes} helpful</span>
                    </button>
                    <button className="flex items-center space-x-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      <span>View Business</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFavoritesTab = () => {
    return (
      <div className="space-y-6">
        {/* Favorites Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                My Favorites
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Your saved businesses for quick access
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <ButtonSecondary>
                Sort by: Recent
              </ButtonSecondary>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData?.allData.favorites.map((favorite: FavoriteWithBusiness) => (
            <div key={favorite.id} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <BuildingStorefrontIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <button 
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <HeartIcon className="w-5 h-5 fill-current" />
                </button>
              </div>

              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {favorite.business?.name}
              </h3>

              <div className="flex items-center space-x-2 text-sm text-neutral-500 mb-3">
                <MapPinIcon className="w-4 h-4" />
                <span>{favorite.business?.city}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <StartRating point={favorite.business?.averageRating || 0} />
                  <span className="text-sm text-neutral-500">({favorite.business?.reviewCount || 0})</span>
                </div>
                {(() => {
                  const today = new Date().getDay();
                  const todayHours = favorite.business.businessHours?.find(h => h.dayOfWeek === today);
                  const isOpen = todayHours ? !todayHours.isClosed : false;
                  return (
                    <Badge 
                      name={isOpen ? "Open" : "Closed"}
                      color={isOpen ? "green" : "red"}
                    />
                  );
                })()}
              </div>

              <div className="text-xs text-neutral-500">
                {/* Last visited: {new Date(favorite.lastVisited).toLocaleDateString()} */}
              </div>

              <ButtonSecondary className="w-full justify-center mt-4">
                View Business
              </ButtonSecondary>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderListingsTab = () => {
    if (propertyListings.length === 0) {
      return (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-2xl">
          <BuildingStorefrontIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">No Property Listings Yet</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">Start by creating your first property listing</p>
          <a href="/add-listing/1">
            <ButtonPrimary>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create New Listing
            </ButtonPrimary>
          </a>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">My Property Listings</h2>
          <a href="/add-listing/1">
            <ButtonPrimary>
              <PlusIcon className="w-4 h-4 mr-2" />
              New Listing
            </ButtonPrimary>
          </a>
        </div>

        {propertyListings.map((listing) => (
          <div key={listing.id} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{listing.title}</h3>
                  <Badge 
                    name={listing.status.charAt(0).toUpperCase() + listing.status.slice(1).toLowerCase()}
                    color={
                      listing.status === 'APPROVED' ? 'green' :
                      listing.status === 'PENDING' ? 'yellow' :
                      listing.status === 'REJECTED' ? 'red' :
                      listing.status === 'SUSPENDED' ? 'orange' : 'gray'
                    }
                  />
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">{listing.description}</p>
                <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                  Created: {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
                </div>

                {listing.status === 'REJECTED' && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      <strong>Rejection Reason:</strong> {(listing as any).rejectionReason || 'Not specified'}
                    </p>
                  </div>
                )}

                {listing.status === 'PENDING' && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Your listing is under review by our admin team. We'll notify you once it's approved.
                    </p>
                  </div>
                )}

                {listing.status === 'APPROVED' && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      ✓ Your listing is live and visible to all users!
                    </p>
                  </div>
                )}
              </div>

              <div className="ml-4 flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit listing">
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="View listing">
                  <EyeIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div className="space-y-6">
        {/* Settings Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Account Settings
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Full Name
              </label>
              <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-neutral-700 dark:text-neutral-300">
                {session?.user?.name || 'Not set'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <p className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-neutral-700 dark:text-neutral-300">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Security
          </h3>
          <ButtonPrimary className="w-full justify-center">
            Change Password
          </ButtonPrimary>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">Email Notifications</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Receive email updates about your reviews and activity</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">Marketing Emails</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Receive promotional content and updates</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-UserDashboardPage bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      {/* User Navigation Header */}
      <UserNav />

      {/* Main Content */}
      <main className="lg:container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            My Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
            Manage your reviews, favorites, and profile
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', name: 'Overview', icon: UserIcon },
                { id: 'reviews', name: 'My Reviews', icon: StarIcon },
                { id: 'favorites', name: 'Favorites', icon: HeartIcon },
                { id: 'listings', name: 'My Listings', icon: BuildingStorefrontIcon },
                { id: 'bookings', name: 'Bookings', icon: CalendarIcon },
                { id: 'profile', name: 'Profile', icon: UserIcon },
                { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'reviews' && renderReviewsTab()}
          {activeTab === 'favorites' && renderFavoritesTab()}
          {activeTab === 'listings' && renderListingsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
          {(activeTab === 'bookings' || activeTab === 'profile') && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'bookings' && <CalendarIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />}
                {activeTab === 'profile' && <UserIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {activeTab === 'bookings' ? 'Booking History' : 'Profile Management'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {activeTab === 'bookings' 
                  ? 'View and manage your service bookings and appointments' 
                  : 'Update your personal information and preferences'
                }
              </p>
              <ButtonPrimary>
                {activeTab === 'bookings' ? 'View Bookings' : 'Edit Profile'}
              </ButtonPrimary>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;