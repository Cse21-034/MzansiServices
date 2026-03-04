"use client";

import React from "react";
import { FC } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { Route } from "@/routers/types";
import { useRouter } from "next/navigation";
import { useAddListing } from "@/contexts/AddListingContext";
import { AddListingProvider } from "@/contexts/AddListingContext";

export interface CommonLayoutProps {
  children: React.ReactNode;
  params: {
    stepIndex: string;
  };
}

const CommonLayout: FC<CommonLayoutProps> = ({ children, params }) => {
  return (
    <AddListingProvider>
      <CommonLayoutContent children={children} params={params} />
    </AddListingProvider>
  );
};

const CommonLayoutContent: FC<CommonLayoutProps> = ({ children, params }) => {
  const router = useRouter();
  const { publishListing, isPublishing, error } = useAddListing();
  const index = Number(params.stepIndex) || 1;
  const nextHref = (
    index < 10 ? `/add-listing/${index + 1}` : `/add-listing/${1}`
  ) as Route;
  const backtHref = (
    index > 1 ? `/add-listing/${index - 1}` : `/add-listing/${1}`
  ) as Route;
  const nextBtnText = index > 9 ? "Publish listing" : "Continue";

  const handleNext = async () => {
    if (index >= 10) {
      // Final step - publish the listing
      try {
        await publishListing();
        // Success - redirect to success page
        router.push("/add-listing/success");
      } catch (err) {
        console.error("Failed to publish listing:", err);
        // Error is already set in context, will be displayed
      }
    } else {
      // Regular navigation
      router.push(nextHref);
    }
  };

  return (
    <div
      className={`nc-PageAddListing1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}
    >
      <div className="space-y-11">
        <div>
          <span className="text-4xl font-semibold">{index}</span>{" "}
          <span className="text-lg text-neutral-500 dark:text-neutral-400">
            / 10
          </span>
        </div>

        {/* Display error if any */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* --------------------- */}
        <div className="listingSection__wrap ">{children}</div>

        {/* --------------------- */}
        <div className="flex justify-end space-x-5">
          <ButtonSecondary onClick={() => router.push(backtHref)} disabled={isPublishing}>
            Go back
          </ButtonSecondary>
          <ButtonPrimary onClick={handleNext} disabled={isPublishing}>
            {isPublishing ? "Publishing..." : nextBtnText || "Continue"}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default CommonLayout;
