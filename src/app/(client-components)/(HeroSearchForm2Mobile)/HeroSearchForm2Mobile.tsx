"use client";

import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ButtonSubmit from "./ButtonSubmit";
import { useTimeoutFn } from "react-use";
// import BusinessSearchFormMobile from "../(HeroSearchFormSmall)/BusinessSearchFormMobile"; // Removed
import { useRouter, useSearchParams } from "next/navigation";
import { MapPinIcon } from "@heroicons/react/24/outline"; // Added for location icon

const HeroSearchForm2Mobile = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchParams, setSearchParams] = useState({
    service: "",
    location: ""
  });
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  useEffect(() => {
    const service = urlSearchParams.get("search") || "";
    const location = urlSearchParams.get("location") || "";
    console.log("URL search params changed:", { service, location });
    setSearchParams({ service, location });
    console.log("Updated searchParams state:", { service, location });
  }, [urlSearchParams]);

  // FOR RESET ALL DATA WHEN CLICK CLEAR BUTTON
  const [showDialog, setShowDialog] = useState(false);
  let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1);

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
    resetIsShowingDialog();
  }

  const handleSearch = () => {
    // Perform search with searchParams.service and searchParams.location
    const params = new URLSearchParams();

    if (searchParams.service.trim()) {
      params.append('search', searchParams.service.trim());
    }

    if (searchParams.location.trim()) {
      params.append('location', searchParams.location.trim());
    }

    const queryString = params.toString();
    const url = queryString ? `/listing-stay?${queryString}` : '/listing-stay';
    router.push(url);
    closeModal();
  };

  const renderButtonOpenModal = () => {
    return (
      <div className="flex items-center w-full">
        <div className="flex-shrink-0 mr-2">
          <Image src="/images/mzansi-logo/squarelogo.PNG" alt="Logo" width={56} height={56} className="rounded-full" />
        </div>
        <button
          onClick={openModal}
          className="relative flex items-center flex-1 border border-neutral-200 dark:border-neutral-6000 px-4 py-2 pr-11 rounded-full shadow-lg min-w-0"
        >
          <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5" />
          <div className="ml-3 flex-1 text-left overflow-hidden">
            <span className="block font-medium text-sm">
              {searchParams.service || "Find Businesses"}
            </span>
            <span className="block mt-0.5 text-xs font-light text-neutral-500 dark:text-neutral-400 ">
              <span className="line-clamp-1">
                {searchParams.service ? `${searchParams.service} • ${searchParams.location || "Anywhere"}` : "Search for any service or business"}
              </span>
            </span>
          </div>
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-6000 dark:text-neutral-300">
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              className="block w-4 h-4"
              fill="currentColor"
            >
              <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
            </svg>
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="HeroSearchForm2Mobile">
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-max"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative h-full overflow-hidden flex-1 flex flex-col justify-between ">
                  {showDialog && (
                    <>
                      <div className="absolute left-4 top-4">
                        <button className="" onClick={closeModal}>
                          <XMarkIcon className="w-5 h-5 text-black dark:text-white" />
                        </button>
                      </div>

                      <div className="flex-1 pt-3 px-1.5 sm:px-4 flex overflow-hidden">
                        <div className="flex-1 overflow-y-auto hiddenScrollbar py-4">
                          <div className="transition-opacity animate-[myblur_0.4s_ease-in-out]">
                            <div className="p-4">
                              <div className="space-y-4">
                                {/* Service Search */}
                                <div>
                                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    What service are you looking for?
                                  </label>
                                  <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                      type="text"
                                      placeholder="e.g., restaurants, hotels, doctors"
                                      value={searchParams.service}
                                      onChange={(e) => setSearchParams({ ...searchParams, service: e.target.value })}
                                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                    />
                                  </div>
                                </div>

                                {/* Location Search */}
                                <div>
                                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    Where in Namibia?
                                  </label>
                                  <div className="relative">
                                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                      type="text"
                                      placeholder="e.g., Windhoek, Walvis Bay, Swakopmund"
                                      value={searchParams.location}
                                      onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
                        <button
                          type="button"
                          className="underline font-semibold flex-shrink-0"
                          onClick={() => {
                            setSearchParams({ service: "", location: "" });
                            setShowDialog(false);
                            resetIsShowingDialog();
                          }}
                        >
                          Clear all
                        </button>
                        <ButtonSubmit
                          onClick={handleSearch}
                        />
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default HeroSearchForm2Mobile;
