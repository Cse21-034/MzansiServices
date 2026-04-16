"use client";

import React, { FC, useState } from "react";
import StaySearchForm from "./(stay-search-form)/StaySearchForm";

export type SearchTab = "Stays";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: SearchTab;
  currentPage?: "Stays";
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Stays",
  currentPage,
}) => {
  const tabs: SearchTab[] = ["Stays"];
  const [tabActive, setTabActive] = useState<SearchTab>(currentTab);

  const renderTab = () => {
    // Render a static dark-colored heading instead of tabs
    return (
      <div className="ml-0 sm:ml-0 md:ml-0 text-left mb-4"> {/* Reduced left margin and added bottom margin */}
        <span className="font-bold text-2xl md:text-3xl xl:text-4xl text-neutral-800 dark:text-neutral-100">
          Find Your Next Great Service 
        </span>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div>
        <StaySearchForm />
      </div>
    );
  };

  return (
    <div
      className={`nc-HeroSearchForm w-full max-w-full py-5 lg:py-0 ${className}`}
    >
      {renderTab()}
      {renderForm()}
    </div>
  );
};

export default HeroSearchForm;
