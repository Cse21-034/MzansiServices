"use client";

import React, { FC } from "react";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing1Props {}

const PageAddListing1: FC<PageAddListing1Props> = () => {
  const { formData, updateFormData } = useAddListing();

  return (
    <>
      <h2 className="text-2xl font-semibold">Choosing listing categories</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* ITEM */}
        <FormItem
          label="Choose a property type"
          desc="Hotel: Professional hospitality businesses that usually have a unique style or theme defining their brand and decor"
        >
          <Select 
            value={formData.type} 
            onChange={(e) => updateFormData({ type: e.target.value })}
          >
            <option value="">Select a property type</option>
            <option value="Hotel">Hotel</option>
            <option value="Cottage">Cottage</option>
            <option value="Villa">Villa</option>
            <option value="Cabin">Cabin</option>
            <option value="Farm stay">Farm stay</option>
            <option value="Houseboat">Houseboat</option>
            <option value="Lighthouse">Lighthouse</option>
          </Select>
        </FormItem>
        <FormItem
          label="Place name"
          desc="A catchy name usually includes: House name + Room name + Featured property + Tourist destination"
        >
          <Input 
            placeholder="Places name" 
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
          />
        </FormItem>
        <FormItem
          label="Rental form"
          desc="Entire place: Guests have the whole place to themselves—there's a private entrance and no shared spaces. A bedroom, bathroom, and kitchen are usually included."
        >
          <Select
            value={formData.category}
            onChange={(e) => updateFormData({ category: e.target.value })}
          >
            <option value="">Select rental form</option>
            <option value="Entire place">Entire place</option>
            <option value="Private room">Private room</option>
            <option value="Share room">Share room</option>
          </Select>
        </FormItem>
      </div>
    </>
  );
};

export default PageAddListing1;
