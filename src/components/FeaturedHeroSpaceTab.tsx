"use client";

import React, { FC, useState, useEffect } from "react";
import { SparklesIcon, PhotoIcon, CalendarIcon, CurrencyDollarIcon, CheckCircleIcon, ClockIcon, CheckIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import Modal from "@/shared/Modal";
import { AdUploadForm } from "@/components/AdUploadForm";

interface FeaturedSpace {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  linkUrl?: string;
  billingCycle: "MONTHLY" | "YEARLY";
  monthlyPrice: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

interface FeaturedHeroSpaceTabProps {
  businessId: string;
}

const FeaturedHeroSpaceTab: FC<FeaturedHeroSpaceTabProps> = ({ businessId }) => {
  const [featuredSpace, setFeaturedSpace] = useState<FeaturedSpace | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    linkUrl: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  
  // New state for advertising package subscription
  const [selectedAdPackage, setSelectedAdPackage] = useState<any>(null);
  const [adBillingCycle, setAdBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [showAdPackageModal, setShowAdPackageModal] = useState(false);

  const PRICING = {
    MONTHLY: { price: 100, duration: "1 month" },
    YEARLY: { price: 1008, duration: "12 months", savings: 192 },
  };

  const ADVERTISING_PACKAGES = [
    {
      id: 'advert1',
      packageId: 'advert1',
      name: "Advert 1",
      description: "Small landscape ads with static placement",
      monthlyPrice: 250,
      yearlyPrice: 2400,
      yearlyDiscount: "20% DISCOUNT",
      features: [
        "Placement: Home page, Under advertisements",
        "Small landscape ads",
        "Static placement",
        "Perfect for service-based businesses",
        "Affordable entry point for advertising"
      ],
      popular: false,
    },
    {
      id: 'advert2',
      packageId: 'advert2',
      name: "Advert 2",
      description: "Portrait ads with 4-second slideshow",
      monthlyPrice: 550,
      yearlyPrice: 5280,
      yearlyDiscount: "20% DISCOUNT",
      features: [
        "Placement: Home page",
        "Portrait format ads",
        "4 seconds slideshow rotation",
        "Higher visibility on home page",
        "Ideal for retail and eCommerce"
      ],
      popular: false,
    },
    {
      id: 'advert3',
      packageId: 'advert3',
      name: "Advert 3",
      description: "Landscape ads with 7-second rotation",
      monthlyPrice: 1000,
      yearlyPrice: 9600,
      yearlyDiscount: "20% DISCOUNT",
      features: [
        "Placement: Below category page, above & below 'Claim your listing'",
        "Landscape format ads",
        "7 seconds slideshow rotation",
        "High engagement placement",
        "Great for property and seasonal businesses"
      ],
      popular: false,
    },
    {
      id: 'advert4',
      packageId: 'advert4',
      name: "Advert 4",
      description: "Premium top category placement",
      monthlyPrice: 1500,
      yearlyPrice: 14400,
      yearlyDiscount: "20% DISCOUNT",
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
      id: 'advert5',
      packageId: 'advert5',
      name: "Advert 5",
      description: "Big landscape ads with extended rotation",
      monthlyPrice: 2000,
      yearlyPrice: 19200,
      yearlyDiscount: "20% DISCOUNT",
      features: [
        "Placement: Below packages section",
        "Big landscape ads",
        "15 seconds slideshow rotation",
        "Extended visibility window",
        "Ideal for major announcements and promotions"
      ],
      popular: false,
    },
    {
      id: 'promotions',
      packageId: 'promotions',
      name: "Promotions",
      description: "Premium promotional campaigns with big landscape ads",
      monthlyPrice: 2500,
      yearlyPrice: 24000,
      yearlyDiscount: "20% DISCOUNT",
      features: [
        "Placement: Promotions section",
        "Big landscape ads",
        "15 seconds slideshow rotation",
        "Featured promotional placement",
        "Best for special offers and limited-time campaigns"
      ],
      popular: false,
    }
  ];

  // Fetch existing featured space
  useEffect(() => {
    fetchFeaturedSpace();
  }, [businessId]);

  const fetchFeaturedSpace = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/featured-hero-space?businessId=${businessId}&userSpaces=true`);
      const result = await res.json();

      if (result.success && result.data && result.data.length > 0) {
        setFeaturedSpace(result.data[0]);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error fetching featured space:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert image file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!imageFile || !formData.title) {
      setModalTitle("Validation Error");
      setModalMessage("Please upload an image and enter a title");
      setModalOpen(true);
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await fileToBase64(imageFile);

      const res = await fetch("/api/featured-hero-space", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          imageUrl,
          title: formData.title,
          description: formData.description,
          linkUrl: formData.linkUrl,
          billingCycle,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create featured space");
      }

      // Step 2 & 3: Submit combined form directly to initiate.trans
      // PayGate will handle the internal redirect to process.trans
      // Using traditional form submission avoids CORS issues with fetch
      if (result.checkout?.params && result.checkout?.initiateUrl) {
        console.log("[Featured Space] Submitting to PayGate initiate.trans...");

        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.checkout.initiateUrl; // First submit to initiate.trans

        // Add all PayGate params to form
        Object.entries(result.checkout.params).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        console.log("[Featured Space] Redirecting to PayGate...");
        form.submit(); // Browser navigates directly to PayGate initiate.trans
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage(error instanceof Error ? error.message : "Failed to process payment");
      setModalOpen(true);
    } finally {
      setUploading(false);
    }
  };

  // Calculate days remaining
  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Active featured space
  if (featuredSpace && featuredSpace.isActive) {
    const daysRemaining = getDaysRemaining(featuredSpace.expiryDate);
    return (
      <div className="space-y-6">
        {/* Active Status Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100">Featured Space Active</h3>
                <p className="text-green-700 dark:text-green-300 mt-1">Your business is featured in the homepage carousel</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-green-200 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full font-medium text-sm">
              Active
            </span>
          </div>
        </div>

        {/* Featured Space Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image */}
          <div className="lg:col-span-1">
            <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700">
              <img
                src={featuredSpace.imageUrl}
                alt={featuredSpace.title}
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Title</label>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{featuredSpace.title}</p>
            </div>

            {/* Description */}
            {featuredSpace.description && (
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Description</label>
                <p className="text-neutral-700 dark:text-neutral-300">{featuredSpace.description}</p>
              </div>
            )}

            {/* Link */}
            {featuredSpace.linkUrl && (
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Link URL</label>
                <a href={featuredSpace.linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                  {featuredSpace.linkUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Billing & Expiry Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Billing Cycle */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CurrencyDollarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Billing Cycle</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {featuredSpace.billingCycle === "MONTHLY" ? "Monthly (N$100)" : "Yearly (N$1,008)"}
                </p>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Started</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{formatDate(featuredSpace.startDate)}</p>
              </div>
            </div>
          </div>

          {/* Expiry */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${daysRemaining <= 7 ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                <ClockIcon className={`w-5 h-5 ${daysRemaining <= 7 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Expires in</p>
                <p className={`text-sm font-bold ${daysRemaining <= 7 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                  {daysRemaining} days
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(featuredSpace.expiryDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Renewal Section */}
        {daysRemaining <= 7 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Your featured space expires soon! Renew now to maintain continuous visibility.
            </p>
            <ButtonPrimary className="mt-4 w-full justify-center" onClick={() => setShowForm(true)}>
              Renew Featured Space
            </ButtonPrimary>
          </div>
        )}
      </div>
    );
  }

  // No featured space or form
  if (!showForm) {
    return (
      <div className="space-y-12">
        {/* Advertising Rate Cards Section */}
        <div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Advertising Rate Cards</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Choose the right advertising package for your business to reach customers on our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADVERTISING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg border cursor-pointer transform hover:scale-105 ${
                  pkg.popular
                    ? "bg-gradient-to-br from-orange-500 to-red-600 text-white md:scale-105 md:-mt-2 border-orange-400"
                    : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                }`}
                onClick={() => {
                  setSelectedAdPackage(pkg);
                  setShowAdPackageModal(true);
                }}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-amber-400 text-neutral-900 px-2 py-0.5 text-xs font-semibold rounded-bl z-10">
                    Popular
                  </div>
                )}

                <div className="p-4 flex flex-col h-full">
                  <h4 className="text-sm font-bold mb-1">{pkg.name}</h4>
                  <p 
                    className="text-xs mb-2 line-clamp-2"
                    style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.9)' } : { color: '#6b7280' }}
                  >
                    {pkg.description}
                  </p>

                  <div className="mb-3">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-lg font-bold">N${pkg.monthlyPrice}</span>
                      <span 
                        className="text-xs"
                        style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.8)' } : { color: '#6b7280' }}
                      >
                        p/m
                      </span>
                    </div>
                    <div className="text-xs font-semibold mb-1">
                      <span>N${pkg.yearlyPrice}</span>
                      <span 
                        style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.8)' } : { color: '#6b7280' }}
                      >
                        /yr
                      </span>
                    </div>
                    {pkg.yearlyDiscount && (
                      <div 
                        className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                        style={pkg.popular ? { 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'rgba(255, 255, 255, 1)'
                        } : { 
                          backgroundColor: '#fed7aa',
                          color: '#92400e'
                        }}
                      >
                        {pkg.yearlyDiscount}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    {pkg.popular ? (
                      <ButtonPrimary className="w-full bg-white text-neutral-900 hover:bg-neutral-100 py-1.5 text-xs">
                        Subscribe
                      </ButtonPrimary>
                    ) : (
                      <ButtonSecondary 
                        className={`w-full py-1.5 text-xs ${pkg.popular ? 'border-white text-white' : 'border-neutral-300 dark:border-neutral-600'}`}
                      >
                        Subscribe
                      </ButtonSecondary>
                    )}
                  </div>

                  <div className="space-y-1 flex-grow">
                    <p 
                      className="text-xs font-semibold"
                      style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.9)' } : { color: '#6b7280' }}
                    >
                      Includes:
                    </p>
                    <ul className="space-y-1">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckIcon 
                            className="w-3 h-3 flex-shrink-0 mt-0.5"
                            style={pkg.popular ? { color: 'rgba(255, 255, 255, 0.8)' } : { color: '#16a34a' }}
                          />
                          <span className="text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for advertising package subscription */}
        {showAdPackageModal && selectedAdPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-neutral-200 dark:border-neutral-700">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Subscribe to {selectedAdPackage.name}
                </h3>
                <button
                  onClick={() => setShowAdPackageModal(false)}
                  className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  ✕
                </button>
              </div>

              {/* Ad Upload Form */}
              <AdUploadForm
                businessId={businessId}
                packageId={selectedAdPackage.packageId}
                packageName={selectedAdPackage.name}
                packagePrice={adBillingCycle === 'MONTHLY' ? selectedAdPackage.monthlyPrice : selectedAdPackage.yearlyPrice}
                billingCycle={adBillingCycle}
                onSuccess={() => {
                  // Optionally close modal and show success message
                  setShowAdPackageModal(false);
                }}
                onError={(error) => {
                  console.error('Ad creation error:', error);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Upload Form
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Feature Your Business</h3>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Featured Image</label>
          <div className="relative">
            {imagePreview ? (
              <div className="relative w-full overflow-hidden rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  onClick={() => {
                    setImagePreview("");
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="w-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors">
                <PhotoIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Click to upload or drag and drop</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">PNG, JPG, GIF up to 5MB</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Business Title *</label>
          <Input
            type="text"
            placeholder="e.g., Amazing Restaurant"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Description</label>
          <Textarea
            placeholder="Tell customers about your business..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full h-24"
          />
        </div>

        {/* Link URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Website/Link URL</label>
          <Input
            type="url"
            placeholder="https://yourbusiness.com"
            value={formData.linkUrl}
            onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Billing Cycle Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Select Billing Cycle</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["MONTHLY", "YEARLY"].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle as "MONTHLY" | "YEARLY")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  billingCycle === cycle
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-neutral-200 dark:border-neutral-600 hover:border-primary-300"
                }`}
              >
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {cycle === "MONTHLY" ? "Monthly" : "Yearly"}
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  N${PRICING[cycle as "MONTHLY" | "YEARLY"].price}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  {PRICING[cycle as "MONTHLY" | "YEARLY"].duration}
                  {cycle === "YEARLY" && ` • Save N$${PRICING.YEARLY.savings}`}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-600 dark:text-neutral-400">Featured Space Duration:</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{PRICING[billingCycle].duration}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-600">
            <span className="text-neutral-600 dark:text-neutral-400">Total Price:</span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">N${PRICING[billingCycle].price}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <ButtonPrimary onClick={handlePurchase} loading={uploading} className="flex-1 justify-center">
            {uploading ? "Processing..." : `Proceed to Payment (N$${PRICING[billingCycle].price})`}
          </ButtonPrimary>
          <ButtonSecondary onClick={() => setShowForm(false)} className="flex-1 justify-center">
            Cancel
          </ButtonSecondary>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        buttonText="Close"
        onButtonClick={() => setModalOpen(false)}
        showCloseButton={false}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default FeaturedHeroSpaceTab;
