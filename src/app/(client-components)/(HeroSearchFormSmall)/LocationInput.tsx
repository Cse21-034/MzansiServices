"use client";

import React, { useState } from "react";
import { FC } from "react";
import { useEffect } from "react";
import ClearDataButton from "./ClearDataButton";
import { useRef } from "react";
import useOutsideAlerter from "@/hooks/useOutsideAlerter";
import { MapPinIcon } from "@heroicons/react/24/outline";


export interface LocationInputProps {
  onInputDone?: (value: string) => void;
  // Added for BusinessSearchFormMobile usage
  onChange?: (value: string) => void;
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
}

const LocationInput: FC<LocationInputProps> = ({
  autoFocus = false,
  onInputDone,
  onChange = () => {},
  placeHolder = "Where in South Africa?",
  desc = "Search for a city or area",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [showPopover, setShowPopover] = useState(autoFocus);

  // South Africa location suggestions
  const popularLocations = [
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bellville",
    "Sandton",
    "Centurion",
    "Witbank",
    "Polokwane"
  ];
  const recentLocations = [
    "Johannesburg CBD",
    "Sandton",
    "Cape Town Central",
    "Durban Beachfront",
    "Khomas"
  ];

  useEffect(() => {
    setShowPopover(autoFocus);
    if (autoFocus && !!inputRef.current) {
      setTimeout(() => {
        inputRef.current && inputRef.current.focus();
      }, 200);
    }
  }, [autoFocus]);

  useOutsideAlerter(containerRef, () => {
    setShowPopover(false);
  });

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const handleSelectLocation = (item: string) => {
    setValue(item);
    onInputDone && onInputDone(item);
    onChange && onChange(item);
    setShowPopover(false);
  };

  const renderRecentLocations = () => {
    return (
      <>
        <h3 className="block mt-2 sm:mt-0 px-4 sm:px-6 font-semibold text-base text-neutral-800 dark:text-neutral-100">
          Recent Locations
        </h3>
        <div className="mt-2">
          {recentLocations.map((item) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={item}
              className="flex px-4 sm:px-6 items-center space-x-3 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </span>
              <span className="block text-neutral-700 dark:text-neutral-200">
                {item}
              </span>
            </span>
          ))}
        </div>

        <h3 className="block mt-4 sm:mt-6 px-4 sm:px-6 font-semibold text-base text-neutral-800 dark:text-neutral-100">
          Popular Locations
        </h3>
        <div className="mt-2">
          {popularLocations.map((item) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={item}
              className="flex px-4 sm:px-6 items-center space-x-3 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </span>
              <span className="block text-neutral-700 dark:text-neutral-200">
                {item}
              </span>
            </span>
          ))}
        </div>
      </>
    );
  };

  const renderSearchValue = () => {
    // Filter locations based on input value
    const filteredLocations = NAMIBIA_LOCATIONS.filter(location =>
      location.toLowerCase().includes(value.toLowerCase())
    );

    return (
      <>
        {filteredLocations.length > 0 ? (
          <div className="mt-2">
            {filteredLocations.map((item) => (
              <span
                onClick={() => handleSelectLocation(item)}
                key={item}
                className="flex px-4 sm:px-6 items-center space-x-3 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <span className="block text-neutral-400">
                  <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                </span>
                <span className="block text-neutral-700 dark:text-neutral-200">
                  {item}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-4 text-neutral-500 dark:text-neutral-400">
            No locations found for "{value}". Try searching for "Johannesburg", "Cape Town", "Durban", etc.
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex flex-1 relative z-10 [ nc-hero-field-padding--small ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-hero-field-focused--2" : ""
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-1">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-400 xl:text-base font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate`}
            placeholder={placeHolder}
            value={value}
            autoFocus={showPopover}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              onChange && onChange(e.currentTarget.value);
            }}
            ref={inputRef}
          />
          <span className="block mt-0.5 text-sm text-neutral-400 font-light ">
            <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
          </span>
          {value && showPopover && (
            <ClearDataButton onClick={() => setValue("")} />
          )}
        </div>
      </div>

      {showPopover && (
        <div
          className={`h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 bg-white dark:bg-neutral-800 ${divHideVerticalLineClass}`}
        ></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[400px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-5 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {value ? renderSearchValue() : renderRecentLocations()}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
