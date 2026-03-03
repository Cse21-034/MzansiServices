"use client";

import React from "react";
import Image from "next/image";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

const TopStoriesBanners: React.FC = () => {
  // Using direct Unsplash image URLs - high quality, no API key needed
  const banners: Banner[] = [
    {
      id: "1",
      title: "Business Spotlight",
      subtitle: "Featured Success Stories",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "2",
      title: "Industry Insights",
      subtitle: "Market Trends & Updates",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "3",
      title: "Growth Strategies",
      subtitle: "Expand Your Reach",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&auto=format",
      link: "#",
    },
    {
      id: "4",
      title: "Success Toolkit",
      subtitle: "Resources & Tools",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e90f5fcfdd1?w=400&h=300&fit=crop&auto=format",
      link: "#",
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Top Stories</h3>
      <div className="space-y-3">
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link}
            className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-24"
          >
            {/* Background Image */}
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="300px"
              priority={parseInt(banner.id) <= 2}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent group-hover:from-black/80 group-hover:via-black/60 transition-all duration-300" />

            {/* Content */}
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
              <div>
                <h4 className="text-white font-semibold text-sm line-clamp-1 group-hover:underline">
                  {banner.title}
                </h4>
                <p className="text-gray-200 text-xs line-clamp-1">
                  {banner.subtitle}
                </p>
              </div>
              
              {/* Arrow Icon */}
              <div className="flex justify-end">
                <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TopStoriesBanners;
