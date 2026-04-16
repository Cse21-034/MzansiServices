"use client";

import React, { useState, useEffect } from "react";
import adImg from "@/images/ad.png";
import adImg2 from "@/images/ads2.png";
import adImg3 from "@/images/ads3.jpg";
import Image from "next/image";

const AdRotation = () => {
  const [currentAd, setCurrentAd] = useState(0);

  const ads = [
    {
      id: 1,
      image: adImg,
      link: "https://example-advertiser-1.com",
      alt: "Premium Business Services",
    },
    // Add more ads as needed
    {
      id: 2,
      image: adImg2, // Replace with actual ad image
      link: "https://example-advertiser-2.com",
      alt: "Local Business Directory Pro",
    },
    {
      id: 3,
      image: adImg3, // Replace with actual ad image
      link: "https://example-advertiser-3.com",
      alt: "Namibia Business Network",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  const handleAdClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div 
              className="relative overflow-hidden bg-transparent"
              onClick={() => handleAdClick(ads[currentAd].link)}
            >
              {/* Full Banner Ad Image */}
              <div className="w-full h-full">
                <Image
                  src={ads[currentAd].image}
                  alt={ads[currentAd].alt}
                  width={1200}
                  height={300}
                  className="w-full h-auto object-cover rounded-2xl"
                  priority
                />
              </div>

              {/* Progress Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
                {ads.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentAd 
                        ? 'bg-burgundy-600 scale-110' 
                        : 'bg-white/70 scale-100'
                    }`}
                  />
                ))}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 rounded-2xl flex items-center justify-center">
                <span className="text-white bg-burgundy-600 px-6 py-3 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 font-semibold text-lg">
                  Click to Learn More
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Label */}
        <div className="text-center mt-4">
          <span className="text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-sm">
            Advertisement
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdRotation;
