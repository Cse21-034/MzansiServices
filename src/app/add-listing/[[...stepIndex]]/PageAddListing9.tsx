"use client";

import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import Input from "@/shared/Input";
import React, { FC, useState } from "react";
import DatePicker from "react-datepicker";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing9Props {}

const PageAddListing9: FC<PageAddListing9Props> = () => {
  const { formData, updateFormData } = useAddListing();
  const [dates, setDates] = useState<number[]>(formData.blockedDates || []);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">How long can guests stay?</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          {` Shorter trips can mean more reservations, but you'll turn over your
          space more often.`}
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-7">
        {/* ITEM - Min Nights */}
        <div>
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Minimum nights per stay
          </label>
          <Input 
            type="number"
            placeholder="1"
            value={formData.minNights || 1}
            onChange={(e) => updateFormData({ minNights: parseInt(e.target.value) || 1 })}
            min="1"
          />
        </div>
        {/* ITEM - Max Nights */}
        <div>
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Maximum nights per stay
          </label>
          <Input 
            type="number"
            placeholder="365"
            value={formData.maxNights || 365}
            onChange={(e) => updateFormData({ maxNights: parseInt(e.target.value) || 365 })}
            min="1"
          />
        </div>
      </div>

      {/*  */}
      <div>
        <h2 className="text-2xl font-semibold">Set your availability</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Editing your calendar is easy—just select a date to block or unblock
          it. You can always make changes after you publish.
        </span>
      </div>

      <div className="addListingDatePickerExclude">
        <DatePicker
          onChange={(date) => {
            let newDates = [...dates];

            if (!date) {
              return;
            }
            const newTime = date.getTime();
            if (newDates.includes(newTime)) {
              newDates = newDates.filter((item) => item !== newTime);
            } else {
              newDates = [...newDates, newTime];
            }
            setDates(newDates);
            updateFormData({ blockedDates: newDates });
          }}
          monthsShown={2}
          showPopperArrow={false}
          excludeDates={dates.filter(Boolean).map((item) => new Date(item))}
          inline
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          renderDayContents={(day, date) => (
            <DatePickerCustomDay dayOfMonth={day} date={date} />
          )}
        />
      </div>
    </>
  );
};

export default PageAddListing9;
