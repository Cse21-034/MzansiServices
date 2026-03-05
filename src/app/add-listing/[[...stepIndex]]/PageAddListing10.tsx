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
        <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Listing Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Title</p>
              <p className="font-medium">{formData.title || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Type</p>
              <p className="font-medium">{formData.type || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Category</p>
              <p className="font-medium">{formData.category || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Price Per Night</p>
              <p className="font-medium">${formData.pricePerNight || "0"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Beds</p>
              <p className="font-medium">{formData.beds || "0"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Bathrooms</p>
              <p className="font-medium">{formData.baths || "0"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Location</p>
              <p className="font-medium">{formData.city && formData.address ? `${formData.address}, ${formData.city}` : "Not provided"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Description</p>
              <p className="font-medium line-clamp-2">{formData.description || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {formData.amenities && Array.isArray(formData.amenities) && formData.amenities.length > 0 && (
          <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {formData.amenities.map((amenity, idx) => 
                amenity ? (
                  <span key={idx} className="text-sm bg-white dark:bg-neutral-800 px-3 py-1 rounded">
                    {amenity}
                  </span>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>

      {/* FORM */}
      <div>
        <h3 className="text-lg font-semibold">Preview your listing</h3>
        <div className="max-w-xs">
          {DEMO_STAY_LISTINGS && DEMO_STAY_LISTINGS.length > 0 ? (
            <StayCard
              className="mt-8"
              data={{ 
                ...DEMO_STAY_LISTINGS[0], 
                reviewStart: 0,
                title: formData.title || "Your Listing",
                listingCategory: DEMO_STAY_LISTINGS[0].listingCategory || { id: 1, name: "Property", href: "/" as any, taxonomy: "category" }
              }}
            />
          ) : null}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-5 mt-8">
        <ButtonSecondary href={"/add-listing/9" as Route}>
          <PencilSquareIcon className="h-5 w-5" />
          <span className="ml-3">Edit</span>
        </ButtonSecondary>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </>
  );
};

export default PageAddListing10;
