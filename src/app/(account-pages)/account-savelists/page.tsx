"use client";

import { Tab } from "@headlessui/react";
import StayCard from "@/components/StayCard";
import { DEMO_STAY_LISTINGS } from "@/data/listings";
import React, { Fragment, useState } from "react";
import ButtonSecondary from "@/shared/ButtonSecondary";

const AccountSavelists = () => {
  let [categories] = useState(["Saved Businesses", "Recently Viewed", "My Reviews"]);

  const renderSection1 = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-3xl font-semibold">My Business Lists</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Manage your saved businesses, browsing history, and reviews
          </p>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div>
          <Tab.Group>
            <Tab.List className="flex space-x-1 overflow-x-auto">
              {categories.map((item) => (
                <Tab key={item} as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${
                        selected
                          ? "bg-burgundy-600 text-white"
                          : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      } `}
                    >
                      {item}
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {/* Saved Businesses Tab */}
              <Tab.Panel className="mt-8">
                {DEMO_STAY_LISTINGS.filter((_, i) => i < 4).length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {DEMO_STAY_LISTINGS.filter((_, i) => i < 4).map((business) => (
                        <StayCard key={business.id} data={business} />
                      ))}
                    </div>
                    <div className="flex mt-11 justify-center items-center">
                      <ButtonSecondary>Show more saved businesses</ButtonSecondary>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💼</span>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                      No saved businesses yet
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                      Start saving your favorite Namibia businesses to access them quickly later
                    </p>
                    <ButtonSecondary>Explore Businesses</ButtonSecondary>
                  </div>
                )}
              </Tab.Panel>

              {/* Recently Viewed Tab */}
              <Tab.Panel className="mt-8">
                {DEMO_STAY_LISTINGS.filter((_, i) => i >= 4 && i < 8).length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {DEMO_STAY_LISTINGS.filter((_, i) => i >= 4 && i < 8).map((business) => (
                        <StayCard key={business.id} data={business} />
                      ))}
                    </div>
                    <div className="flex mt-11 justify-center items-center">
                      <ButtonSecondary>Clear browsing history</ButtonSecondary>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👀</span>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                      No recent views
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                      Businesses you view will appear here for quick access
                    </p>
                    <ButtonSecondary>Start Browsing</ButtonSecondary>
                  </div>
                )}
              </Tab.Panel>

              {/* My Reviews Tab */}
              <Tab.Panel className="mt-8">
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    Your reviews will appear here
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                    Share your experiences with Namibia businesses to help others make better decisions
                  </p>
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Reviews written</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Helpful votes</span>
                      <span className="font-semibold">0</span>
                    </div>
                  </div>
                  <ButtonSecondary className="mt-6">Write Your First Review</ButtonSecondary>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    );
  };

  return renderSection1();
};

export default AccountSavelists;