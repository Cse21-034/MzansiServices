"use client";

import React from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="nc-PageAddListing1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32">
      <div className="space-y-11">
        <div>
          <h1 className="text-4xl font-bold mb-4">🎉 Congratulations!</h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-6">
            Your listing has been submitted successfully!
          </p>
        </div>

        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200">
              What's Next?
            </h2>
            <ul className="space-y-3 text-green-700 dark:text-green-300">
              <li className="flex items-start">
                <span className="mr-3 text-xl">✓</span>
                <span>Your listing is now pending review by our team</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-xl">✓</span>
                <span>You'll receive an email notification once it's approved</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-xl">✓</span>
                <span>
                  In the meantime, you can view and edit your listing from your dashboard
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <Link href="/">
            <ButtonPrimary>Return to Home</ButtonPrimary>
          </Link>
          <Link href="/usersdashboard">
            <ButtonPrimary>View My Listings</ButtonPrimary>
          </Link>
        </div>

        <div className="text-neutral-600 dark:text-neutral-400 text-sm">
          <p>Thank you for listing with us! We look forward to helping you reach more guests.</p>
        </div>
      </div>
    </div>
  );
}
