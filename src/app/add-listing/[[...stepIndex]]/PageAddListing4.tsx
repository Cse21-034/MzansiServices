"use client";

import React, { FC } from "react";
import Checkbox from "@/shared/Checkbox";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing4Props {}

const GENERAL_AMENITIES = [
  "Wifi", "Internet", "TV", "Air conditioning", "Fan", "Private entrance",
  "Dryer", "Heater", "Washing machine", "Detergent", "Clothes dryer",
  "Baby cot", "Desk", "Fridge"
];

const OTHER_AMENITIES = [
  "Wardrobe", "Cloth hook", "Extra cushion", "Gas stove", "Toilet paper",
  "Free toiletries", "Makeup table", "Hot pot", "Bathroom heaters", "Kettle",
  "Dishwasher", "BBQ grill", "Toaster", "Towel", "Dining table"
];

const SAFE_AMENITIES = [
  "Fire siren", "Fire extinguisher", "Anti-theft key", "Safe vault"
];

const PageAddListing4: FC<PageAddListing4Props> = () => {
  const { formData, updateFormData } = useAddListing();
  const selectedAmenities = formData.amenities || [];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    let newAmenities: string[];
    if (checked) {
      newAmenities = [...selectedAmenities, amenity];
    } else {
      newAmenities = selectedAmenities.filter(a => a !== amenity);
    }
    updateFormData({ amenities: newAmenities });
  };

  const renderAmenityGroup = (title: string, amenities: string[]) => (
    <div>
      <label className="text-lg font-semibold" htmlFor="">
        {title}
      </label>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {amenities.map((amenity) => (
          <Checkbox
            key={amenity}
            label={amenity}
            name={amenity}
            defaultChecked={selectedAmenities.includes(amenity)}
            onChange={(checked) => handleAmenityChange(amenity, checked)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Amenities </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Many customers have searched for accommodation based on amenities
          criteria
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {renderAmenityGroup("General amenities", GENERAL_AMENITIES)}
        {renderAmenityGroup("Other amenities", OTHER_AMENITIES)}
        {renderAmenityGroup("Safe amenities", SAFE_AMENITIES)}
      </div>
    </>
  );
};

export default PageAddListing4;
