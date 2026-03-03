"use client";

import React, { FC } from "react";
import Textarea from "@/shared/Textarea";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing6Props {}

const PageAddListing6: FC<PageAddListing6Props> = () => {
  const { formData, updateFormData } = useAddListing();

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">
          Your place description for client
        </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Mention the best features of your accommodation, any special amenities
          like fast Wi-Fi or parking, as well as things you like about the
          neighborhood.
        </span>
      </div>

      <Textarea 
        placeholder="Describe your place..." 
        rows={14} 
        value={formData.description}
        onChange={(e) => updateFormData({ description: e.target.value })}
      />
    </>
  );
};

export default PageAddListing6;
