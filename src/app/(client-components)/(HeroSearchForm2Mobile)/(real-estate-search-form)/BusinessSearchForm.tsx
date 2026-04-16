"use client";

import React, { useState } from "react";
import LocationInput from "../LocationInput";
import { BusinessCategory } from "../../type";

// Temporary component - you can create a proper ServiceTypeSelect later
const ServiceTypeSelect: React.FC<{
  defaultValue: BusinessCategory[];
  onChange: (categories: BusinessCategory[]) => void;
}> = ({ defaultValue, onChange }) => {
  const [categories, setCategories] = useState<BusinessCategory[]>(defaultValue);

  const handleToggle = (index: number) => {
    const newCategories = [...categories];
    newCategories[index].checked = !newCategories[index].checked;
    setCategories(newCategories);
    onChange(newCategories);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Select Business Categories</h3>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div key={category.name} className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={category.checked}
              onChange={() => handleToggle(index)}
              className="mt-1 w-4 h-4 text-primary-6000 rounded focus:ring-primary-500"
            />
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-neutral-500">{category.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BusinessSearchForm = () => {
  const [fieldNameShow, setFieldNameShow] = useState<
    "service" | "location" | "category"
  >("service");
  
  const [serviceInput, setServiceInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [businessCategories, setBusinessCategories] = useState<BusinessCategory[]>([
    {
      name: "Restaurants & Food",
      description: "Dining establishments, cafes, and food services",
      checked: true,
    },
    {
      name: "Retail & Shopping",
      description: "Stores, supermarkets, and shopping outlets",
      checked: true,
    },
    {
      name: "Professional Services",
      description: "Legal, accounting, consulting, and business services",
      checked: true,
    },
    {
      name: "Healthcare",
      description: "Hospitals, clinics, pharmacies, and medical services",
      checked: false,
    },
    {
      name: "Automotive",
      description: "Car dealers, repair shops, and auto services",
      checked: false,
    },
  ]);

  const renderInputService = () => {
    const isActive = fieldNameShow === "service";
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
            onClick={() => setFieldNameShow("service")}
          >
            <span className="text-neutral-400">What service?</span>
            <span>{serviceInput || "Any service"}</span>
          </button>
        ) : (
          <LocationInput
            headingText="What are you looking for?"
            defaultValue={serviceInput}
            onChange={(value) => {
              setServiceInput(value);
              setFieldNameShow("location");
            }}
          />
        )}
      </div>
    );
  };

  const renderInputLocation = () => {
    const isActive = fieldNameShow === "location";
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
            onClick={() => setFieldNameShow("location")}
          >
            <span className="text-neutral-400">Where?</span>
            <span>{locationInput || "Any location in South Africa"}</span>
          </button>
        ) : (
          <LocationInput
            headingText="Where in South Africa?"
            defaultValue={locationInput}
            onChange={(value) => {
              setLocationInput(value);
              setFieldNameShow("category");
            }}
          />
        )}
      </div>
    );
  };

  const renderInputCategory = () => {
    const isActive = fieldNameShow === "category";

    let categoriesText = "";
    if (businessCategories && businessCategories.length > 0) {
      categoriesText = businessCategories
        .filter((item) => item.checked)
        .map((item) => {
          return item.name;
        })
        .join(", ");
    }

    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("category")}
          >
            <span className="text-neutral-400">Category</span>
            <span className="truncate ml-5">
              {categoriesText || "All categories"}
            </span>
          </button>
        ) : (
          <ServiceTypeSelect
            defaultValue={businessCategories}
            onChange={setBusinessCategories}
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
        {renderInputCategory()}
      </div>
    </div>
  );
};

export default BusinessSearchForm;
