"use client";

import React, { FC } from "react";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing8Props {}

const PageAddListing8: FC<PageAddListing8Props> = () => {
  const { formData, updateFormData } = useAddListing();

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Price your space</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          {` The host's revenue is directly dependent on the setting of rates and
            regulations on the number of guests, the number of nights, and the
            cancellation policy.`}
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* ITEM */}
        <FormItem label="Currency">
          <Select value={formData.currency} onChange={(e) => updateFormData({ currency: e.target.value })}>
            <option value="">Select currency</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="BWP">BWP (Botswana Pula)</option>
            <option value="ZAR">ZAR (South African Rand)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
            <option value="NAD">NAD (Namibian Dollar)</option>
          </Select>
        </FormItem>
        <FormItem label="Base price (Monday - Thursday)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input 
              className="!pl-8 !pr-10" 
              placeholder="0.00"
              type="number"
              value={formData.pricePerNight}
              onChange={(e) => updateFormData({ pricePerNight: parseFloat(e.target.value) || 0 })}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{formData.currency || "USD"}</span>
            </div>
          </div>
        </FormItem>
        {/* ----- */}
        <FormItem label="Base price (Friday - Sunday)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input 
              className="!pl-8 !pr-10" 
              placeholder="0.00"
              type="number"
              value={formData.weekendPrice}
              onChange={(e) => updateFormData({ weekendPrice: parseFloat(e.target.value) || 0 })}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{formData.currency || "USD"}</span>
            </div>
          </div>
        </FormItem>
        {/* ----- */}
        <FormItem label="Long term price (Monthly discount)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
            <Input 
              className="!pl-8 !pr-10" 
              placeholder="0.00"
              type="number"
              value={formData.monthlyDiscount}
              onChange={(e) => updateFormData({ monthlyDiscount: parseFloat(e.target.value) || 0 })}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">every month</span>
            </div>
          </div>
        </FormItem>
      </div>
    </>
  );
};

export default PageAddListing8;
