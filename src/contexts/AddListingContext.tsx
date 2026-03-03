"use client";

import React, { createContext, useContext, useState } from "react";

export interface ListingFormData {
  // Step 1 - Basic info
  title: string;
  description: string;
  category: string;
  
  // Step 2 - Details
  type: string;
  beds: number;
  baths: number;
  
  // Step 3 - Amenities
  amenities: string[];
  
  // Step 4 - Features
  features: string[];
  
  // Step 5 - Pricing
  pricePerNight: number;
  
  // Step 6 - Rules
  rules: string;
  
  // Step 7 - Location
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  
  // Step 8 - Photos
  images: File[];
  
  // Step 9 - Availability
  minNights: number;
  maxNights: number;
  
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
  category: "",
  type: "",
  beds: 1,
  baths: 1,
  amenities: [],
  features: [],
  pricePerNight: 0,
  rules: "",
  address: "",
  city: "",
  latitude: null,
  longitude: null,
  images: [],
  minNights: 1,
  maxNights: 365,
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
        beds: formData.beds,
        baths: formData.baths,
        amenities: formData.amenities,
        features: formData.features,
        pricePerNight: formData.pricePerNight,
        rules: formData.rules,
        address: formData.address,
        city: formData.city,
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
