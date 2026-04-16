import React from "react";
import { ReactNode } from "react";

export interface Heading2Props {
  heading?: ReactNode;
  subHeading?: ReactNode;
  className?: string;
  resultsCount?: number;
  location?: string;
  category?: string;
}

const Heading2: React.FC<Heading2Props> = ({
  className = "",
  heading = "Businesses Across Namibia",
  subHeading,
  resultsCount = 0,
  location = "Namibia",
  category = "All Categories",
}) => {
  return (
    <div className={`pt-12 pb-8 lg:pt-16 lg:pb-12 ${className}`}>
      <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 dark:text-white">
        {heading}
      </h2>
      {subHeading ? (
        subHeading
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-neutral-600 dark:text-neutral-400 mt-3">
          <span className="flex items-center gap-1">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {resultsCount.toLocaleString()}
            </span>
            businesses found
          </span>
          
          <span className="hidden sm:block">·</span>
          
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </span>
          
          <span className="hidden sm:block">·</span>
          
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {category}
          </span>
        </div>
      )}
    </div>
  );
};

export default Heading2;
