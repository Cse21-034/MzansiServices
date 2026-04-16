import React from "react";
import SectionHero from "@/app/(server-components)/SectionHero";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import { TaxonomyType } from "@/data/types";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import BackgroundSection from "@/components/BackgroundSection";
import SectionGridFeaturePlaces from "@/components/SectionGridFeaturePlaces";
import SectionHowItWork from "@/components/SectionHowItWork";
import SectionSubscriptionPackages from "@/components/SectionSubscriptionPackages";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import SectionBecomeAnAuthor from "@/components/SectionBecomeAnAuthor";
import AdRotation from "@/components/ads/addemobanner";
import RotatingBannerAd from "@/components/ads/RotatingBannerAd";
import InlineAd from "@/components/ads/InlineAd";
import StickyAd from "@/components/ads/StickyAd";
import FAQSection from "@/components/FAQSection";
import { prisma } from "@/lib/prisma";
import { categories } from "@/data/categories";

// Map the categories from categories.ts to the format needed by the page
const BASE_BUSINESS_CATEGORIES: Omit<TaxonomyType, 'count'>[] = categories.map((category) => ({
  id: category.name,
  href: `/listing-stay-map?category=${encodeURIComponent(category.name)}`,
  name: category.name,
  taxonomy: "category",
  thumbnail: category.image,
}));

async function PageHome() {
  // Initialize with base categories and 0 count
  let businessCategories: TaxonomyType[] = BASE_BUSINESS_CATEGORIES.map(category => ({
    ...category,
    count: 0
  }));

  // Fetch category counts directly from database (server-side)
  try {
    const categoryCounts = await prisma.business.groupBy({
      by: ['categoryId'],
      where: {
        status: "PUBLISHED",
        verified: true,
      },
      _count: {
        id: true,
      },
    });

    const dbCategories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryCounts.map(item => item.categoryId)
        }
      },
      select: {
        id: true,
        name: true,
      }
    });

    const countsMap: { [key: string]: number } = {};
    categoryCounts.forEach(item => {
      const category = dbCategories.find(cat => cat.id === item.categoryId);
      if (category) {
        countsMap[category.name] = item._count.id;
      }
    });

    console.log('✅ Category counts loaded:', countsMap);

    businessCategories = businessCategories.map(category => ({
      ...category,
      count: countsMap[category.name] || 0
    }));
  } catch (error) {
    console.error('Error fetching category counts:', error);
  }

  return (
    <main className="nc-PageHome relative overflow-hidden">
      <BgGlassmorphism />
      <StickyAd position="bottom-right" />

      <div className="container relative space-y-24 mb-24 lg:space-y-28 lg:mb-28">
        <SectionHero className="pt-10 lg:pt-16 lg:pb-16" />

        {/* Premium Rotating Banner Ad */}
        <div className="relative py-8">
          <RotatingBannerAd />
        </div>

        <SectionSliderNewCategories
          categories={businessCategories}
          heading="Explore Business Categories"
          subHeading="Find local businesses across South Africa"
          categoryCardType="card4"
        />

        {/* Inline Ad - Highlight Style */}
        <div className="relative py-6">
          <InlineAd style="highlight" />
        </div>

        <SectionGridFeaturePlaces
          cardType="card2"
          heading="Featured Businesses"
          subHeading="Popular businesses in your area"
        />

        <SectionHowItWork />

        {/* Subscription Packages Section */}
        <SectionSubscriptionPackages />

        {/* Original Rotating Ad */}
        <div className="relative py-16">
          <AdRotation />
        </div>

        {/* Inline Ad - Minimal Style */}
        <div className="relative py-6">
          <InlineAd style="minimal" />
        </div>

        <div className="relative py-16">
          <SectionBecomeAnAuthor />
        </div>

        {/* Inline Ad - Default Style */}
        <div className="relative py-6">
          <InlineAd style="default" />
        </div>

        <SectionSubscribe2 />

        <FAQSection />
      </div>
    </main>
  );
}

export default PageHome;
