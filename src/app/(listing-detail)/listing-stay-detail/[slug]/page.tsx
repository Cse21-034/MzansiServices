"use client";

import React, { FC, Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ReviewForm from "@/components/ReviewForm";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightIcon, Squares2X2Icon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import CommentListing from "@/components/CommentListing";
import FiveStartIconForRate from "@/components/FiveStartIconForRate";
import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonClose from "@/shared/ButtonClose";
import Input from "@/shared/Input";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import Image from "next/image";
import { usePathname, useRouter, useParams } from "next/navigation";
import MembershipsDisplay from "@/components/MembershipsDisplay";
import TopStoriesBanners from "@/components/TopStoriesBanners";
import VerticalAdBanners from "@/components/VerticalAdBanners";
import { formatLocation, formatFullAddress, safeToString, cleanAddress } from "@/utils/formatAddress";
const logoMobile = "/images/namibia-logo/squarelogo.PNG";
import { Amenities_demos, PHOTOS } from "../constant";
import { Route } from "next";
import LeafletMap from "@/components/LeafletMap";

// Define the business data interface
interface BusinessDataType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: {
    id: string;
    name: string;
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
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
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
  // Membership fields
  membershipCardImage?: string | null;
  membershipNumber?: string | null;
  membershipStatus?: "NONE" | "ACTIVE" | "EXPIRED" | "PENDING" | "REJECTED";
  membershipType?: string | null;
  membershipExpiryDate?: string | null;
  membershipProvider?: string | null;
  membershipUploadedAt?: string | null;
  // Multiple memberships
  memberships?: Array<{
    id: string;
    issuerName: string;
    membershipNumber: string;
    membershipType?: string;
    cardImage?: string;
    expiryDate?: string;
    status: "NONE" | "ACTIVE" | "EXPIRED" | "PENDING" | "REJECTED";
    uploadedAt: string;
  }>;
}

// Geocoding function using Nominatim
const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
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

export interface ListingStayDetailPageProps { }

const ListingStayDetailPage: FC<ListingStayDetailPageProps> = ({ }) => {
  let [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const [business, setBusiness] = useState<BusinessDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<BusinessDataType['reviews']>([]);
  const [memberships, setMemberships] = useState<BusinessDataType['memberships']>([]);

  const thisPathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const businessSlug = params.slug as string;
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAndGeocodeBusiness = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/businesses/${businessSlug}`);

        if (!res.ok) {
          throw new Error('Business not found');
        }

        const data = await res.json();

        if (data.success && data.business) {
          let fetchedBusiness: BusinessDataType = data.business;

          if (!fetchedBusiness.latitude || !fetchedBusiness.longitude) {
            const fullAddress = `${fetchedBusiness.address || ''}, ${fetchedBusiness.city}, ${fetchedBusiness.country}`;
            const coords = await geocodeAddress(fullAddress);
            if (coords) {
              fetchedBusiness = { ...fetchedBusiness, latitude: coords[0], longitude: coords[1] };
            }
          }
          setBusiness(fetchedBusiness);
          setReviews(fetchedBusiness.reviews);

          // Fetch memberships
          try {
            const membershipsRes = await fetch(
              `/api/business/memberships?businessId=${fetchedBusiness.id}`
            );
            if (membershipsRes.ok) {
              const membershipsData = await membershipsRes.json();
              setMemberships(membershipsData);
            }
          } catch (err) {
            console.error('Error fetching memberships:', err);
          }
        } else {
          throw new Error('Business data not available');
        }
      } catch (error) {
        console.error('Error fetching business:', error);
        setError(error instanceof Error ? error.message : 'Failed to load business');
      } finally {
        setLoading(false);
      }
    };

    if (businessSlug) {
      fetchAndGeocodeBusiness();
    }
  }, [businessSlug]);

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }

  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  const handleReviewSubmit = (newReview: any) => {
    setReviews([newReview, ...reviews]);
  };

  const userHasReviewed = reviews.some(review => review.user.id === session?.user?.id);

  const formatBusinessHours = () => {
    if (!business?.businessHours?.length) {
      return [
        { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM", open: true },
        { day: "Saturday", hours: "8:30AM - 2:00 PM", open: true },
        { day: "Sunday", hours: "Closed", open: false },
      ];
    }

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return business.businessHours.map(hour => ({
      day: dayNames[hour.dayOfWeek],
      hours: hour.isClosed ? "Closed" : `${hour.openTime} - ${hour.closeTime}`,
      open: !hour.isClosed
    }));
  };

  if (loading) {
    return (
      <div className="nc-ListingStayDetailPage">
        <div className="container py-16">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-64 rounded-xl mb-8"></div>
            <div className="space-y-4">
              <div className="bg-gray-300 h-8 rounded w-3/4"></div>
              <div className="bg-gray-300 h-4 rounded w-1/2"></div>
              <div className="bg-gray-300 h-4 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="nc-ListingStayDetailPage">
        <div className="container py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 text-neutral-400">
            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Business Not Found
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            {error || "The business you're looking for doesn't exist or is no longer available."}
          </p>
          <ButtonPrimary onClick={() => router.push('/')}>
            Back to Home
          </ButtonPrimary>
        </div>
      </div>
    );
  }

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {business?.verified && <Badge name="Verified Business" color="green" />}
            {business?.featured && <Badge name="Featured" color="blue" />}
          </div>
          <LikeSaveBtns />
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {business?.name}
        </h2>

        {/* 3 */}
        <div className="flex items-center space-x-4">
          <StartRating point={business?.averageRating || 0} reviewCount={business?.reviewCount || 0} />
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1"> {formatLocation(business?.city, business?.country)}</span>
          </span>
        </div>

        {/* 4 - Action Buttons for ALL devices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
          <ButtonPrimary
            className="w-full justify-center py-3"
            onClick={() => window.open(`tel:${business?.phone}`)}
          >
            <PhoneIcon className="w-5 h-5 mr-2" />
            Call Now
          </ButtonPrimary>
          <ButtonSecondary
            className="w-full justify-center py-3"
            onClick={() => window.open(`mailto:${business?.email}`)}
          >
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            Send Email
          </ButtonSecondary>
          <ButtonSecondary
            className="w-full justify-center py-3"
            onClick={() => {
              const addressStr = business?.address ? safeToString(business.address) : "";
              const displayAddress = addressStr || formatFullAddress(business?.city, business?.city, business?.country);
              const address = encodeURIComponent(displayAddress);
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
            }}
          >
            <MapPinIcon className="w-5 h-5 mr-2" />
            Get Directions
          </ButtonSecondary>
          {business?.website && (
            <ButtonSecondary
              className="w-full justify-center py-3"
              onClick={() => window.open(business.website, '_blank')}
            >
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Visit Website
            </ButtonSecondary>
          )}
        </div>
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">About This Business</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-6000 dark:text-neutral-300">
          {business?.description ? (
            <span>{business.description}</span>
          ) : (
            <span>
              {business?.name} is a professional {business?.category?.name?.toLowerCase()} business
              located in {business?.city}, {business?.country}.
              {business?.establishedYear && ` Established in ${business.establishedYear},`}
              we are committed to providing excellent service and quality to our customers.
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderSection3 = () => {
    const servicesToShow = business?.services?.length > 0
      ? business.services.slice(0, 8).map(service => ({ name: service, icon: "la-check" }))
      : [
        { name: "Professional Services", icon: "la-check" },
        { name: "Quality Assurance", icon: "la-check" },
        { name: "Customer Support", icon: "la-check" },
      ];

    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Services Offered</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {business?.category?.name} services and solutions
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {servicesToShow.map((item) => (
            <div key={item.name} className="flex items-center space-x-3">
              <i className={`text-2xl las ${item.icon}`}></i>
              <span className="font-medium">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="w-14 border-b border-neutral-200"></div>
        {(business?.services?.length > 8 || business?.services?.length === 0) && (
          <div>
            <ButtonSecondary onClick={openModalAmenities}>
              View all services
            </ButtonSecondary>
          </div>
        )}
        {renderMotalAmenities()}
      </div>
    );
  };

  const renderMotalAmenities = () => {
    const allServices = business?.services?.length > 0
      ? business.services.map(service => ({ name: service, icon: "la-check" }))
      : [
        { name: "Professional Services", icon: "la-check" },
        { name: "Quality Assurance", icon: "la-check" },
        { name: "Customer Support", icon: "la-check" },
        { name: "Expert Consultation", icon: "la-check" },
        { name: "Custom Solutions", icon: "la-check" },
      ];

    return (
      <Transition appear show={isOpenModalAmenities} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalAmenities}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 h-screen w-full max-w-4xl">
                <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="headlessui-dialog-title-70"
                    >
                      All Services
                    </h3>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalAmenities} />
                    </span>
                  </div>
                  <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {allServices.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8"
                      >
                        <i
                          className={`text-3xl text-neutral-6000 las ${item.icon}`}
                        ></i>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const renderSection4 = () => {
    const businessHours = formatBusinessHours();

    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Business Hours</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Current operating schedule
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="flow-root">
          <div className="text-sm sm:text-base text-neutral-6000 dark:text-neutral-300 -mb-4">
            {businessHours.map((schedule, index) => (
              <div
                key={schedule.day}
                className={`p-4 flex justify-between items-center space-x-4 rounded-lg ${index % 2 === 0 ? "bg-neutral-100 dark:bg-neutral-800" : ""
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-neutral-400" />
                  <span>{schedule.day}</span>
                </div>
                <span className={schedule.open ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {schedule.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSection5 = () => {
    // Safely format the address, filtering out any unwanted content
    const addressStr = business?.address ? safeToString(business.address) : "";
    
    const displayAddress = addressStr || formatFullAddress(business?.city, business?.city, business?.country);

    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full">
              <PhoneIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="text-sm text-neutral-500">Phone Number</div>
              <div className="font-medium">{business?.phone}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full">
              <EnvelopeIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="text-sm text-neutral-500">Email Address</div>
              <div className="font-medium">{business?.email}</div>
            </div>
          </div>

          {business?.website && (
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                <GlobeAltIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div className="text-sm text-neutral-500">Website</div>
                <div className="font-medium">{business.website}</div>
              </div>
            </div>
          )}

          {business?.address && cleanAddress(business.address) && (
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full mt-1">
                <MapPinIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div className="text-sm text-neutral-500">Business Address</div>
                <div className="font-medium">{cleanAddress(displayAddress)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">
          Customer Reviews ({reviews.length} reviews)
        </h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="space-y-5">
          {session && !userHasReviewed && (
            <ReviewForm businessId={business?.id} onReviewSubmit={handleReviewSubmit} />
          )}
          {userHasReviewed && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800">You have already reviewed this business.</p>
            </div>
          )}
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <CommentListing
                key={review.id}
                className="py-8"
                data={{
                  name: review.user.name || '',
                  avatar: review.user.avatar || '',
                  date: review.createdAt,
                  comment: review.comment || '',
                  starPoint: review.rating,
                }}
              />
            ))
          ) : (
            <div className="py-8 text-center text-neutral-500">
              No reviews yet. Be the first to review this business!
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection7 = () => {
    const addressStr = business?.address ? safeToString(business.address) : "";
    const displayAddress = addressStr || formatFullAddress(business?.city, business?.city, business?.country);

    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Location</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {displayAddress}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        <div className="h-96 ring-1 ring-black/10 rounded-xl z-0 overflow-hidden">
          {business?.latitude && business?.longitude ? (
            <LeafletMap
              position={[business.latitude, business.longitude]}
              zoom={13}
              address={displayAddress}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              <p className="text-neutral-500 dark:text-neutral-400">Location not available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection8 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Business Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        <div>
          <h4 className="text-lg font-semibold">Years in Business</h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            {business?.establishedYear
              ? `Established in ${business.establishedYear}, this business has been serving customers for over ${new Date().getFullYear() - business.establishedYear} years with reliable services and exceptional customer service.`
              : 'A trusted local business committed to quality service and customer satisfaction.'
            }
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        <div>
          <h4 className="text-lg font-semibold">Service Areas</h4>
          <div className="mt-3 text-neutral-500 dark:text-neutral-400">
            <ul className="list-disc list-inside space-y-2">
              <li>{business?.city} and surrounding areas</li>
              <li>Nationwide coverage available</li>
              <li>Professional service delivery</li>
              <li>Quality guaranteed</li>
            </ul>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        <div>
          <h4 className="text-lg font-semibold">Business Details</h4>
          <div className="mt-3 text-neutral-500 dark:text-neutral-400">
            <ul className="list-disc list-inside space-y-2">
              <li>Category: {business?.category?.name}</li>
              {business?.employees && <li>Employees: {business.employees}</li>}
              <li>Status: {business?.verified ? 'Verified Business' : 'Unverified'}</li>
              <li>Member since: {new Date(business?.createdAt || '').getFullYear()}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        {/* Quick Info */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Category:</span>
                <span>{business?.category?.name}</span>
              </div>
              {business?.establishedYear && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Established:</span>
                  <span>{business.establishedYear}</span>
                </div>
              )}
              {business?.employees && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Employees:</span>
                  <span>{business.employees}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Rating:</span>
                <span>
                  {business?.averageRating
                    ? `${business.averageRating.toFixed(1)}/5 (${reviews.length} reviews)`
                    : 'No ratings yet'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className={business?.verified ? "text-green-600" : "text-yellow-600"}>
                  {business?.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h3 className="font-semibold text-lg mb-4">Share This Business</h3>
            <div className="flex space-x-3">
              <ButtonCircle size="w-10 h-10">
                <i className="lab la-facebook-f"></i>
              </ButtonCircle>
              <ButtonCircle size="w-10 h-10">
                <i className="lab la-twitter"></i>
              </ButtonCircle>
              <ButtonCircle size="w-10 h-10">
                <i className="lab la-linkedin-in"></i>
              </ButtonCircle>
              <ButtonCircle size="w-10 h-10">
                <i className="lab la-whatsapp"></i>
              </ButtonCircle>
            </div>
          </div>

          {/* Top Stories Banners */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <TopStoriesBanners />
          </div>
        </div>
      </div>
    );
  };

  const businessPhotos = business.photos.length > 0
    ? business.photos.map(photo => photo.url)
    : PHOTOS;

  return (
    <div className="nc-ListingStayDetailPage">
      {/* Back to Home Button */}
      <div className="mb-6 pt-6">
        <ButtonSecondary href="/">
          <ArrowRightIcon className="w-4 h-4 mr-2 rotate-180" />
          Back to Home
        </ButtonSecondary>
      </div>

      {/* HEADER */}
      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
          <div
            className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer aspect-video"
            onClick={handleOpenModalImageGallery}
          >
            <Image
              fill
              className="object-cover rounded-md sm:rounded-xl"
              src={businessPhotos[0] || logoMobile}
              alt={business.name}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
          </div>
          {businessPhotos.filter((_: any, i: number) => i >= 1 && i < 5).map((item: string, index: number) => (
            <div
              key={index}
              className={`relative rounded-md sm:rounded-xl overflow-hidden aspect-square ${index >= 3 ? "hidden sm:block" : ""
                }`}
            >
              <Image
                fill
                className="object-cover rounded-md sm:rounded-xl"
                src={item || logoMobile}
                alt={`${business.name} ${index + 1}`}
                sizes="200px"
              />

              <div
                className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleOpenModalImageGallery}
              />
            </div>
          ))}

          <button
            className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 z-10"
            onClick={handleOpenModalImageGallery}
          >
            <Squares2X2Icon className="w-5 h-5" />
            <span className="ml-2 text-neutral-800 text-sm font-medium">
              Show all photos
            </span>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 mt-11 flex flex-col lg:flex-row gap-4 xl:gap-6">
        {/* LEFT - Advertisement Banners */}
        <div className="hidden lg:block w-1/5 flex-shrink-0">
          <div className="sticky top-28">
            <VerticalAdBanners />
          </div>
        </div>

        {/* CENTER - Listing Details */}
        <div className="w-full lg:w-3/5 space-y-8 lg:space-y-10">
          {renderSection1()}
          {memberships && memberships.length > 0 && (
            <MembershipsDisplay memberships={memberships} />
          )}
          {renderSection2()}
          {renderSection3()}
          {renderSection4()}
          {renderSection5()}
          {renderSection6()}
          {renderSection7()}
          {renderSection8()}
        </div>

        {/* RIGHT - Business Quick Info & Top Stories */}
        <div className="hidden lg:block w-1/5 flex-shrink-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>
    </div>
  );
};

export default ListingStayDetailPage;