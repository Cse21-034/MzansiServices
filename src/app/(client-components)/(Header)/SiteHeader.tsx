"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { usePathname } from "next/navigation";
import { useThemeMode } from "@/utils/useThemeMode";

export type SiteHeaders = "Header 1";

interface HomePageItem {
  name: string;
  slug: string;
}

let OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
};
let OBSERVER: IntersectionObserver | null = null;
const PAGES_HIDE_HEADER_BORDER: string[] = [
  "/listing-stay-detail"
];

const SiteHeader = () => {
  const pathname = usePathname();
  const [isTopOfPage, setIsTopOfPage] = useState(true);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toDark, toLight } = useThemeMode();

  // Check if we're on a dashboard page
  const isDashboardPage = pathname && (
    pathname.startsWith("/business") || 
    pathname.startsWith("/usersdashboard") ||
    pathname.startsWith("/namibiaservices")
  );

  // Define callbacks before effects
  const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      setIsTopOfPage(entry.isIntersecting);
    });
  };

  const handleScroll = () => {
    setIsTopOfPage(window.pageYOffset < 5);
  };

  // Handle scroll position tracking
  useEffect(() => {
    if (isDashboardPage) return;
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDashboardPage]);

  // Handle intersection observer
  useEffect(() => {
    if (isDashboardPage || !anchorRef.current) return;

    if (!PAGES_HIDE_HEADER_BORDER.includes(pathname)) {
      if (OBSERVER) {
        OBSERVER.disconnect();
        OBSERVER = null;
      }
      return;
    }

    OBSERVER = new IntersectionObserver(intersectionCallback, OPTIONS);
    OBSERVER.observe(anchorRef.current);
    
    return () => {
      if (OBSERVER) {
        OBSERVER.disconnect();
        OBSERVER = null;
      }
    };
  }, [pathname, isDashboardPage]);

  const renderHeader = () => {
    // Don't render header in dashboard pages
    if (isDashboardPage) {
      return null;
    }

    let headerClassName = "shadow-sm dark:border-b dark:border-neutral-700";
    if (PAGES_HIDE_HEADER_BORDER.includes(pathname)) {
      headerClassName = isTopOfPage
        ? ""
        : "shadow-sm dark:border-b dark:border-neutral-700";
    }
    
    return <Header 
      className={headerClassName} 
      navType="MainNav1" 
    />;
  };

  return (
    <>
      {renderHeader()}
      <div ref={anchorRef} className="h-1 absolute invisible"></div>
    </>
  );
};

export default SiteHeader;
