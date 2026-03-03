/**
 * Reusable Ad Layout Component
 * This component provides a consistent ad placement strategy across pages
 */

"use client";

import React, { ReactNode } from "react";
import SidebarAd from "./SidebarAd";
import StickyAd from "./StickyAd";

interface AdLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showSticky?: boolean;
  stickyPosition?: 'bottom-left' | 'bottom-right' | 'top-right';
}

export const AdLayout: React.FC<AdLayoutProps> = ({
  children,
  showSidebar = true,
  showSticky = true,
  stickyPosition = 'bottom-right',
}) => {
  return (
    <div className="relative">
      {showSticky && <StickyAd position={stickyPosition} />}
      
      <div className={showSidebar ? "grid grid-cols-1 lg:grid-cols-3 gap-6" : ""}>
        <div className={showSidebar ? "lg:col-span-2" : "w-full"}>
          {children}
        </div>
        
        {showSidebar && (
          <div className="lg:col-span-1">
            <SidebarAd />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdLayout;
