"use client";

import React, { useState } from "react";

import LocationInput from "./LocationInput";
import ServiceSearchInput from "../(HeroSearchForm)/ServiceSearchInput";

const BusinessSearchFormMobile = () => {
  const [activeField, setActiveField] = useState<"service" | "location">("service");
  
  const [serviceInput, setServiceInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const renderInputService = () => {
    const isActive = activeField === "service";
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setActiveField("service")}
          >
            <span className="text-neutral-400">What service or business?</span>
            <span className="text-left flex-1 ml-2">
              {serviceInput || "e.g., suppliers, contractors, IT services"}
            </span>
          </button>
        ) : (
          <ServiceSearchInput
            onChange={(value: string) => {
              setServiceInput(value);
              if (value) {
                setTimeout(() => setActiveField("location"), 300);
              }
            }}
          />
        )}
      </div>
    );
  };

  const renderInputLocation = () => {
    const isActive = activeField === "location";
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setActiveField("location")}
          >
            <span className="text-neutral-400">Where? (Optional)</span>
            <span className="text-left flex-1 ml-2">
              {locationInput || "Anywhere in South Africa"}
            </span>
          </button>
        ) : (
          <LocationInput
            onChange={(value: string) => setLocationInput(value)}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="w-full space-y-5">
        {renderInputService()}
        {renderInputLocation()}
      </div>
    </div>
  );
};

export default BusinessSearchFormMobile;
