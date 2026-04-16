"use client";

import React, { FC, Fragment, useState, useEffect } from "react";
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
import { Amenities_demos, PHOTOS } from "./constant";
import { Route } from "next";
const logoMobile = "/images/mzansi-logo/squarelogo.PNG";

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
}

export interface ListingStayDetailPageProps { }

const ListingStayDetailPage: FC<ListingStayDetailPageProps> = ({ }) => {
  let [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const [business, setBusiness] = useState<BusinessDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const thisPathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const businessSlug = params.slug as string;

  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/businesses/${businessSlug}`);

        if (!res.ok) {
          throw new Error('Business not found');
        }

        const data = await res.json();

        if (data.success && data.business) {
          setBusiness(data.business);
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
      fetchBusiness();
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

  // Format business hours for display
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

  // Loading state
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

  // Error state
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
    const primaryPhoto = business.photos.find(photo => photo.isPrimary) || business.photos[0];

    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          {business.verified && <Badge name="Verified Business" color="green" />}
          {business.featured && <Badge name="Featured" color="blue" />}
          <LikeSaveBtns />
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {business.name}
        </h2>

        {/* 3 */}
        <div className="flex items-center space-x-4">
          <StartRating point={business.averageRating || 0} reviewCount={business.reviewCount} />
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1"> {business.city}, {business.country}</span>
          </span>
        </div>

        {/* 4 */}
        <div className="flex items-center">
          <Avatar
            hasChecked={business.verified}
            sizeClass="h-10 w-10"
            radius="rounded-full"
            imgUrl={primaryPhoto?.url}
            userName={business.name}
          />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Listed by{" "}
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">
              Business Owner
            </span>
          </span>
        </div>

        {/* 5 */}
        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />

        {/* 6 */}
        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center space-x-3 ">
            <PhoneIcon className="w-5 h-5" />
            <span className="">{business.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="w-5 h-5" />
            <span className=" ">{business.email}</span>
          </div>
          {business.website && (
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="w-5 h-5" />
              <span className=" ">{business.website}</span>
            </div>
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
          {business.description ? (
            <span>{business.description}</span>
          ) : (
            <span>
              {business.name} is a professional {business.category.name.toLowerCase()} business
              located in {business.city}, {business.country}.
              {business.establishedYear && ` Established in ${business.establishedYear},`}
              we are committed to providing excellent service and quality to our customers.
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderSection3 = () => {
    const servicesToShow = business.services.length > 0
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
            {business.category.name} services and solutions
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
        {(business.services.length > 8 || business.services.length === 0) && (
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
    const allServices = business.services.length > 0
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
              <div className="font-medium">{business.phone}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full">
              <EnvelopeIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="text-sm text-neutral-500">Email Address</div>
              <div className="font-medium">{business.email}</div>
            </div>
          </div>

          {business.website && (
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

          {business.address && (
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full mt-1">
                <MapPinIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div className="text-sm text-neutral-500">Business Address</div>
                <div className="font-medium">{business.address}</div>
              </div>
            </div>
          )}
        </div>

        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="flex space-x-4">
          <ButtonPrimary className="flex-1" onClick={() => window.open(`tel:${business.phone}`)}>
            <PhoneIcon className="w-4 h-4 mr-2" />
            Call Now
          </ButtonPrimary>
          <ButtonSecondary className="flex-1" onClick={() => window.open(`mailto:${business.email}`)}>
            <EnvelopeIcon className="w-4 h-4 mr-2" />
            Send Email
          </ButtonSecondary>
        </div>
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">
          Customer Reviews ({business.reviewCount} reviews)
        </h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="space-y-5">
          <div className="flex items-center space-x-4">
            <FiveStartIconForRate iconClass="w-6 h-6" className="space-x-0.5" />
            <span className="text-lg font-semibold">
              {business.averageRating ? `${business.averageRating.toFixed(1)} out of 5` : 'No ratings yet'}
            </span>
          </div>
          <div className="relative">
            <Input
              fontClass=""
              sizeClass="h-16 px-4 py-3"
              rounded="rounded-3xl"
              placeholder="Share your experience with this business..."
            />
            <ButtonCircle
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size=" w-12 h-12 "
            >
              <ArrowRightIcon className="w-5 h-5" />
            </ButtonCircle>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {business.reviews.length > 0 ? (
            business.reviews.slice(0, 4).map((review) => (
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

          {business.reviews.length > 4 && (
            <div className="pt-8">
              <ButtonSecondary>View more {business.reviews.length - 4} reviews</ButtonSecondary>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Location</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {business.address || `${business.city}, ${business.country}`}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3 ring-1 ring-black/10 rounded-xl z-0">
          <div className="rounded-xl overflow-hidden z-0">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAGVJfZMAKYfZ71nzL_v5i3LjTTWnCYwTY&q=${encodeURIComponent(business.address || `${business.city}, ${business.country}`)}`}
            ></iframe>
          </div>
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
            {business.establishedYear
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
              <li>{business.city} and surrounding areas</li>
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
              <li>Category: {business.category.name}</li>
              {business.employees && <li>Employees: {business.employees}</li>}
              <li>Status: {business.verified ? 'Verified Business' : 'Unverified'}</li>
              <li>Member since: {new Date(business.createdAt).getFullYear()}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    const primaryPhoto = business.photos.find(photo => photo.isPrimary) || business.photos[0];

    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        <div className="space-y-4">
          <ButtonPrimary
            className="w-full justify-center"
            onClick={() => window.open(`tel:${business.phone}`)}
          >
            <PhoneIcon className="w-5 h-5 mr-2" />
            Call Business
          </ButtonPrimary>
          <ButtonSecondary
            className="w-full justify-center"
            onClick={() => window.open(`mailto:${business.email}`)}
          >
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            Send Message
          </ButtonSecondary>
          {business.website && (
            <ButtonSecondary
              className="w-full justify-center"
              onClick={() => window.open(business.website, '_blank')}
            >
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Visit Website
            </ButtonSecondary>
          )}
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Category:</span>
                <span>{business.category.name}</span>
              </div>
              {business.establishedYear && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Established:</span>
                  <span>{business.establishedYear}</span>
                </div>
              )}
              {business.employees && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Employees:</span>
                  <span>{business.employees}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Rating:</span>
                <span>
                  {business.averageRating
                    ? `${business.averageRating.toFixed(1)}/5 (${business.reviewCount} reviews)`
                    : 'No ratings yet'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className={business.verified ? "text-green-600" : "text-yellow-600"}>
                  {business.verified ? 'Verified' : 'Unverified'}
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
                <i className="lab la-x-twitter"></i>
              </ButtonCircle>
              <ButtonCircle size="w-10 h-10">
                <i className="lab la-linkedin-in"></i>
              </ButtonCircle>
              <ButtonCircle size="w-10 h-10">
                <i className="lab la-whatsapp"></i>
              </ButtonCircle>
            </div>
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
      {/* HEADER */}
      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
          <div
            className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
            onClick={handleOpenModalImageGallery}
          >
            <Image
              fill
              className="object-cover rounded-md sm:rounded-xl"
              src={businessPhotos[0] || logoMobile}
              alt={business.name}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            />
            <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
          </div>
          {businessPhotos.filter((_, i) => i >= 1 && i < 5).map((item, index) => (
            <div
              key={index}
              className={`relative rounded-md sm:rounded-xl overflow-hidden ${index >= 3 ? "hidden sm:block" : ""
                }`}
            >
              <div className="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5">
                <Image
                  fill
                  className="object-cover rounded-md sm:rounded-xl "
                  src={item || logoMobile}
                  alt={`${business.name} ${index + 1}`}
                  sizes="400px"
                />
              </div>

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
      <main className="relative z-10 mt-11 flex flex-col lg:flex-row">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {renderSection4()}
          {renderSection5()}
          {renderSection6()}
          {renderSection7()}
          {renderSection8()}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>
    </div>
  );
};

export default ListingStayDetailPage;
