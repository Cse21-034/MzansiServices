"use client";

import React, { FC } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { CheckIcon, ArrowRightIcon, ComputerDesktopIcon, PaintBrushIcon, MegaphoneIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const AdvertiseWithUsPage: FC = () => {
  // Define your brand colors
  const brandColors = {
    primary: "#27bcc0", // Teal
    emerald: "#84aa32", // Green
    amber: "#612C30",   // Burgundy
    rose: "#017082",    // Dark Teal/Blue
  };

  // Data from the PDF organized by categories
  const valueAddedPackages = [
    {
      name: "Advert 1",
      price: "N$250",
      yearPrice: "N$2400",
      period: "p/m",
      yearPeriod: "/year",
      discount: "20% DISCOUNT",
      description: "Small landscape ads with static placement",
      features: [
        "Placement: Home page, Under advertisements",
        "Small landscape ads",
        "Static placement",
        "Perfect for service-based businesses",
        "Affordable entry point for advertising"
      ],
    },
    {
      name: "Advert 2",
      price: "N$550",
      yearPrice: "N$5280",
      period: "p/m",
      yearPeriod: "/year",
      discount: "20% DISCOUNT",
      description: "Portrait ads with 4-second slideshow",
      features: [
        "Placement: Home page",
        "Portrait format ads",
        "4 seconds slideshow rotation",
        "Higher visibility on home page",
        "Ideal for retail and eCommerce"
      ],
    },
    {
      name: "Advert 3",
      price: "N$1000",
      yearPrice: "N$9600",
      period: "p/m",
      yearPeriod: "/year",
      discount: "20% DISCOUNT",
      description: "Landscape ads with 7-second rotation",
      features: [
        "Placement: Below category page, above & below 'Claim your listing'",
        "Landscape format ads",
        "7 seconds slideshow rotation",
        "High engagement placement",
        "Great for property and seasonal businesses"
      ],
    },
    {
      name: "Advert 4",
      price: "N$1500",
      yearPrice: "N$14400",
      period: "p/m",
      yearPeriod: "/year",
      discount: "20% DISCOUNT",
      description: "Premium top category placement",
      features: [
        "Placement: Top category page",
        "Landscape format ads",
        "10 seconds slideshow rotation",
        "Prime real estate placement",
        "Maximum visibility for premium brands"
      ],
      popular: true,
    },
    {
      name: "Advert 5",
      price: "N$2000",
      yearPrice: "N$19200",
      period: "p/m",
      yearPeriod: "/year",
      discount: "20% DISCOUNT",
      description: "Big landscape ads with extended rotation",
      features: [
        "Placement: Below packages section",
        "Big landscape ads",
        "15 seconds slideshow rotation",
        "Extended visibility window",
        "Ideal for major announcements and promotions"
      ],
    },
    {
      name: "Promotions",
      price: "N$2500",
      yearPrice: "N$24000",
      period: "p/m",
      yearPeriod: "/year",
      discount: "20% DISCOUNT",
      description: "Premium promotional campaigns with big landscape ads",
      features: [
        "Placement: Promotions section",
        "Big landscape ads",
        "15 seconds slideshow rotation",
        "Featured promotional placement",
        "Best for special offers and limited-time campaigns"
      ],
    }
  ];

  // Namibia Services Packages - Subscription Tiers
  const namibiaServicesPackages = [
    {
      name: "WILD HORSES",
      price: "Free",
      period: "",
      description: "Establish your business presence quickly.",
      features: [
        "Free business listing",
        "Business profile",
        "Appears in searches",
        "1 photo upload",
        "Reviews display",
        "No promotions",
      ],
      popular: false,
    },
    {
      name: "DESERT ELEPHANTS",
      price: "N$100",
      yearPrice: "N$1020",
      period: "p/m",
      yearPeriod: "/year",
      discount: "16% DISCOUNT",
      description: "Boost visibility and build customer trust.",
      features: [
        "Enhanced business profile",
        "Photo uploads (up to 10)",
        "Higher search ranking",
        "Customer reviews display",
        "Promotions and updates board",
        "Social media links",
        "Priority support",
      ],
      popular: false,
    },
    {
      name: "DESERT LIONS",
      price: "N$200",
      yearPrice: "N$1920",
      period: "p/m",
      yearPeriod: "/year",
      discount: "20% DISCOUNT",
      description: "Unlock powerful tools for rapid growth.",
      features: [
        "Top search placement",
        "Featured business badge",
        "Video introduction",
        "Expanded photo gallery (up to 50 photos)",
        "Multiple branch listings (up to 5)",
        "WhatsApp chatbot integration",
        "Dedicated support",
      ],
      popular: true,
    }
  ];

  const webDevelopmentPackages = [
    {
      name: "Informational Website",
      price: "P3500",
      period: "one-time",
      description: "Basic business information website",
      paymentPlan: {
        deposit: "BWP1500",
        monthly: "BWP550",
        duration: "6 months"
      },
      features: [
        "General information about your business",
        "Contact details",
        "Business services",
        "Contact form for clients",
        "Google map embedded",
        "Social media links",
        "Web hosting",
        "SEO/SEM"
      ],
    },
    {
      name: "CRM Website",
      price: "P4500",
      period: "one-time",
      description: "Customer Relationship Management website",
      paymentPlan: {
        deposit: "BWP1500",
        monthly: "BWP600",
        duration: "6 months"
      },
      features: [
        "Lead management",
        "Contact management",
        "Email system",
        "Reporting and analytics",
        "Database management",
        "Document management"
      ],
    },
    {
      name: "E-commerce Website",
      price: "P???", // Price missing in PDF, using placeholder
      period: "one-time",
      description: "Complete online store solution",
      paymentPlan: {
        deposit: "BWP2500",
        monthly: "BWP1600",
        duration: "6 months"
      },
      features: [
        "Fully functional ecommerce website",
        "Multiple payment options",
        "Email marketing features",
        "Promotion and discount tools",
        "SEO Capabilities",
        "Reporting tools"
      ],
      popular: true,
    }
  ];

  const brandingPackages = [
    {
      name: "Package 1",
      price: "P9500",
      period: "one-time",
      description: "Basic branding essentials",
      features: [
        "Logo design",
        "Business card",
        "Business profile",
        "Flyers and Letterhead"
      ],
    },
    {
      name: "Package 2",
      price: "P1,900",
      period: "one-time",
      description: "Enhanced branding package",
      features: [
        "Banner design",
        "Logo design",
        "Business card",
        "Business profile",
        "Flyers and Letterhead",
        "Brochure",
        "Invoice"
      ],
    },
    {
      name: "Package 3",
      price: "P2,400",
      period: "one-time",
      description: "Comprehensive branding suite",
      features: [
        "Banner design",
        "Logo design",
        "Business card",
        "Business profile",
        "Flyers and Letterhead",
        "Posters",
        "Brochure",
        "Invoice",
        "Quotation book",
        "Social media cover"
      ],
    },
    {
      name: "Package 4",
      price: "P5,000",
      period: "one-time",
      description: "Complete branding with printing",
      features: [
        "Banner design",
        "Logo design",
        "Business card",
        "Business profile",
        "Flyers and Letterhead",
        "Posters",
        "Brochure",
        "Invoice",
        "Quotation book",
        "Social media cover",
        "With printing and free delivery"
      ],
      popular: true,
    }
  ];

  const socialMediaPackages = [
    {
      name: "Package 1",
      price: "P650",
      period: "one-time",
      description: "Basic Facebook setup",
      features: ["Create Facebook page"],
      platform: "Facebook"
    },
    {
      name: "Package 2",
      price: "P1,200",
      period: "p/m",
      description: "Facebook management",
      features: [
        "Business Page Setup",
        "1 designed weekly post",
        "One sponsored post per month",
        "Maximum reach 7000 users",
        "Monthly reporting on social media traffic analysis",
        "Standard feedback template highlighting key indicators"
      ],
      platform: "Facebook"
    },
    {
      name: "Package 3",
      price: "P2,300",
      period: "p/m",
      description: "Facebook & Instagram management",
      features: [
        "Business Page Setup",
        "1 designed weekly post",
        "2 sponsored posts per month",
        "Maximum reach (14000+) users",
        "Monthly reporting on social media traffic analysis",
        "24/7 management of social media pages",
        "1 x 30 seconds animated OR product introduction video per month"
      ],
      platform: "Facebook & Instagram",
      popular: true,
    },
    {
      name: "Package 4",
      price: "P3,500",
      period: "p/m",
      description: "Multi-platform management",
      features: [
        "Business Page Setup (Facebook, Instagram & Twitter)",
        "2 designed weekly posts",
        "2 sponsored posts per month",
        "Maximum reach (14000+) users",
        "Monthly reporting on social media traffic analysis"
      ],
      platform: "Facebook, Instagram & Twitter"
    }
  ];

  const ServiceSection = ({ title, description, packages, icon: Icon, colorType = "primary" }: any) => {
    // Get color based on type
    const getColor = (type: string) => {
      switch(type) {
        case "primary": return brandColors.primary;
        case "emerald": return brandColors.emerald;
        case "amber": return brandColors.amber;
        case "rose": return brandColors.rose;
        default: return brandColors.primary;
      }
    };

    const color = getColor(colorType);
    
    return (
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${color}20` }} // 20% opacity
          >
            <Icon style={{ color }} className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">{description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.map((pkg: any, index: number) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl border ${
                pkg.popular
                  ? "scale-105 md:scale-100 md:z-10"
                  : "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700"
              }`}
              style={pkg.popular ? { 
                backgroundColor: color,
                color: 'white',
                borderColor: color
              } : {}}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-amber-400 text-neutral-900 px-4 py-1 text-sm font-semibold rounded-bl-lg z-10">
                  Most Popular
                </div>
              )}

              <div className="p-6 relative">
                {/* Plan Name */}
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                {pkg.platform && (
                  <div className="mb-2">
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={pkg.popular ? { 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)' 
                      } : { 
                        backgroundColor: `${color}20` 
                      }}
                    >
                      {pkg.platform}
                    </span>
                  </div>
                )}
                <p 
                  className="text-sm mb-4"
                  style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.9)' } : { color: '#6b7280' }}
                >
                  {pkg.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    <span 
                      className="text-sm"
                      style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.8)' } : { color: '#6b7280' }}
                    >
                      {pkg.period}
                    </span>
                  </div>
                  {pkg.yearPrice && (
                    <div className="text-sm font-semibold mb-2">
                      <span>{pkg.yearPrice}</span>
                      <span 
                        style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.8)' } : { color: '#6b7280' }}
                      >
                        {pkg.yearPeriod}
                      </span>
                    </div>
                  )}
                  {pkg.discount && (
                    <div 
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                      style={pkg.popular ? { 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 1)'
                      } : { 
                        backgroundColor: `${color}20`,
                        color: color
                      }}
                    >
                      {pkg.discount}
                    </div>
                  )}
                </div>

                {/* Payment Plan (if exists) */}
                {pkg.paymentPlan && (
                  <div 
                    className="mb-4 p-3 rounded-lg"
                    style={pkg.popular ? { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    } : { 
                      backgroundColor: '#f9fafb' 
                    }}
                  >
                    <p className="text-sm font-semibold mb-1">Payment Plan:</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Deposit:</span>
                        <span className="font-semibold">{pkg.paymentPlan.deposit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly ({pkg.paymentPlan.duration}):</span>
                        <span className="font-semibold">{pkg.paymentPlan.monthly}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <div className="mb-6">
                  {pkg.popular ? (
                    <ButtonPrimary 
                      className="w-full bg-white text-neutral-900 hover:bg-neutral-100"
                    >
                      Get Started Now
                    </ButtonPrimary>
                  ) : (
                    <ButtonSecondary 
                      className="w-full border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100"
                    >
                      Choose Plan
                    </ButtonSecondary>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <p 
                    className="text-sm font-semibold"
                    style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.9)' } : { color: '#6b7280' }}
                  >
                    What's included:
                  </p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckIcon 
                          className="w-4 h-4 flex-shrink-0 mt-1"
                          style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.8)' } : { color: '#16a34a' }}
                        />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="nc-AdvertiseWithUs bg-neutral-50 dark:bg-neutral-900 min-h-screen py-16 lg:py-28">
      {/* Header */}
      <div className="container text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Namibia Services
        </h1>
        <h2 className="text-2xl lg:text-3xl font-semibold mb-2" style={{ color: brandColors.primary }}>
          Beyond Excellence
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Choose from our comprehensive range of services to grow your business.
          All prices may vary based on client requirements.
        </p>
      </div>

      <div className="container">
        {/* Advertising Rate Cards */}
        <ServiceSection
          title="Advertising Rate Cards"
          description="Choose the right advertising package for your business to reach customers on our platform"
          packages={valueAddedPackages}
          icon={BuildingStorefrontIcon}
          colorType="primary"
        />

        {/* Namibia Services Packages */}
        <ServiceSection
          title="Namibia Services Packages"
          description="Choose the perfect plan for your business and unlock powerful features"
          packages={namibiaServicesPackages}
          icon={BuildingStorefrontIcon}
          colorType="emerald"
        />

        {/* Web Development - COMMENTED OUT */}
        {/* 
        <ServiceSection
          title="Web Development"
          description="Professional websites tailored to your business needs"
          packages={webDevelopmentPackages}
          icon={ComputerDesktopIcon}
          colorType="emerald"
        />
        */}

        {/* Branding Suite/Graphic Design - COMMENTED OUT */}
        {/* 
        <ServiceSection
          title="Branding Suite / Graphic Design"
          description="Complete branding solutions to establish your business identity"
          packages={brandingPackages}
          icon={PaintBrushIcon}
          colorType="amber"
        />
        */}

        {/* Social Media Marketing - COMMENTED OUT */}
        {/* 
        <ServiceSection
          title="Social Media Marketing"
          description="Boost your social media presence with our expert management"
          packages={socialMediaPackages}
          icon={MegaphoneIcon}
          colorType="rose"
        />
        */}
      </div>

      {/* Note about pricing */}
      <div className="container mt-20">
        <div 
          className="rounded-2xl p-8 text-center text-white"
          style={{ 
            background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.rose})`
          }}
        >

        </div>
      </div>
      

      {/* FAQ Section */}
      <div className="container mt-20">
        <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-12">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              q: "How long does it take to set up my service?",
              a: "Setup time varies by service. Value added services are typically activated within 24 hours, while web development and branding projects may take 1-4 weeks depending on complexity.",
            },
            {
              q: "Can I customize my package?",
              a: "Yes! We offer custom quotes for added features. Contact our team to discuss your specific requirements.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept bank transfers, mobile money (Orange Money, Vodafone), and credit cards for your convenience.",
            },
            {
              q: "Is there a contract for monthly services?",
              a: "Our monthly services are flexible with no long-term contracts. You can cancel or modify your plan as needed.",
            },
            {
              q: "Do you provide support after setup?",
              a: "Yes! All our packages include support. Higher-tier packages include more comprehensive support options.",
            },
            {
              q: "Can I upgrade my package later?",
              a: "Absolutely! You can upgrade or downgrade your package at any time. Changes will be reflected in your next billing cycle.",
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {faq.q}
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="container mt-20">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 lg:p-12 border border-neutral-200 dark:border-neutral-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Our team can create a tailored package specifically for your business needs. Get in touch with us to discuss your requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonPrimary 
                href="/contact" 
                className="flex items-center justify-center gap-2"
              >
                Contact Our Sales Team
                <ArrowRightIcon className="w-5 h-5" />
              </ButtonPrimary>
              <ButtonSecondary href="/" className="flex items-center justify-center gap-2">
                Back to Home
                <ArrowRightIcon className="w-5 h-5" />
              </ButtonSecondary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertiseWithUsPage;