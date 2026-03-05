"use client";

import React, { FC, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import { useAddListing } from "@/contexts/AddListingContext";

export interface PageAddListing5Props {}

const PageAddListing5: FC<PageAddListing5Props> = () => {
  const { formData, updateFormData } = useAddListing();
  const [newRule, setNewRule] = useState("");

  const renderRadio = (
    name: string,
    id: string,
    label: string,
    value: string,
    isSelected: boolean,
    onChange: () => void
  ) => {
    return (
      <div className="flex items-center">
        <input
          checked={isSelected}
          onChange={onChange}
          id={id + name}
          name={name}
          type="radio"
          className="focus:ring-primary-500 h-6 w-6 text-primary-500 border-neutral-300 !checked:bg-primary-500 bg-transparent"
        />
        <label
          htmlFor={id + name}
          className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
      </div>
    );
  };

  const toggleFeature = (featureName: string) => {
    const currentFeatures = formData.features || [];
    // Find and remove existing smoking/pet/party policies
    const filtered = currentFeatures.filter(f => 
      !f.includes("smoking") && !f.includes("pets") && !f.includes("party")
    );
    // This is for radio - so we filter based on the category being changed
    updateFormData({ features: [...filtered, featureName] });
  };

  const renderNoInclude = (text: string, onRemove: () => void) => {
    return (
      <div className="flex items-center justify-between py-3">
        <span className="text-neutral-6000 dark:text-neutral-400 font-medium">
          {text}
        </span>
        <i 
          className="text-2xl text-neutral-400 las la-times-circle hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
          onClick={onRemove}
        ></i>
      </div>
    );
  };

  const rules = formData.rules ? formData.rules.split("|") : [];

  const handleAddRule = () => {
    if (newRule.trim()) {
      const updatedRules = [...rules, newRule].join("|");
      updateFormData({ rules: updatedRules });
      setNewRule("");
    }
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index).join("|");
    updateFormData({ rules: updatedRules });
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">
          Set house rules for your guests{" "}
        </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Guests must agree to your house rules before they book.
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* ITEM - Smoking */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Smoking Policy
          </label>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderRadio("Smoking", "S_Do", "Do not allow", "not-allow", 
              formData.features?.includes("no-smoking"), 
              () => toggleFeature("no-smoking"))}
            {renderRadio("Smoking", "S_Allow", "Allow", "allow", 
              formData.features?.includes("smoking"), 
              () => toggleFeature("smoking"))}
            {renderRadio("Smoking", "S_Charge", "Charge extra", "charge", 
              formData.features?.includes("smoking-charge"), 
              () => toggleFeature("smoking-charge"))}
          </div>
        </div>

        {/* ITEM - Pet */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Pet Policy
          </label>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderRadio("Pet", "P_Do", "Do not allow", "not-allow",
              formData.features?.includes("no-pets"),
              () => toggleFeature("no-pets"))}
            {renderRadio("Pet", "P_Allow", "Allow", "allow",
              formData.features?.includes("pets"),
              () => toggleFeature("pets"))}
            {renderRadio("Pet", "P_Charge", "Charge extra", "charge",
              formData.features?.includes("pets-charge"),
              () => toggleFeature("pets-charge"))}
          </div>
        </div>

        {/* ITEM - Party */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Party organizing
          </label>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderRadio("Party", "Party_Do", "Do not allow", "not-allow",
              formData.features?.includes("no-parties"),
              () => toggleFeature("no-parties"))}
            {renderRadio("Party", "Party_Allow", "Allow", "allow",
              formData.features?.includes("parties"),
              () => toggleFeature("parties"))}
            {renderRadio("Party", "Party_Charge", "Charge extra", "charge",
              formData.features?.includes("parties-charge"),
              () => toggleFeature("parties-charge"))}
          </div>
        </div>

        {/* ITEM - Cooking */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Cooking
          </label>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderRadio("Cooking", "C_Do", "Do not allow", "not-allow",
              formData.features?.includes("no-cooking"),
              () => toggleFeature("no-cooking"))}
            {renderRadio("Cooking", "C_Allow", "Allow", "allow",
              formData.features?.includes("cooking"),
              () => toggleFeature("cooking"))}
            {renderRadio("Cooking", "C_Charge", "Charge extra", "charge",
              formData.features?.includes("cooking-charge"),
              () => toggleFeature("cooking-charge"))}
          </div>
        </div>

        {/* Additional rules */}
        <div className=" border-b border-neutral-200 dark:border-neutral-700"></div>
        <span className="block text-lg font-semibold">Additional rules</span>
        <div className="flow-root">
          <div className="-my-3 divide-y divide-neutral-100 dark:divide-neutral-800">
            {rules.map((rule, idx) => renderNoInclude(rule, () => handleRemoveRule(idx)))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-5">
          <Input 
            className="!h-full" 
            placeholder="No smoking..." 
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
          />
          <ButtonPrimary onClick={handleAddRule} className="flex-shrink-0">
            <i className="text-xl las la-plus"></i>
            <span className="ml-3">Add tag</span>
          </ButtonPrimary>
        </div>
      </div>
    </>
  );
};

export default PageAddListing5;
