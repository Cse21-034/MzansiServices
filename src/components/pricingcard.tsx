"use client";

import React from "react";

export interface PackageType {
  id: string;
  name: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
  href: string;
  description: string;
}

interface PricingCardProps {
  pkg: PackageType;
}

const PricingCard: React.FC<PricingCardProps> = ({ pkg }) => {
  const handleClick = () => {
    window.location.href = pkg.href;
  };

  return (
    <div
      className={`relative bg-white dark:bg-neutral-900 rounded-3xl border-2 ${
        pkg.popular 
          ? 'border-burgundy-600 shadow-2xl scale-105' 
          : 'border-neutral-200 dark:border-neutral-700 shadow-lg'
      } transition-all duration-300 hover:shadow-xl p-8`}
    >
      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-burgundy-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      {/* Package Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
          {pkg.name}
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mt-3 text-sm leading-relaxed">
          {pkg.description}
        </p>
      </div>

      {/* Features List */}
      <div className="space-y-4 mb-8">
        {pkg.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${
              feature.startsWith('✓') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            } flex items-center justify-center text-xs`}>
              {feature.startsWith('✓') ? '✓' : '•'}
            </div>
            <span className={`text-sm ${
              feature.startsWith('✓') 
                ? 'text-neutral-700 dark:text-neutral-300' 
                : 'text-neutral-500 dark:text-neutral-400'
            }`}>
              {feature.replace('✓', '').trim()}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
          pkg.popular
            ? 'bg-burgundy-600 hover:bg-burgundy-800 text-white'
            : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white'
        }`}
        onClick={handleClick}
      >
        {pkg.ctaText}
      </button>
    </div>
  );
};

export default PricingCard;
