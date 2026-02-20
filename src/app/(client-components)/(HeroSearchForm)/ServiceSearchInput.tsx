"use client";

import { ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect, FC } from "react";
import ClearDataButton from "./ClearDataButton";

export interface ServiceSearchInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
}

const ServiceSearchInput: FC<ServiceSearchInputProps> = ({
  autoFocus = false,
  onChange = () => {},
  onSearch = () => {},
  placeHolder = "What service are you looking for?",
  desc = "Search for businesses, services, or categories",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [showPopover, setShowPopover] = useState(autoFocus);

  // Popular searches for suggestions
  const popularSearches = [
    "Restaurants",
    "Hotels",
    "Auto Repair",
    "Healthcare",
    "Legal Services",
    "IT Services",
    "Construction",
    "Tour Operators",
    "Retail Shops",
    "Beauty Salons"
  ];

  const recentSearches = [
    "Restaurants in Windhoek",
    "Hotels near me",
    "Car mechanics",
    "Doctors clinic"
  ];

  useEffect(() => {
    setShowPopover(autoFocus);
  }, [autoFocus]);

  useEffect(() => {
    if (eventClickOutsideDiv) {
      document.removeEventListener("click", eventClickOutsideDiv);
    }
    showPopover && document.addEventListener("click", eventClickOutsideDiv);
    return () => {
      document.removeEventListener("click", eventClickOutsideDiv);
    };
  }, [showPopover]);

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    if (!showPopover || containerRef.current.contains(event.target as Node)) {
      return;
    }
    setShowPopover(false);
  };

  const handleSelectService = (item: string) => {
    setValue(item);
    setShowPopover(false);
    onChange(item);
  };

  const renderRecentSearches = () => {
    return (
      <>

        <h3 className="block mt-4 sm:mt-6 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 dark:text-neutral-100">
          Popular Searches
        </h3>
        <div className="mt-2">
          {popularSearches.map((item) => (
            <span
              onClick={() => handleSelectService(item)}
              key={item}
              className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <MagnifyingGlassIcon className="h-4 sm:h-6 w-4 sm:w-6" />
              </span>
              <span className="block font-medium text-neutral-700 dark:text-neutral-200">
                {item}
              </span>
            </span>
          ))}
        </div>
      </>
    );
  };

  const renderSearchValue = () => {
    // Filter suggestions based on input value
    const filteredPopular = popularSearches.filter(item =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    const filteredRecent = recentSearches.filter(item =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    const hasResults = filteredPopular.length > 0 || filteredRecent.length > 0;

    return (
      <>
        {filteredRecent.length > 0 && (
          <>
            <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 dark:text-neutral-100">
              Recent Searches
            </h3>
            <div className="mt-2">
              {filteredRecent.map((item) => (
                <span
                  onClick={() => handleSelectService(item)}
                  key={item}
                  className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  <span className="block text-neutral-400">
                    <ClockIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </span>
                  <span className="block font-medium text-neutral-700 dark:text-neutral-200">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </>
        )}

        {filteredPopular.length > 0 && (
          <>
            <h3 className="block mt-4 sm:mt-6 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 dark:text-neutral-100">
              Suggestions
            </h3>
            <div className="mt-2">
              {filteredPopular.map((item) => (
                <span
                  onClick={() => handleSelectService(item)}
                  key={item}
                  className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  <span className="block text-neutral-400">
                    <MagnifyingGlassIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </span>
                  <span className="block font-medium text-neutral-700 dark:text-neutral-200">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </>
        )}

        {!hasResults && value && (
          <div className="px-4 sm:px-8 py-4 text-neutral-500 dark:text-neutral-400 text-center">
            Type and press Enter to search for "{value}"
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left  ${
          showPopover ? "nc-hero-field-focused border-2 border-burgundy-600" : ""
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <MagnifyingGlassIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate`}
            placeholder={placeHolder}
            value={value}
            autoFocus={showPopover}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              onChange(e.currentTarget.value);
            }}
            ref={inputRef}
          />
          <span className="block mt-0.5 text-sm text-neutral-400 font-light ">
            <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
          </span>
          {value && showPopover && (
            <ClearDataButton
              onClick={() => {
                setValue("");
                onChange("");
              }}
            />
          )}
        </div>
      </div>

      {showPopover && (
        <div
          className={`h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 bg-white dark:bg-neutral-800 ${divHideVerticalLineClass}`}
        ></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[500px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {value ? renderSearchValue() : renderRecentSearches()}
        </div>
      )}
    </div>
  );
};

export default ServiceSearchInput;