"use client";

import { MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef, FC } from "react";
interface Props {
  onClick?: () => void;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  headingText?: string;
}

const LocationInput: FC<Props> = ({
  onChange = () => {},
  className = "",
  defaultValue = "",
  headingText = "Where in South Africa?",
}) => {
  const [value, setValue] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // South African locations
  const citiesAndVillages = [
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bellville",
    "Sandton",
    "Centurion",
    "Witbank",
    "Polokwane",
    "Bloemfontein",
    "Bhisho",
    "Pietermaritzburg",
    "Kimberley",
    "Thohoyandou",
  ];

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSelectLocation = (item: string) => {
    setTimeout(() => {
      setValue(item);
      onChange && onChange(item);
    }, 0);
  };

  const renderLocationValues = ({
    heading,
    items,
    inputValue,
  }: {
    heading: string;
    items: string[];
    inputValue: string;
  }) => {
    const isNewLocation = inputValue && !items.some(item => item.toLowerCase() === inputValue.toLowerCase());
    return (
      <>
        <p className="block font-semibold text-base">
          {heading}
        </p>
        <div className="mt-3">
          {items.map((item) => {
            return (
              <div
                className="py-2 mb-1 flex items-center space-x-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg px-2 cursor-pointer"
                onClick={() => handleSelectLocation(item)}
                key={item}
              >
                <MapPinIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                <span className="">{item}</span>
              </div>
            );
          })}
          {isNewLocation && (
            <div
              className="py-2 mb-1 flex items-center space-x-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg px-2 cursor-pointer text-primary-600 dark:text-primary-400"
              onClick={() => handleSelectLocation(inputValue)}
            >
              <MapPinIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="">Add "{inputValue}"</span>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={`${className}`} ref={containerRef}>
      <div className="p-5">
        <span className="block font-semibold text-xl sm:text-2xl">
          {headingText}
        </span>
        <div className="relative mt-5">
          <input
            className={`block w-full bg-transparent border px-4 py-3 pr-12 border-neutral-900 dark:border-neutral-200 rounded-xl focus:ring-0 focus:outline-none text-base leading-none placeholder-neutral-500 dark:placeholder-neutral-300 truncate font-bold placeholder:truncate`}
            placeholder="Search locations in South Africa"
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            ref={inputRef}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-400" />
          </span>
        </div>
        <div className="mt-7">
          {value ? (
            renderLocationValues({
              heading: "Matching Locations",
              items: citiesAndVillages.filter(city => 
                city.toLowerCase().includes(value.toLowerCase())
              ),
              inputValue: value, // Pass inputValue to renderLocationValues
            })
          ) : (
            renderLocationValues({
              heading: "Popular Cities in South Africa",
              items: citiesAndVillages.slice(0, 10), // Show top 10 popular cities
              inputValue: value,
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
