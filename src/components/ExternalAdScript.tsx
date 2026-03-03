"use client";

import React, { useEffect } from "react";

interface ExternalAdProps {
  scriptSrc: string;
  className?: string;
  containerId?: string;
}

const ExternalAdScript: React.FC<ExternalAdProps> = ({ 
  scriptSrc, 
  className = "", 
  containerId = "external-ad-container" 
}) => {
  useEffect(() => {
    // Create a new script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;

    // Optional: Handle script loading errors
    script.onerror = () => {
      console.error("Failed to load ad script:", scriptSrc);
    };

    script.onload = () => {
      console.log("Ad script loaded successfully:", scriptSrc);
    };

    // Get the container and append the script
    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, [scriptSrc, containerId]);

  return (
    <div
      id={containerId}
      className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 ${className}`}
      style={{ minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* Placeholder while ad loads */}
      <div className="text-center text-neutral-500 dark:text-neutral-400">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ExternalAdScript;
