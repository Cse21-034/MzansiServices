"use client";

import React, { FC } from "react";
import Logo from "@/shared/Logo";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import Avatar from "@/shared/Avatar";
import { 
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export interface BusinessNavProps {
  className?: string;
  business?: {
    name?: string;
    category?: { name?: string };
    email?: string;
    photos?: { url: string }[];
  };
}

const BusinessNav: FC<BusinessNavProps> = ({ className = "", business }) => {
  // Safe business data with fallbacks
  const safeBusiness = {
    name: business?.name || "Business Name",
    category: business?.category || { name: "Not categorized" },
    email: business?.email || "",
    photos: business?.photos || []
  };

  // Get first photo URL safely, fallback to logo
  const firstPhotoUrl = safeBusiness.photos?.[0]?.url || "/images/namibia-logo/squarelogo.PNG";

  return (
    <div className={`nc-BusinessNav relative z-10 ${className}`}>
      <div className="px-4 lg:container h-20 relative flex justify-between items-center">
        {/* Left Section - Logo & Dashboard Link */}
        <div className="flex items-center justify-start flex-1 space-x-8">
          <Logo className="w-24" />
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/business"
              className="font-medium text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Dashboard
            </a>
          </nav>
        </div>

        {/* Right Section - Business Info & User Menu */}
        <div className="flex items-center justify-end flex-1 space-x-4">
          {/* Business Status */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]">
                {safeBusiness.name}
              </div>
              <div className="text-xs text-green-600 font-medium">
                ● {safeBusiness.category.name}
              </div>
            </div>
          </div>

          {/* Icons & Avatar */}
          <div className="flex items-center space-x-3">
            <SwitchDarkMode />

            {/* User Avatar Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Avatar 
                  sizeClass="w-8 h-8" 
                  imgUrl={firstPhotoUrl} 
                  userName={safeBusiness.name}
                />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {safeBusiness.name}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                    {safeBusiness.email}
                  </div>
                </div>
                <div className="p-2">
                  <a
                    href="/business/profile"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    <ChartBarIcon className="w-5 h-5" />
                    <span>Business Profile</span>
                  </a>
                  <div className="border-t border-neutral-200 dark:border-neutral-700 my-2"></div>
                  <button
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-red-600 w-full text-left"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessNav;