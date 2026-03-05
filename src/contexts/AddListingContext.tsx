"use client";

import React, { createContext, useContext, useState } from "react";

export interface ListingFormData {
  // Step 1 - Basic info
  title: string;
  description: string;
  type: string;
  category: string; // Entire place, Private room, Share room
  
  // Step 2 - Location
  country: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  
  // Step 3 - Size
  acreage: string;
  guests: number;
  beds: number;
  baths: number;
  kitchens: number;
  
  // Step 4 - Amenities
  amenities: string[];
  
  // Step 5 - House Rules (features/policies)
  features: string[];
  rules: string; // Additional custom rules
  
  // Step 6 - Description
  // Uses description from Step 1
  
  // Step 7 - Photos
  images: File[];
  
  // Step 8 - Pricing
  currency: string;
  pricePerNight: number;
  weekendPrice: number;
  monthlyDiscount: number;
  
  // Step 9 - Availability
  minNights: number;
  maxNights: number;
  blockedDates: number[]; // Array of timestamps
  
  // Step 10 - Review & Publish
  // No additional fields needed
}

interface AddListingContextType {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  resetFormData: () => void;
  publishListing: () => Promise<void>;
  isPublishing: boolean;
  error: string | null;
}

const AddListingContext = createContext<AddListingContextType | undefined>(undefined);

const defaultFormData: ListingFormData = {
  title: "",
  description: "",
  type: "",
  category: "",
  country: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  latitude: null,
  longitude: null,
  acreage: "",
  guests: 1,
  beds: 1,
  baths: 1,
  kitchens: 1,
  amenities: [],
  features: [],
  rules: "",
  images: [],
  currency: "USD",
  pricePerNight: 0,
  weekendPrice: 0,
  monthlyDiscount: 0,
  minNights: 1,
  maxNights: 365,
  blockedDates: [],
};

export const AddListingProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<ListingFormData>(defaultFormData);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (data: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
  };

  const publishListing = async () => {
    setIsPublishing(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Listing title is required");
      }
      
      if (!formData.description.trim()) {
        throw new Error("Listing description is required");
      }
      
      if (!formData.city.trim()) {
        throw new Error("City is required");
      }
      
      if (formData.pricePerNight <= 0) {
        throw new Error("Price per night must be greater than 0");
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        country: formData.country,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        acreage: formData.acreage,
        guests: formData.guests,
        beds: formData.beds,
        baths: formData.baths,
        kitchens: formData.kitchens,
        amenities: formData.amenities,
        features: formData.features,
        rules: formData.rules,
        currency: formData.currency,
        pricePerNight: formData.pricePerNight,
        weekendPrice: formData.weekendPrice,
        monthlyDiscount: formData.monthlyDiscount,
        latitude: formData.latitude,
        longitude: formData.longitude,
        minNights: formData.minNights,
        maxNights: formData.maxNights,
      };

      const response = await fetch("/api/listings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to publish listing");
      }

      // Clear form on success
      resetFormData();
      
      // Return success
      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AddListingContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        publishListing,
        isPublishing,
        error,
      }}
    >
      {children}
    </AddListingContext.Provider>
  );
};

export const useAddListing = () => {
  const context = useContext(AddListingContext);
  if (!context) {
    throw new Error("useAddListing must be used within AddListingProvider");
  }
  return context;
};
