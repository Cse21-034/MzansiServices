"use client";

import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import NcInputNumber from "@/components/NcInputNumber";
import React, { FC, useState } from "react";
import DatePicker from "react-datepicker";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing9Props {}

const PageAddListing9: FC<PageAddListing9Props> = () => {
  const { formData, updateFormData } = useAddListing();
  const [dates, setDates] = useState<number[]>([
    new Date("2023/02/06").getTime(),
    new Date("2023/02/09").getTime(),
    new Date("2023/02/15").getTime(),
  ]);

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
        {/* ITEM - Note: NcInputNumber doesn't expose onChange, may need custom component */}
        <NcInputNumber 
          label="Nights min" 
          defaultValue={formData.minNights || 1} 
        />
        <NcInputNumber 
          label="Nights max" 
          defaultValue={formData.maxNights || 99} 
        />
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
            let newDates = [];

            if (!date) {
              return;
            }
            const newTime = date.getTime();
            if (dates.includes(newTime)) {
              newDates = dates.filter((item) => item !== newTime);
            } else {
              newDates = [...dates, newTime];
            }
            setDates(newDates);
          }}
          // selected={startDate}
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
