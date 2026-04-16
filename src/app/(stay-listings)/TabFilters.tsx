"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonThird from "@/shared/ButtonThird";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/Checkbox";
import { useRouter } from "next/navigation";

// BUSINESS DIRECTORY DATA - Based on your categories
const businessCategories = [
  {
    name: "Food & Hospitality",
    description: "Restaurants, Hotels, Cafes, Catering, Fast Food",
    subcategories: ['Restaurants', 'Hotels & Lodges', 'Cafes & Bars', 'Catering Services', 'Fast Food']
  },
  {
    name: "Retail & Shopping",
    description: "Supermarkets, Clothing, Electronics, Furniture",
    subcategories: ['Supermarkets', 'Clothing Stores', 'Electronics', 'Furniture', 'General Dealers']
  },
  {
    name: "Healthcare",
    description: "Hospitals, Clinics, Pharmacies, Dental Services",
    subcategories: ['Hospitals', 'Clinics', 'Pharmacies', 'Dental Services', 'Opticians']
  },
  {
    name: "Professional Services",
    description: "Legal, Accounting, Consulting, IT, Marketing",
    subcategories: ['Legal Services', 'Accounting', 'Consulting', 'IT Services', 'Marketing']
  },
  {
    name: "Tourism & Recreation",
    description: "Tour Operators, Safari, Travel, Adventure Sports",
    subcategories: ['Tour Operators', 'Safari Companies', 'Travel Agencies', 'Adventure Sports', 'Cultural Tours']
  },
];

const businessFeatures = [
  { name: "Online Booking", defaultChecked: true },
  { name: "Free Consultation" },
  { name: "Home Delivery", defaultChecked: true },
  { name: "24/7 Service" },
  { name: "Wheelchair Accessible" },
  { name: "Parking Available", defaultChecked: true },
  { name: "WiFi Available" },
  { name: "Accepts Credit Cards", defaultChecked: true },
  { name: "Mobile Payments" },
  { name: "Appointment Required" },
];

const businessTypes = [
  { name: "Local Business", defaultChecked: true },
  { name: "Chain Store" },
  { name: "Franchise" },
  { name: "Online Business" },
  { name: "Home-based Business" },
  { name: "Corporate Office" },
];

const businessRatings = [
  { name: "4+ Stars & Up" },
  { name: "3+ Stars & Up", defaultChecked: true },
  { name: "Open Now" },
  { name: "Verified Business", defaultChecked: true },
];

