"use client";

import Heading from "@/shared/Heading";
import React from "react";
import PricingCard, { PackageType } from "./pricingcard";
import { useSession } from "next-auth/react";

export interface PricingPackageProps {
  packages?: PackageType[];
  headingCenter?: boolean;
  className?: string;
  gridClassName?: string;
}
const DEMO_PACKAGES: PackageType[] = [
  {
    id: "1",
    name: "Wild horses",
    description: "Perfect for getting started with essential business tools",
    features: [
      "✓ Free listing (name, contacts, category, location)",
      "✓ Up to 3 photos and short description", 
      "✓ Business SIM card with data",
      "✓ WhatsApp click-to-call button",
      "✓ Basic business profile management",
      "✓ Mobile-responsive design",
      "✓ Appears in search results",
      "✓ Essential customer support"
    ],
    ctaText: "Get Started",
    href: "/signup"
  },
  {
    id: "2",
    name: "Desert elephants",
    popular: true,
    description: "Enhanced digital presence with social media integration",
    features: [
      "✓ Everything in MORETLWA, plus:",
      "✓ WhatsApp click-to-call button",
      "✓ Business SIM card included",
      "✓ Social media handles (Facebook, TikTok)",
      "✓ Email setup & SMS notifications",
      "✓ Up to 5 photos and short description",
      "✓ Portable router/Wi-Fi",
      "✓ Enhanced business profile",
      "✓ Priority customer support",
      "✓ Social media integration",
      "✓ Basic digital marketing tools"
    ],
    ctaText: "Get Package",
    href: "/signup?plan=moretologa"
  },
  {
    id: "3", 
    name: "Desert lions",
    description: "Complete enterprise solution with advanced features",
    features: [
      "✓ Everything in MORETOLOGA, plus:",
      "✓ Up to 10 photos + video introduction",
      "✓ Business SIM cards for team",
      "✓ Social media handles (Facebook, X, Instagram, LinkedIn, TikTok)",
      "✓ Website (hosting & management)",
      "✓ Speed point (QR code payment)",
      "✓ Custom landing page/mini site",
      "✓ API integration with ERM/CRM systems",
      "✓ Unlimited listings for branches/outlets",
      "✓ Dedicated account manager + SLA support",
      "✓ Enterprise-grade Wi-Fi router/fiber",
      "✓ Co-branded marketing",
      "✓ Corporate email suite",
      "✓ Custom web solutions",
      "✓ Ongoing IT/development retainer",
      "✓ WhatsApp Chatbot (optional)",
      "✓ Bulk SMS/USSD campaigns (optional)"
    ],
    ctaText: "Contact Sales",
    href: "/contact"
  }
];
const SectionGridCategoryBox: React.FC<PricingPackageProps> = ({
  packages = DEMO_PACKAGES,
  headingCenter = true,
  className = "",
  gridClassName = "grid-cols-1 lg:grid-cols-3 gap-8",
}) => {
  const { data: session } = useSession();

  // Hide this section if user is logged in
  if (session?.user) {
    return null;
  }

  return (
    <div className={`nc-SectionGridCategoryBox relative ${className}`}>
      <Heading
        isCenter={headingCenter}
        desc="Choose the perfect plan to grow your business in Namibia"
      >
        Business Listing Packages
      </Heading>
      
      <div className={`grid ${gridClassName} mt-16`}>
        {packages.map((pkg) => (
          <PricingCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
      {/* Additional Info */}
      <div className="text-center mt-12 max-w-2xl mx-auto">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          All packages include free setup assistance. Contact us for custom pricing tailored to your business needs.
        </p>
      </div>
    </div>
  );
};
export default SectionGridCategoryBox;