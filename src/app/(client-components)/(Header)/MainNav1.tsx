"use client";

import React, { FC, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/shared/Logo";
import Navigation from "@/shared/Navigation/Navigation";
import SearchDropdown from "./SearchDropdown";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import MenuBar from "@/shared/MenuBar";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import HeroSearchForm2MobileFactory from "../(HeroSearchForm2Mobile)/HeroSearchForm2MobileFactory";
import WeatherWidget from "@/components/WeatherWidget";
import Link from "next/link";
import {
  UserIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
  ViewColumnsIcon
} from "@heroicons/react/24/outline";

export interface MainNav1Props {
  className?: string;
  isDashboard?: boolean;
}

// Helper function to get dashboard link based on user role
const getDashboardLink = (role?: string) => {
  if (!role) return null;
  switch (role) {
    case "ADMIN":
      return "/namibiaservices";
    case "BUSINESS":
      return "/business";
    case "USER":
      return "/usersdashboard";
    default:
      return null;
  }
};

// Auth buttons component
const AuthButtons = () => {
  // Always declare hooks at the top level
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (status === "loading") {
    return (
      <ButtonPrimary className="self-center opacity-50" disabled>
        Loading...
      </ButtonPrimary>
    );
  }

  if (!session?.user) {
    return (
      <ButtonPrimary className="self-center" href="/login">
        Sign In
      </ButtonPrimary>
    );
  }

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className="flex items-center gap-2 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none"
          >
            <div className="relative flex-shrink-0 w-8 h-8">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="rounded-full"
                  fill
                  sizes="32px"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-neutral-100 dark:bg-neutral-800 rounded-full">
                  <UserIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                </div>
              )}
            </div>
            <span className="hidden sm:inline-block font-medium truncate">
              {session.user.name || session.user.email}
            </span>
            <ChevronDownIcon className="w-4 h-4" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-56 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-700">
              <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {session.user.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {session.user.email}
                </p>
              </div>
              <div className="p-1">
                {getDashboardLink(session.user.role) && (
                  <button
                    onClick={() => handleNavigate(getDashboardLink(session.user.role)!)}
                    className="flex items-center gap-2 w-full p-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                  >
                    <ViewColumnsIcon className="w-5 h-5" />
                    Dashboard
                  </button>
                )}
                <Link
                  href="/settings"
                  className="flex items-center gap-2 w-full p-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                >
                  <Cog8ToothIcon className="w-5 h-5" />
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 w-full p-2 text-sm text-red-600 dark:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

const MainNav1: FC<MainNav1Props> = ({ className = "", isDashboard = false }) => {
  const { data: session } = useSession();

  return (
    <div className={`nc-MainNav1 relative z-10 ${className}`}>
      <div className="px-4 lg:container h-20 relative flex justify-between items-center">
        <div className="hidden md:flex justify-start flex-1 space-x-4 sm:space-x-10">
          <Logo className="w-32 self-center" />
          {!isDashboard && <Navigation />}
        </div>

        {!isDashboard && (
          <div className="flex md:hidden w-full">
            <HeroSearchForm2MobileFactory />
          </div>
        )}

        <div className="hidden md:flex flex-shrink-0 justify-end flex-1 lg:flex-none text-neutral-700 dark:text-neutral-100">
          <div className="flex items-center gap-2 lg:gap-3 xl:gap-4">
            <SwitchDarkMode />
            <WeatherWidget />
            <ButtonSecondary href="/signup?tab=business-registration" className="border-2 border-burgundy-600 text-burgundy-600 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 dark:border-burgundy-500 dark:text-burgundy-400">
              List Your Business
            </ButtonSecondary>
            <AuthButtons />
            {isDashboard && session?.user && (
              <Link
                href="/"
                className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Return to Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav1;
