"use client";

import React from "react";
import Image from "next/image";

interface AdBanner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  category?: string;
}

const VerticalAdBanners: React.FC = () => {
  // Vertical square ad banners for left sidebar
  const adBanners: AdBanner[] = [
    {
      id: "1",
      title: "Premium Services",
      category: "Featured",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=300&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "2",
      title: "Growth Boost",
      category: "Special",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=300&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "3",
      title: "Expert Solutions",
      category: "Promoted",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e90f5fcfdd1?w=300&h=300&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "4",
      title: "Limited Offer",
      category: "Hot Deal",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "5",
      title: "Business Tools",
      category: "Resources",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-adf4e565016f?w=300&h=300&fit=crop&auto=format",
      link: "#",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="px-4 py-3 bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-lg shadow-md">
        <h3 className="text-white font-bold text-sm">Advertisements</h3>
      </div>

      <div className="space-y-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-burgundy-400 scrollbar-track-gray-200 dark:scrollbar-track-neutral-800">
        {adBanners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link}
            className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-40 bg-neutral-100 dark:bg-neutral-800"
          >
            {/* Background Image */}
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="280px"
              priority={parseInt(banner.id) <= 2}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300" />

            {/* Content */}
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
              <div>
                {banner.category && (
                  <span className="inline-block text-xs font-bold text-burgundy-300 uppercase tracking-wide mb-1">
                    {banner.category}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-white font-bold text-sm line-clamp-2 group-hover:text-burgundy-200 transition-colors">
                  {banner.title}
                </h4>
                <div className="mt-2 flex items-center text-white/80 group-hover:text-white transition-colors text-xs">
                  <span>Learn more</span>
                  <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="text-center pt-2 border-t border-neutral-200 dark:border-neutral-700">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">↓ Scroll for more ↓</span>
      </div>
    </div>
  );
};

export default VerticalAdBanners;
