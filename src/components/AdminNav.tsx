"use client";

import React, { FC, useState } from "react";
import { signOut } from "next-auth/react";
import Logo from "@/shared/Logo";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import Avatar from "@/shared/Avatar";
import { 
  ChartBarIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

export interface AdminNavProps {
  className?: string;
  user?: {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
}

const AdminNav: FC<AdminNavProps> = ({ className = "", user }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={`nc-AdminNav relative z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 ${className}`}>
      <div className="px-4 lg:container h-20 relative flex justify-between items-center">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center justify-start flex-1 space-x-8">
          <Logo className="w-24" />
          <nav className="hidden xl:flex items-center space-x-8">
            <a
              href="/namibiaservices"
              className="font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1"
            >
              Dashboard
            </a>
          </nav>
        </div>

        {/* Center Section - Search */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search businesses, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-full bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
            />
          </div>
        </div>

        {/* Right Section - User Menu & Actions */}
        <div className="flex items-center justify-end flex-1 space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative">
              <BellIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900"></span>
            </button>
          </div>


          {/* User Avatar Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Avatar sizeClass="w-8 h-8" imgUrl={user?.avatarUrl} />
              <div className="hidden md:block text-left">
                <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                  {user?.name}
                </div>
                <div className="text-xs text-neutral-500">{user?.role}</div>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-neutral-500" />
            </button>
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {user?.name}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {user?.email}
                </div>
              </div>
              <div className="p-2">
                <a
                  href="/namibiaservices/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  <span>Profile</span>
                </a>
                <a
                  href="/namibiaservices/settings"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  <span>Settings</span>
                </a>
                <div className="border-t border-neutral-200 dark:border-neutral-700 my-2"></div>
                <button
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-red-600 w-full text-left"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <SwitchDarkMode />
            <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Cog6ToothIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
