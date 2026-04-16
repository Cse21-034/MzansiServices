"use client";

import React, { FC, useState } from "react";
import ServiceSearchInput from "../ServiceSearchInput";
import ButtonSubmit from "../ButtonSubmit";
import { useRouter } from "next/navigation";
import LocationSearchInput from "./StayDatesRangeInput";

const StaySearchForm: FC<{}> = ({}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build search URL with parameters
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    if (selectedLocation.trim()) {
      params.append('location', selectedLocation.trim());
    }
    
    // Navigate to search results page
    const queryString = params.toString();
    const url = queryString ? `/listing-stay?${queryString}` : '/listing-stay';
    router.push(url);
  };

  const handleServiceSearch = (query: string) => {
    setSearchQuery(query);
    // Don't auto-navigate here - wait for form submission
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    // Don't auto-navigate here - wait for form submission
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSearch} className="w-full relative mt-4 flex items-center rounded-3xl shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800 border-2 border-burgundy-600 pr-4">
        <ServiceSearchInput 
          className="flex-grow" 
          onChange={setSearchQuery}
          onSearch={handleServiceSearch}
          placeHolder="What service are you looking for?"
          desc="Search for any business, service, or category"
        />
        <div className="self-center border-r border-slate-400 dark:border-slate-600 h-8"></div>
        <LocationSearchInput 
          className="flex-grow"
          onLocationChange={handleLocationChange}
          selectedLocation={selectedLocation}
        />
        <div className="self-center border-r border-slate-400 dark:border-slate-600 h-8"></div>
        <div className="flex-shrink-0">
          <ButtonSubmit 
            type="submit"
            className="h-12 w-12 md:h-16 md:w-40" 
          />
        </div>
      </form>
    );
  };

  return renderForm();
};

export default StaySearchForm;
