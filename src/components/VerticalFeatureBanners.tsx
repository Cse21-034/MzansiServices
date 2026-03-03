"use client";

import React from "react";
import Image from "next/image";

interface FeatureBanner {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  link: string;
  badgeText?: string;
}

const VerticalFeatureBanners: React.FC = () => {
  // Square banners - real-world educational/tutorial style
  const banners: FeatureBanner[] = [
    {
      id: "1",
      title: "Digital Marketing Mastery",
      category: "Business",
      badgeText: "NEW",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-adf4e565016f?w=400&h=400&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "2",
      title: "Web Design Essentials",
      category: "Design",
      badgeText: "COURSE",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "3",
      title: "Business Growth Tips",
      category: "Strategy",
      badgeText: "TRENDING",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "4",
      title: "Development Basics",
      category: "Tutorial",
      badgeText: "GUIDE",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "5",
      title: "Entrepreneurship 101",
      category: "Business",
      badgeText: "FEATURED",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "6",
      title: "SEO Best Practices",
      category: "Marketing",
      badgeText: "POPULAR",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop&auto=format",
      link: "#",
    },
  ];

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white">
          <h2 className="text-2xl font-bold">Featured Resources</h2>
          <p className="text-burgundy-100 text-sm mt-1">Explore curated content to grow your business</p>
        </div>

        {/* Scrollable Banners Container */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 p-6 min-w-min">
            {banners.map((banner) => (
              <a
                key={banner.id}
                href={banner.link}
                className="group relative flex-shrink-0 w-48 h-48 overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Background Image */}
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="200px"
                  priority={parseInt(banner.id) <= 2}
                />

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300" />

                {/* Badge */}
                {banner.badgeText && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-block px-3 py-1 bg-burgundy-600 text-white text-xs font-bold rounded-full shadow-lg">
                      {banner.badgeText}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <div>
                    <span className="text-burgundy-300 text-xs font-semibold uppercase tracking-wider">
                      {banner.category}
                    </span>
                    <h3 className="text-white font-bold text-sm mt-2 line-clamp-2 group-hover:underline">
                      {banner.title}
                    </h3>
                  </div>
                </div>

                {/* Arrow Indicator */}
                <div className="absolute top-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 rounded-full p-2 backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 text-center">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            ← Scroll to see more →
          </span>
        </div>
      </div>

      {/* Hide scrollbar styling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default VerticalFeatureBanners;
