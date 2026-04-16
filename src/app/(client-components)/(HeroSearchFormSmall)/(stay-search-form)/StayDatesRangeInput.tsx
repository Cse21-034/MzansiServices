"use client";

import React, { Fragment, useState, FC } from "react";
import { Popover, Transition } from "@headlessui/react";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePicker from "react-datepicker";
import ClearDataButton from "../ClearDataButton";

export interface StayDatesRangeInputProps {
  className?: string;
  fieldClassName?: string;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  className = "[ lg:nc-flex-2 ]",
  fieldClassName = "[ nc-hero-field-padding--small ]",
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const renderInput = () => {
    return (
      <>
        <div className="flex-grow text-left">
          <span className="block xl:text-base font-semibold">
            {startDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            }) || "Any date"}
            {endDate
              ? " - " +
                endDate?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })
              : ""}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {"When do you need it?"}
          </span>
        </div>
      </>
    );
  };

  return (
    <Popover className={`StayDatesRangeInput z-10 relative flex ${className}`}>
      {({ open }) => (
        <>
          <Popover.Button
            className={`flex-1 z-10 flex relative ${fieldClassName} items-center space-x-3 focus:outline-none ${
              open ? "nc-hero-field-focused--2" : ""
            }`}
          >
            {renderInput()}
            {(startDate || endDate) && open && (
              <ClearDataButton onClick={() => onChangeDate([null, null])} />
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
            <Popover.Panel className="absolute left-0 lg:left-1/2 z-10 mt-3 top-full w-screen max-w-sm lg:-translate-x-1/2 transform px-2 sm:px-0">
              <div className="overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-4 lg:p-8">
                {/* Mobile-friendly date picker with single month on small screens */}
                <div className="block lg:hidden">
                  <DatePicker
                    selected={startDate}
                    onChange={onChangeDate}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    monthsShown={1}
                    showPopperArrow={false}
                    inline
                    renderCustomHeader={(p) => (
                      <DatePickerCustomHeaderTwoMonth {...p} />
                    )}
                    renderDayContents={(day, date) => (
                      <DatePickerCustomDay dayOfMonth={day} date={date} />
                    )}
                  />
                </div>
                
                {/* Desktop date picker with two months */}
                <div className="hidden lg:block">
                  <DatePicker
                    selected={startDate}
                    onChange={onChangeDate}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    monthsShown={2}
                    showPopperArrow={false}
                    inline
                    renderCustomHeader={(p) => (
                      <DatePickerCustomHeaderTwoMonth {...p} />
                    )}
                    renderDayContents={(day, date) => (
                      <DatePickerCustomDay dayOfMonth={day} date={date} />
                    )}
                  />
                </div>

                {/* Quick selection buttons for mobile */}
                <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
                  <button
                    onClick={() => {
                      const today = new Date();
                      setStartDate(today);
                      setEndDate(today);
                    }}
                    className="px-3 py-2 text-xs bg-primary/10 hover:bg-primary/20 text-primary-700 rounded-lg transition-colors duration-200 dark:bg-primary/20 dark:hover:bg-primary/30 dark:text-primary-300"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const tomorrow = new Date(today);
                      tomorrow.setDate(today.getDate() + 1);
                      setStartDate(today);
                      setEndDate(tomorrow);
                    }}
                    className="px-3 py-2 text-xs bg-secondary/10 hover:bg-secondary/20 text-secondary-700 rounded-lg transition-colors duration-200 dark:bg-secondary/20 dark:hover:bg-secondary/30 dark:text-secondary-300"
                  >
                    Next 2 days
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const nextWeek = new Date(today);
                      nextWeek.setDate(today.getDate() + 7);
                      setStartDate(today);
                      setEndDate(nextWeek);
                    }}
                    className="px-3 py-2 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors duration-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-300"
                  >
                    This week
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default StayDatesRangeInput;
