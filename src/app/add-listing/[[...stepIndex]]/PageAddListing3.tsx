"use client";

import NcInputNumber from "@/components/NcInputNumber";
import React, { FC } from "react";
import Select from "@/shared/Select";
import FormItem from "../FormItem";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing3Props {}

const PageAddListing3: FC<PageAddListing3Props> = () => {
  const { formData, updateFormData } = useAddListing();

  return (
    <>
      <h2 className="text-2xl font-semibold">Size of your location</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* ITEM */}
        <FormItem label="Acreage (m2)">
          <Select value={formData.features?.[0] || ""} onChange={(e) => updateFormData({ features: [e.target.value] })}>
            <option value="">Select size</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
          </Select>
        </FormItem>
        <NcInputNumber 
          label="Guests" 
          defaultValue={1}
          // Note: NcInputNumber component doesn't expose value/onChange, update if needed
        />
        <NcInputNumber 
          label="Bedroom" 
          defaultValue={formData.beds}
        />
        <NcInputNumber 
          label="Beds" 
          defaultValue={formData.beds}
        />
        <NcInputNumber 
          label="Bathroom" 
          defaultValue={formData.baths}
        />
        <NcInputNumber 
          label="Kitchen" 
          defaultValue={1}
        />
      </div>
    </>
  );
};

export default PageAddListing3;
