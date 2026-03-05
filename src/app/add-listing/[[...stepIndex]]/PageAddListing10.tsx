"use client";

import StayCard from "@/components/StayCard";
import { DEMO_STAY_LISTINGS } from "@/data/listings";
import React, { FC } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Route } from "@/routers/types";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing10Props {}

const PageAddListing10: FC<PageAddListing10Props> = () => {
  const { formData, isPublishing, error } = useAddListing();

  const renderSection = (title: string, children: React.ReactNode) => (
    <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );

  const renderField = (label: string, value: any) => (
    <div className="mb-3">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
      <p className="font-medium text-neutral-900 dark:text-white">
        {value && value !== "" ? String(value) : "Not provided"}
      </p>
    </div>
  );

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Review your listing</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Review all the information you've entered before publishing your listing
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      
      {/* Display form data summary */}
      <div className="space-y-6 mb-8">
        {/* Step 1 - Basic Info */}
        {renderSection("Basic Information", (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Listing Title", formData.title)}
            {renderField("Property Type", formData.type)}
            {renderField("Rental Form", formData.category)}
          </div>
        ))}

        {/* Step 2 - Location */}
        {renderSection("Location", (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Country", formData.country)}
            {renderField("City", formData.city)}
            {renderField("State/Province", formData.state)}
            {renderField("Postal Code", formData.postalCode)}
            <div className="md:col-span-2">
              {renderField("Street Address", formData.address)}
            </div>
          </div>
        ))}

        {/* Step 3 - Size & Facilities */}
        {renderSection("Property Details", (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Acreage (m²)", formData.acreage)}
            {renderField("Max Guests", formData.guests)}
            {renderField("Bedrooms", formData.beds)}
            {renderField("Bathrooms", formData.baths)}
            {renderField("Kitchens", formData.kitchens)}
          </div>
        ))}

        {/* Step 4 - Amenities */}
        {formData.amenities && formData.amenities.length > 0 && 
          renderSection("Amenities", (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {formData.amenities.map((amenity, idx) => 
                amenity ? (
                  <span key={idx} className="text-sm bg-white dark:bg-neutral-800 px-3 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                    {amenity}
                  </span>
                ) : null
              )}
            </div>
          ))
        }

        {/* Step 5 - House Features/Rules */}
        {formData.features && formData.features.length > 0 && 
          renderSection("House Policies & Rules", (
            <div className="space-y-2">
              {formData.features.map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  <span className="text-neutral-700 dark:text-neutral-300 capitalize">
                    {feature.replace(/-/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          ))
        }

        {/* Step 6 - Description */}
        {formData.description && 
          renderSection("Description", (
            <div>
              <p className="text-neutral-700 dark:text-neutral-300 line-clamp-3">
                {formData.description}
              </p>
            </div>
          ))
        }

        {/* Step 8 - Pricing */}
        {renderSection("Pricing", (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Currency", formData.currency)}
            {renderField("Weekday Price (Mon-Thu)", formData.pricePerNight ? `${formData.pricePerNight} ${formData.currency}/night` : "Not set")}
            {renderField("Weekend Price (Fri-Sun)", formData.weekendPrice ? `${formData.weekendPrice} ${formData.currency}/night` : "Not set")}
            {renderField("Monthly Discount", formData.monthlyDiscount ? `${formData.monthlyDiscount}%` : "Not set")}
          </div>
        ))}

        {/* Step 9 - Availability */}
        {renderSection("Availability", (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Minimum Stay", formData.minNights ? `${formData.minNights} nights` : "1 night")}
            {renderField("Maximum Stay", formData.maxNights ? `${formData.maxNights} nights` : "365 nights")}
            {formData.blockedDates && formData.blockedDates.length > 0 && 
              renderField("Blocked Dates", `${formData.blockedDates.length} date(s) blocked`)
            }
          </div>
        ))}
      </div>

      {/* FORM - Preview Card */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Preview your listing</h3>
        <div className="max-w-xs">
          {DEMO_STAY_LISTINGS && DEMO_STAY_LISTINGS.length > 0 ? (
            <StayCard
              className="mt-8"
              data={{ 
                ...DEMO_STAY_LISTINGS[0], 
                reviewStart: 0,
                title: formData.title || "Your Listing",
                listingCategory: DEMO_STAY_LISTINGS[0].listingCategory || { id: 1, name: formData.type || "Property", href: "/" as any, taxonomy: "category" }
              }}
            />
          ) : null}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center space-x-5 mt-8">
        <ButtonSecondary href={"/add-listing/9" as Route}>
          <PencilSquareIcon className="h-5 w-5" />
          <span className="ml-3">Edit</span>
        </ButtonSecondary>
      </div>
    </>
  );
};

export default PageAddListing10;
