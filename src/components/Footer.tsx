"use client";

import Logo from "@/shared/Logo";
import SocialsList1 from "@/shared/SocialsList1";
import { CustomLink } from "@/data/types";
import React from "react";
import FooterNav from "./FooterNav";
import { useSession } from "next-auth/react";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const Footer: React.FC = () => {
  const { data: session } = useSession();

  const widgetMenus: WidgetFooterMenu[] = [
    ...(session?.user ? [] : [
      {
        id: "1",
        title: "For Businesses",
        menus: [
          { href: "/list-your-business", label: "List Your Business" },
          { href: "/advertise", label: "Advertise With Us" },
        ],
      },
    ]),
    {
      id: "2",
      title: "Explore Namibia",
      menus: [
        { href: "/categories", label: "Business Categories" },
      ],
    },
  ];

  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-xs sm:text-sm">
        <h2 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm sm:text-base">
          {menu.title}
        </h2>
        <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a
                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200 text-xs sm:text-sm"
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <FooterNav />

      <div className="nc-Footer relative py-12 lg:py-16 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="container grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
          <div className="flex flex-col sm:col-span-2 md:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <div className="flex items-center">
              <SocialsList1 className="flex items-center gap-3" />
            </div>
          </div>
          {widgetMenus.map(renderWidgetMenuItem)}
        </div>
        
        {/* Bottom section with developer credit */}
        <div className="container border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-6 sm:mt-10 sm:pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <p>&copy; {new Date().getFullYear()} Namibia Services. All rights reserved.</p>
            </div>
            <div className="text-xs sm:text-sm">
              <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                Developed by SolidCare Services
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
