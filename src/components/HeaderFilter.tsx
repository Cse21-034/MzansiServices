"use client";

import React, { FC, useEffect, useState, ReactNode } from "react";
import Heading from "@/shared/Heading";
import Nav from "@/shared/Nav";
import NavItem from "@/shared/NavItem";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export interface HeaderFilterProps {
  tabActive: string;
  tabs: string[];
  heading: ReactNode;
  subHeading?: ReactNode;
  onClickTab?: (item: string) => void;
  onTabClick?: (item: string) => void; // Add onTabClick for compatibility
  showViewAll?: boolean;
  viewAllHref?: string;
}

const HeaderFilter: FC<HeaderFilterProps> = ({
  tabActive,
  tabs,
  subHeading = "",
  heading = "Latest Articles 🎈",
  onClickTab = () => {},
  onTabClick = () => {}, // Add default for onTabClick
  showViewAll = true,
  viewAllHref = "/listing-stay",
}) => {
  const [tabActiveState, setTabActiveState] = useState(tabActive);

  useEffect(() => {
    setTabActiveState(tabActive);
  }, [tabActive]);

  const handleClickTab = (item: string) => {
    // Call both onClickTab and onTabClick for backward compatibility
    onClickTab(item);
    onTabClick(item);
    setTabActiveState(item);
  };

  return (
    <div className="flex flex-col mb-8 relative">
      <Heading desc={subHeading}>{heading}</Heading>
      <div className="flex items-center justify-between">
        <Nav
          className="sm:space-x-2"
          containerClassName="relative flex w-full overflow-x-auto text-sm md:text-base hiddenScrollbar"
        >
          {tabs.map((item, index) => (
            <NavItem
              key={index}
              isActive={tabActiveState === item}
              onClick={() => handleClickTab(item)}
            >
              {item}
            </NavItem>
          ))}
        </Nav>
        {showViewAll && (
          <span className="hidden sm:block flex-shrink-0">
            <ButtonSecondary href={viewAllHref} className="!leading-none">
              <div className="flex items-center justify-center">
                <span>View all</span>
                <ArrowRightIcon className="w-5 h-5 ml-3" />
              </div>
            </ButtonSecondary>
          </span>
        )}
      </div>
    </div>
  );
};

export default HeaderFilter;