interface TabFiltersProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const TabFilters: React.FC<TabFiltersProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const [isOpenMoreFilterMobile, setisOpenMoreFilterMobile] = useState(false);
  const router = useRouter();

  const closeModalMoreFilter = () => setisOpenMoreFilter(false);
  const openModalMoreFilter = () => setisOpenMoreFilter(true);
  
  const closeModalMoreFilterMobile = () => setisOpenMoreFilterMobile(false);
  const openModalMoreFilterMobile = () => setisOpenMoreFilterMobile(true);

  const renderXClear = () => {
    return (
      <span className="w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center ml-3 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  };

  const handleCategorySelect = (categoryName: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryName);
    }
  };

  const handleBackToAll = () => {
    if (onCategoryChange) {
      onCategoryChange('');
    }
    // Also update URL to remove category filter
    router.push('/listing-stay-map');
  };

  const renderTabsBusinessCategory = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-6000 focus:outline-none ${
                open ? "!border-primary-500 " : ""
              }`}
            >
              <span>Business Category</span>
              <i className="las la-angle-down ml-2"></i>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-5 max-h-96 overflow-y-auto">
                    {businessCategories.map((category) => (
                      <div key={category.name} className="border-b border-neutral-200 dark:border-neutral-700 pb-4 last:border-b-0">
                        <div 
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedCategory === category.name 
                              ? 'bg-primary-50 border border-primary-200' 
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          }`}
                          onClick={() => handleCategorySelect(category.name)}
                        >
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">
                            {category.name}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird 
                      onClick={() => {
                        if (onCategoryChange) onCategoryChange('');
                        close();
                      }} 
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Clear
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={close}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply
                    </ButtonPrimary>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderMoreFilterItem = (
    data: {
      name: string;
      defaultChecked?: boolean;
    }[]
  ) => {
    const list1 = data.filter((_, i) => i < data.length / 2);
    const list2 = data.filter((_, i) => i >= data.length / 2);
    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col space-y-5">
          {list1.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
            />
          ))}
        </div>
        <div className="flex flex-col space-y-5">
          {list2.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTabMoreFilter = () => {
    return (
      <div>
        <div
          className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none cursor-pointer`}
          onClick={openModalMoreFilter}
        >
          <span>More filters</span>
          {renderXClear()}
        </div>

        <Transition appear show={isOpenMoreFilter} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModalMoreFilter}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                className="inline-block py-8 px-2 h-screen w-full max-w-4xl"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Business Filters
                    </Dialog.Title>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalMoreFilter} />
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto">
                    <div className="px-10 divide-y divide-neutral-200 dark:divide-neutral-800">
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Business Features</h3>
                        <div className="mt-6 relative ">
                          {renderMoreFilterItem(businessFeatures)}
                        </div>
                      </div>
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Business Type</h3>
                        <div className="mt-6 relative ">
                          {renderMoreFilterItem(businessTypes)}
                        </div>
                      </div>
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Ratings & Status</h3>
                        <div className="mt-6 relative ">
                          {renderMoreFilterItem(businessRatings)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird
                      onClick={closeModalMoreFilter}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Clear All
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={closeModalMoreFilter}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply Filters
                    </ButtonPrimary>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  const renderTabMoreFilterMobile = () => {
    return (
      <div>
        <div
          className={`flex lg:hidden items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none cursor-pointer`}
          onClick={openModalMoreFilterMobile}
        >
          <span>More filters</span>
          {renderXClear()}
        </div>

        <Transition appear show={isOpenMoreFilterMobile} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModalMoreFilterMobile}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                className="inline-block py-8 px-2 h-screen w-full max-w-4xl"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Business Filters
                    </Dialog.Title>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalMoreFilterMobile} />
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto">
                    <div className="px-4 sm:px-6 divide-y divide-neutral-200 dark:divide-neutral-800">
                      {/* Business Category */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Business Category</h3>
                        <div className="mt-6 relative ">
                          <div className="space-y-4">
                            {businessCategories.map((category) => (
                              <div key={category.name} className="border rounded-lg p-4">
                                <div 
                                  className={`font-medium cursor-pointer ${
                                    selectedCategory === category.name 
                                      ? 'text-primary-600' 
                                      : 'text-neutral-900 dark:text-neutral-100'
                                  }`}
                                  onClick={() => handleCategorySelect(category.name)}
                                >
                                  {category.name}
                                </div>
                                <div className="text-sm text-neutral-500 mt-1">
                                  {category.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Business Features */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Business Features</h3>
                        <div className="mt-6 relative ">
                          {renderMoreFilterItem(businessFeatures)}
                        </div>
                      </div>

                      {/* Business Type */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Business Type</h3>
                        <div className="mt-6 relative ">
                          {renderMoreFilterItem(businessTypes)}
                        </div>
                      </div>

                      {/* Ratings & Status */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Ratings & Status</h3>
                        <div className="mt-6 relative ">
                          {renderMoreFilterItem(businessRatings)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird
                      onClick={() => {
                        if (onCategoryChange) onCategoryChange('');
                        closeModalMoreFilterMobile();
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Clear All
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={closeModalMoreFilterMobile}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply Filters
                    </ButtonPrimary>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  return (
    <div className="flex lg:space-x-4 pt-8 pb-6">
      {/* Back Button - Show when a category is selected */}
      {selectedCategory && (
        <button
          onClick={handleBackToAll}
          className="flex items-center justify-center px-4 py-2 text-sm rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-6000 text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
        >
          <i className="las la-arrow-left mr-2"></i>
          Back to All
        </button>
      )}
      
      <div className="hidden lg:flex space-x-4">
        {renderTabsBusinessCategory()}
        {renderTabMoreFilter()}
      </div>
      {renderTabMoreFilterMobile()}
      
      {/* Selected Category Display */}
      {selectedCategory && (
        <div className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm">
          <span>Showing: {selectedCategory}</span>
          <button 
            onClick={handleBackToAll}
            className="ml-2 text-primary-600 hover:text-primary-800"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default TabFilters;
