"use client";

import React, { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/shared/Logo";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import Avatar from "@/shared/Avatar";
import SearchDropdown from "@/app/(client-components)/(Header)/SearchDropdown";
import { 
  UserIcon,
  HeartIcon,
  StarIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

export interface UserNavProps {
  className?: string;
}

const UserNav: FC<UserNavProps> = ({ className = "" }) => {
  const [notificationsCount, setNotificationsCount] = useState(3);
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session?.user) {
    return null;
  }

  return (
    <div className={`nc-UserNav relative z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 ${className}`}>
      <div className="px-4 lg:container h-20 relative flex justify-between items-center">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center justify-start flex-1 space-x-8">
          <Link href="/">
            <Logo className="w-24" />
          </Link>
          <nav className="hidden xl:flex items-center space-x-8">
            <Link
              href="/usersdashboard"
              className={`font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
                pathname === '/usersdashboard' ? 'font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-1' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/usersdashboard?tab=reviews"
              className={`font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors`}
            >
              My Reviews
            </Link>
            <Link
              href="/usersdashboard?tab=favorites"
              className={`font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors`}
            >
              Favorites
            </Link>
            <Link
              href="/usersdashboard?tab=bookings"
              className={`font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors`}
            >
              Bookings
            </Link>
          </nav>
        </div>

        {/* Right Section - User Menu & Actions */}
        <div className="flex items-center justify-end flex-1 space-x-4">
          {/* Search */}
          <div className="hidden lg:block">
            <SearchDropdown className="flex items-center" />
          </div>

          {/* Add Review Button */}
          <div className="hidden md:block">
            <ButtonPrimary className="!px-4">
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Review
            </ButtonPrimary>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative">
              <BellIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </button>
          </div>

          {/* Theme Toggle */}
          <SwitchDarkMode />

          {/* User Avatar Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Avatar 
                imgUrl={session.user.image || undefined}
                sizeClass="w-8 h-8"
                userName={session.user.name || session.user.email || ''}
              />
              <div className="hidden md:block text-left">
                <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                  {session.user.name || session.user.email}
                </div>
                <div className="text-xs text-neutral-500">{session.user.role} Account</div>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-neutral-500" />
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              
              <div className="p-2">
                <a
                  href="/usersdashboard?tab=profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>My Profile</span>
                </a>
                <a
                  href="/usersdashboard?tab=reviews"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  <StarIcon className="w-5 h-5" />
                  <span>My Reviews</span>
                </a>
                <a
                  href="/usersdashboard?tab=favorites"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  <HeartIcon className="w-5 h-5" />
                  <span>Favorites</span>
                </a>
                <a
                  href="/usersdashboard?tab=settings"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>Settings</span>
                </a>
                <div className="border-t border-neutral-200 dark:border-neutral-700 my-2"></div>
                <button className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-red-600 w-full text-left">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNav;