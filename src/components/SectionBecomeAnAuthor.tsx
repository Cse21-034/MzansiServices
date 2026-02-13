"use client";

import React, { FC, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Logo from "@/shared/Logo";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export interface SectionClaimListingProps {
  className?: string;
}

const SectionClaimListing: FC<SectionClaimListingProps> = ({
  className = "",
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleClaimClick = async () => {
    setIsSending(true);
    try {
      // Send notification email to marketing team
      await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "marketing",
          businessName: "New Business Inquiry - Listing Claim",
          businessOwnerEmail: "inquiry@namibiaservices.com",
          businessCategory: "Pending Registration",
        }),
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    } finally {
      setIsSending(false);
      // Redirect to add-listing page
      window.location.href = "/add-listing";
    }
  };

  return (
    <div
      className={`nc-SectionClaimListing relative flex flex-col lg:flex-row items-center ${className}`}
      data-nc-id="SectionClaimListing"
    >
      <div className="flex-shrink-0 mb-16 lg:mb-0 lg:mr-10 lg:w-2/5">
        <Logo className="w-20" />
        <h2 className="font-semibold text-3xl sm:text-4xl mt-6 sm:mt-11">
          Claim Your Business Listing
        </h2>
        <span className="block mt-6 text-neutral-500 dark:text-neutral-400">
          Take control of your business profile! Verify ownership and unlock powerful tools to manage your online presence, respond to reviews, update information, and attract more customers in Namibia.
        </span>

        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <span className="text-neutral-700 dark:text-neutral-300">
              Update business information anytime
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <span className="text-neutral-700 dark:text-neutral-300">
              Respond to customer reviews
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <span className="text-neutral-700 dark:text-neutral-300">
              Add photos and promotions
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <span className="text-neutral-700 dark:text-neutral-300">
              Access business analytics
            </span>
          </div>
        </div>

        <button
          onClick={handleClaimClick}
          disabled={isSending}
          className="mt-8 px-8 py-3 bg-burgundy-600 hover:bg-burgundy-800 disabled:opacity-50 text-white font-medium rounded-full transition-colors"
        >
          {isSending ? "Redirecting..." : "Claim Your Listing Now"}
        </button>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
          Already claimed? <a href="/login" className="text-burgundy-600 hover:underline">Sign in to manage</a>
        </p>
      </div>

      <div className="flex-grow lg:w-3/5">
        <DotLottieReact
          src="https://lottie.host/3c81c6d6-065f-4e3c-8345-591acde3a786/Ig244SMbea.lottie"
          loop
          autoplay
          style={{ height: '400px', width: '100%' }}
        />
        <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-4">
          Take control of your business profile today!
        </p>
      </div>
    </div>
  );
};

export default SectionClaimListing;