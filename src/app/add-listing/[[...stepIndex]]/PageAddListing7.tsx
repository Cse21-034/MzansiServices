"use client";

import React, { FC, useState } from "react";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing7Props {}

const PageAddListing7: FC<PageAddListing7Props> = () => {
  const { formData, updateFormData } = useAddListing();
  const [preview, setPreview] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isMultiple: boolean) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      
      // Show preview
      const previews = fileArray.map(file => URL.createObjectURL(file));
      if (isMultiple) {
        setPreview([...preview, ...previews]);
      } else {
        setPreview([previews[0]]);
      }
      
      // Store files in context
      if (isMultiple) {
        updateFormData({ images: [...(formData.images || []), ...fileArray] });
      } else {
        updateFormData({ images: [fileArray[0]] });
      }
    }
  };

  const ImageUploadZone = ({ 
    id, 
    label, 
    multiple = false 
  }: { 
    id: string; 
    label: string; 
    multiple?: boolean;
  }) => (
    <div>
      <span className="text-lg font-semibold">{label}</span>
      <div className="mt-5">
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
              <label
                htmlFor={id}
                className="relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload a file</span>
                <input
                  id={id}
                  name={id}
                  type="file"
                  multiple={multiple}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, multiple)}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Pictures of the place</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          A few beautiful photos will help customers have more sympathy for your
          property.
        </span>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        <ImageUploadZone id="file-upload" label="Cover image" multiple={false} />
        <ImageUploadZone id="file-upload-2" label="Pictures of the place" multiple={true} />
        
        {/* Preview */}
        {preview.length > 0 && (
          <div>
            <span className="text-lg font-semibold">Image Preview</span>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {preview.map((img, idx) => (
                <div key={idx} className="relative">
                  <img 
                    src={img} 
                    alt={`Preview ${idx}`} 
                    className="w-full h-24 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PageAddListing7;
