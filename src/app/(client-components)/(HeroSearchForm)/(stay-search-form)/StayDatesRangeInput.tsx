"use client";

import React, { Fragment, useState, FC, useMemo } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ClearDataButton from "../ClearDataButton";
import { NAMIBIA_LOCATIONS } from "@/data/namibiaLocations";

export interface LocationSearchInputProps {
  className?: string;
  fieldClassName?: string;
  onLocationChange?: (location: string) => void;
  selectedLocation?: string;
}

const LocationSearchInput: FC<LocationSearchInputProps> = ({
  className = "[ lg:nc-flex-2 ]",
  fieldClassName = "[ nc-hero-field-padding ]",
  onLocationChange = () => {},
  selectedLocation = "",
}) => {
  const [internalLocation, setInternalLocation] = useState<string>(selectedLocation);
  const [searchQuery, setSearchQuery] = useState<string>(selectedLocation); // Initialize searchQuery with selectedLocation

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery) return NAMIBIA_LOCATIONS;
    
    const query = searchQuery.toLowerCase();
    return NAMIBIA_LOCATIONS.filter(location =>
      location.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleLocationSelect = (location: string) => {
    setInternalLocation(location);
    setSearchQuery(location); // Also update searchQuery to reflect selected location
    onLocationChange(location);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value); // Update searchQuery for filtering suggestions
    setInternalLocation(value); // Update internalLocation to reflect typed value
    onLocationChange(value); // Pass the typed value up to the parent
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = "Current Location";
          setInternalLocation(location);
          setSearchQuery(location);
          onLocationChange(location);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleClearLocation = () => {
    setInternalLocation("");
    setSearchQuery("");
    onLocationChange("");
  };

  const renderInput = () => {
    return (
      <>
        <div className="text-neutral-300 dark:text-neutral-400">
          <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow text-left">
          <span className="block xl:text-lg font-semibold">
            {internalLocation || "Any location"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {"Search anywhere in Namibia"}
          </span>
        </div>
      </>
    );
  };

  return (
    <Popover className={`LocationSearchInput z-10 relative flex ${className}`}>
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex-1 z-10 flex relative ${fieldClassName} items-center space-x-3 focus:outline-none ${
              open ? "nc-hero-field-focused border-2 border-burgundy-600" : ""
            }`}
          >
            {renderInput()}
            {internalLocation && open && (
              <ClearDataButton onClick={handleClearLocation} />
            )}
          </Popover.Button>

          {open && (
            <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -inset-x-0.5 bg-white dark:bg-neutral-800"></div>
          )}

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 top-full w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-4">
                {/* Search Input */}
                <div className="relative mb-4">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cities and areas in Namibia..."
                    value={searchQuery}
                    onChange={handleInputChange} // Use the new handler
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    autoFocus
                  />
                </div>

                {/* Current Location Button */}
                <button
                  onClick={() => {
                    handleUseCurrentLocation();
                    close();
                  }}
                  className="w-full mb-4 px-4 py-3 text-left bg-secondary/10 hover:bg-secondary/20 text-secondary-700 rounded-2xl transition-colors duration-200 dark:bg-secondary/20 dark:hover:bg-secondary/30 dark:text-secondary-300"
                >
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-3" />
                    <span>Use my current location</span>
                  </div>
                </button>

                {/* Popular Cities Section */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 px-2">
                    Popular Cities
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Windhoek", "Walvis Bay", "Swakopmund", "Oshakati"].map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          handleLocationSelect(city);
                          close();
                        }}
                        className="px-3 py-2 text-sm bg-neutral-100 hover:bg-primary/20 text-neutral-700 rounded-xl transition-colors duration-200 dark:bg-neutral-700 dark:hover:bg-primary/30 dark:text-neutral-200"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* All Locations List */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredLocations.length === 0 && searchQuery ? ( // Only show "No locations found" if there's a query
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No suggestions found for "{searchQuery}". You can still search for this location.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 px-2">
                        All Locations
                      </h3>
                      {filteredLocations.map((location, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleLocationSelect(location);
                            close();
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-primary/10 rounded-2xl transition-colors duration-200 dark:hover:bg-primary/20 dark:text-white border-b border-neutral-100 dark:border-neutral-700 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-3 text-primary" />
                            <span className="font-medium">{location}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default LocationSearchInput;