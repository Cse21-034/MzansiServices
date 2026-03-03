"use client";

import React, { useEffect, useRef } from "react";

interface ExternalAdProps {
  scriptSrc: string;
  className?: string;
  containerId?: string;
  syncMode?: boolean; // For scripts that use document.write()
}

const ExternalAdScript: React.FC<ExternalAdProps> = ({ 
  scriptSrc, 
  className = "", 
  containerId = "external-ad-container",
  syncMode = true // Default to sync mode for partnership scripts that use document.write()
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (syncMode) {
      // For scripts that use document.write(), use iframe approach
      try {
        // Create iframe
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.minHeight = "250px";
        iframe.frameBorder = "0";
        iframe.scrolling = "no";

        // Clear container and add iframe
        container.innerHTML = "";
        container.appendChild(iframe);

        // Write content to iframe that will load the external script
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`
            <html>
            <head><style>body { margin: 0; padding: 0; }</style></head>
            <body>
              <script type="text/javascript" src="${scriptSrc}"><\/script>
              <script type="text/javascript">
                // Make all links open in parent window/new tab
                function makeLinksTargetBlank() {
                  try {
                    const links = document.querySelectorAll('a');
                    links.forEach(link => {
                      link.setAttribute('target', '_blank');
                      link.setAttribute('rel', 'noopener noreferrer');
                    });
                  } catch (e) {
                    console.log('Could not modify links');
                  }
                }
                
                // Run on load and also watch for dynamically added links
                document.addEventListener('DOMContentLoaded', makeLinksTargetBlank);
                makeLinksTargetBlank();
                
                // Also check periodically for new links added by the ad script
                setTimeout(makeLinksTargetBlank, 500);
                setTimeout(makeLinksTargetBlank, 1000);
              <\/script>
            </body>
            </html>
          `);
          iframeDoc.close();
          console.log("Ad script injected via iframe:", scriptSrc);
        }
      } catch (error) {
        console.error("Failed to inject ad script via iframe:", scriptSrc, error);
      }
    } else {
      // Asynchronous mode for modern ad networks
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = scriptSrc;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        console.error("Failed to load ad script:", scriptSrc);
      };

      script.onload = () => {
        console.log("Ad script loaded successfully:", scriptSrc);
      };

      container.innerHTML = "";
      container.appendChild(script);

      return () => {
        if (script.parentNode === container) {
          container.removeChild(script);
        }
      };
    }
  }, [scriptSrc, syncMode]);

  return (
    <div
      ref={containerRef}
      id={containerId}
      className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 ${className}`}
      style={{ minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* Placeholder - will be replaced by ad content */}
    </div>
  );
};

export default ExternalAdScript;
