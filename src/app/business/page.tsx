"use client";

import React, { FC, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import Select from "@/shared/Select";
import Label from "@/components/Label";
import Badge from "@/shared/Badge";
import Modal from "@/shared/Modal";
import BusinessNav from "@/components/BusinessNav";
import { MembershipUploadForm } from "@/components/MembershipUploadForm";
const defaultBusinessImage = "/images/namibia-logo/squarelogo.PNG";
import {
  BuildingStorefrontIcon,
  PhotoIcon,
  DocumentTextIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  UsersIcon,
  StarIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { categories } from "@/data/categories";
import CreatableSelect from "@/components/CreatableSelect";

const NAMIBIA_LOCATIONS = [
  { value: "Windhoek", label: "Windhoek" },
  { value: "Walvis Bay", label: "Walvis Bay" },
  { value: "Swakopmund", label: "Swakopmund" },
  { value: "Oshakati", label: "Oshakati" },
  { value: "Rundu", label: "Rundu" },
  { value: "Katima Mulilo", label: "Katima Mulilo" },
  { value: "Otjiwarongo", label: "Otjiwarongo" },
  { value: "Keetmanshoop", label: "Keetmanshoop" },
  { value: "Rehoboth", label: "Rehoboth" },
  { value: "Gobabis", label: "Gobabis" },
  { value: "Mariental", label: "Mariental" },
  { value: "Tsumeb", label: "Tsumeb" },
  { value: "Ondangwa", label: "Ondangwa" },
  { value: "Ongwediva", label: "Ongwediva" },
  { value: "Eenhana", label: "Eenhana" },
  { value: "Okahandja", label: "Okahandja" },
  { value: "Omaruru", label: "Omaruru" },
  { value: "Usakos", label: "Usakos" },
  { value: "Karibib", label: "Karibib" },
  { value: "Outjo", label: "Outjo" },
  { value: "Otavi", label: "Otavi" },
  { value: "Okakarara", label: "Okakarara" },
  { value: "Lüderitz", label: "Lüderitz" },
  { value: "Bethanie", label: "Bethanie" },
  { value: "Aus", label: "Aus" },
  { value: "Oranjemund", label: "Oranjemund" },
  { value: "Aranos", label: "Aranos" },
  { value: "Gibeon", label: "Gibeon" },
  { value: "Kalkrand", label: "Kalkrand" },
  { value: "Stampriet", label: "Stampriet" },
  { value: "Aroab", label: "Aroab" },
  { value: "Koës", label: "Koës" },
  { value: "Khorixas", label: "Khorixas" },
  { value: "Opuwo", label: "Opuwo" },
  { value: "Ruacana", label: "Ruacana" },
  { value: "Erongo", label: "Erongo" },
  { value: "Hardap", label: "Hardap" },
  { value: "Karas", label: "Karas" },
  { value: "Kavango East", label: "Kavango East" },
  { value: "Kavango West", label: "Kavango West" },
  { value: "Khomas", label: "Khomas" },
  { value: "Kunene", label: "Kunene" },
  { value: "Ohangwena", label: "Ohangwena" },
  { value: "Omaheke", label: "Omaheke" },
  { value: "Omusati", label: "Omusati" },
  { value: "Oshana", label: "Oshana" },
  { value: "Oshikoto", label: "Oshikoto" },
  { value: "Otjozondjupa", label: "Otjozondjupa" },
  { value: "Zambezi", label: "Zambezi" },
];

interface BusinessData {
  id?: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  establishedYear: string;
  employees: string;
  photos: { id: string; url: string; businessId: string; createdAt: Date; }[];
  ownerId?: string;
  status?: "DRAFT" | "PENDING" | "PUBLISHED" | "SUSPENDED";
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  businessHours: {
    id?: string;
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed: boolean;
    // Add these optional properties to match what might be coming from the API
    open?: string;
    close?: string;
  }[];
  services: string[];
  // Membership fields
  membershipCardImage?: string | null;
  membershipNumber?: string | null;
  membershipStatus?: "NONE" | "ACTIVE" | "EXPIRED" | "PENDING" | "REJECTED";
  membershipType?: string | null;
  membershipExpiryDate?: string | null;
  membershipProvider?: string | null;
  membershipUploadedAt?: string | null;
}

export interface BusinessDashboardPageProps { }

const BusinessDashboardPage: FC<BusinessDashboardPageProps> = ({ }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [country, setCountry] = useState("Namibia");
  const [city, setCity] = useState<any>(null); // Use any or proper type for CreatableSelect value
  const [streetAddress, setStreetAddress] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emptyBusiness: BusinessData = {
    name: "",
    category: "",
    subcategory: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    establishedYear: "",
    employees: "",
    photos: [],
    businessHours: Array.from({ length: 7 }, (_, i) => ({ dayOfWeek: i, isClosed: true })), // Default to closed
    services: [],
  };
  const [businessData, setBusinessData] = useState<BusinessData>(emptyBusiness);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // categories are imported from data/categories, no need for state if it's static
  // const [categories, setCategories] = useState... REMOVED

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Helper function to handle errors properly
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return 'An unexpected error occurred';
    }
  };

  // Fetch business data
  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/business/profile");
      if (!res.ok) throw new Error('Failed to fetch business data');
      const data = await res.json();

      if (data && !data.error) {
        // Ensure businessHours has all 7 days, even if empty from DB
        const fullBusinessHours = Array.from({ length: 7 }, (_, i) => {
          const existing = data.businessHours?.find((h: any) => h.dayOfWeek === i);
          return existing || { dayOfWeek: i, isClosed: true };
        });

        // Parse address string into new state variables
        let parsedStreetAddress = "";
        let parsedCity = "";
        let parsedCountry = "Namibia";

        if (data.address) {
          const addressParts = data.address.split(',').map((part: string) => part.trim());
          if (addressParts.length >= 3) {
            parsedStreetAddress = addressParts[0];
            parsedCity = addressParts[1];
            parsedCountry = addressParts[2];
          } else if (addressParts.length === 2) {
            parsedStreetAddress = addressParts[0];
            parsedCity = addressParts[1];
          } else {
            parsedStreetAddress = addressParts[0];
          }
        }

        setCountry(parsedCountry);
        setCity({ value: parsedCity, label: parsedCity });
        setStreetAddress(parsedStreetAddress);

        setBusinessData({
          ...data,
          category: typeof data.category === 'object' ? data.category?.name || "" : data.category || "",
          subcategory: typeof data.subcategory === 'object' ? data.subcategory?.name || "" : data.subcategory || "",
          businessHours: fullBusinessHours,
          photos: (data.photos || []).map((photo: any) => ({
            id: photo.id,
            url: photo.url,
            businessId: photo.businessId,
            createdAt: new Date(photo.createdAt)
          })),
          establishedYear: data.establishedYear ? data.establishedYear.toString() : "",
        });
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      setModalTitle("Error");
      setModalMessage(getErrorMessage(error));
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchBusinessData();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImageCount = businessData.photos?.length || 0;

    if (files.length + currentImageCount > 5) {
      alert(`Maximum 5 images allowed. You already have ${currentImageCount} images.`);
      return;
    }

    setImages(files);

    // Create previews with proper cleanup
    const newPreviews = files.map(file => URL.createObjectURL(file));

    // Cleanup old previews
    imagePreviews.forEach(url => URL.revokeObjectURL(url));

    setImagePreviews(newPreviews);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/business/images?id=${imageId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        // Update business data with new photos list
        setBusinessData(prev => ({
          ...prev,
          photos: data.photos || []
        }));
        setModalTitle("Success");
        setModalMessage("Image deleted successfully");
        setModalOpen(true);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete image");
      }
    } catch (error) {
      console.error('Delete error:', error);
      setModalTitle("Error");
      setModalMessage(getErrorMessage(error));
      setModalOpen(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Upload images first if any
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(img => formData.append("images", img));

        const imgRes = await fetch("/api/business/images", {
          method: "POST",
          body: formData,
        });

        if (!imgRes.ok) {
          const errorData = await imgRes.json();
          throw new Error(errorData.error || "Image upload failed");
        }

        const imgData = await imgRes.json();
        // Update photos with newly uploaded ones
        setBusinessData(prev => ({
          ...prev,
          photos: imgData.photos || []
        }));
      }

      // Construct the address string from the new state variables
      let fullAddress = streetAddress;
      if (city) {
        fullAddress += (fullAddress ? ", " : "") + city;
      }
      if (country) {
        fullAddress += (fullAddress ? ", " : "") + country;
      }

      // Prepare business data (without photos array for the main update)
      const { photos, ...businessDataWithoutPhotos } = businessData;

      // Log what we're sending
      const sendData = {
        ...businessDataWithoutPhotos,
        category: { name: businessData.category },
        subcategory: { name: businessData.subcategory },
        address: fullAddress, // Use the newly constructed address
        businessHours: businessData.businessHours,
        services: businessData.services,
      };
      console.log('Sending data to API:', JSON.stringify(sendData, null, 2));

      // Update business profile
      const res = await fetch("/api/business/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Refresh data to ensure consistency
      await fetchBusinessData();

      // Reset image state
      setImages([]);
      setImagePreviews([]);

      setModalTitle("Success");
      setModalMessage("Business profile updated successfully!");
      setModalOpen(true);

    } catch (error) {
      console.error('Save error:', error);
      setModalTitle("Error");
      setModalMessage(getErrorMessage(error));
      setModalOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const renderOverviewTab = () => {
    return (
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Business Name</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{businessData.name || '-'}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{businessData.category || '-'}</p>
              </div>
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <BuildingStorefrontIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Year Established</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{businessData.establishedYear || '-'}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{businessData.employees ? `${businessData.employees} employees` : '-'}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <UsersIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Images Uploaded</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{businessData.photos?.length || 0}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">{businessData.photos?.length ? 'Images available' : 'No images yet'}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <PhotoIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Profile Status</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {businessData.status === 'PUBLISHED' ? 'Published' :
                    businessData.status === 'PENDING' ? 'Pending' :
                      businessData.status === 'DRAFT' ? 'Draft' : 'Incomplete'}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                  {businessData.verified ? 'Verified' : 'Not verified'}
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <ChartBarIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <ButtonPrimary className="w-full justify-center">
                <BuildingStorefrontIcon className="w-4 h-4 mr-2" />
                Add New Listing
              </ButtonPrimary>
              <ButtonSecondary className="w-full justify-center">
                <EyeIcon className="w-4 h-4 mr-2" />
                View Public Profile
              </ButtonSecondary>
              <ButtonSecondary className="w-full justify-center">
                <ChartBarIcon className="w-4 h-4 mr-2" />
                View Analytics
              </ButtonSecondary>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { action: "Profile updated", time: "2 hours ago", type: "success" },
                { action: "New review received", time: "1 day ago", type: "info" },
                { action: "Listing published", time: "2 days ago", type: "success" },
                { action: "Business hours updated", time: "3 days ago", type: "info" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      {activity.action}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfileTab = () => {
    if (loading) return <div className="text-center py-8">Loading profile details...</div>;

    return (
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <BuildingStorefrontIcon className="w-6 h-6 text-primary-600" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Business Name *</label>
              <Input name="name" value={businessData.name || ""} onChange={handleInputChange} className="w-full" />
            </div>
            {/* --- CATEGORY AND SUBCATEGORY --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CreatableSelect
                label="Category"
                placeholder="Select or add a category"
                options={categories.map(c => ({ value: c.name, label: c.name }))}
                value={businessData.category ? { value: businessData.category, label: businessData.category } : null}
                onChange={(option) => {
                  setBusinessData(prev => ({
                    ...prev,
                    category: option?.value || "",
                    subcategory: "" // Reset subcategory when category changes
                  }));
                }}
              />

              <CreatableSelect
                label="Subcategory"
                placeholder={businessData.category ? "Select or add a subcategory" : "Select a category first"}
                isDisabled={!businessData.category}
                options={
                  businessData.category
                    ? (categories.find(c => c.name === businessData.category)?.subcategories || []).map(s => ({ value: s, label: s }))
                    : []
                }
                value={businessData.subcategory ? { value: businessData.subcategory, label: businessData.subcategory } : null}
                onChange={(option) => {
                  setBusinessData(prev => ({
                    ...prev,
                    subcategory: option?.value || ""
                  }));
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Year Established</label>
              <Input name="establishedYear" type="number" value={businessData.establishedYear || ""} onChange={handleInputChange} placeholder="e.g., 2008" className="w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Business Description *</label>
              <Textarea name="description" value={businessData.description || ""} onChange={handleInputChange} placeholder="Describe your business, services, and what makes you unique..." rows={4} className="w-full" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <PhoneIcon className="w-6 h-6 text-primary-600" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Phone Number *</label>
              <Input name="phone" value={businessData.phone || ""} disabled className="w-full bg-neutral-100 dark:bg-neutral-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email Address *</label>
              <Input name="email" type="email" value={businessData.email || ""} onChange={handleInputChange} placeholder="contact@yourbusiness.co.bw" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Website</label>
              <Input name="website" value={businessData.website || ""} onChange={handleInputChange} placeholder="www.yourbusiness.co.bw" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Number of Employees</label>
              <Input name="employees" value={businessData.employees || ""} onChange={handleInputChange} placeholder="e.g., 50-100" className="w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Country *</label>
              <Select
                name="country"
                value={country}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}
                className="w-full"
                disabled // Disable the select as it's always Namibia
              >
                <option value="Namibia">Namibia</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <CreatableSelect
                label="City/Town/Village *"
                options={NAMIBIA_LOCATIONS}
                value={city}
                onChange={setCity}
                placeholder="Select or type a city/town/village"
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Plot Number / Street Address *</label>
              <Input
                name="streetAddress"
                value={streetAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStreetAddress(e.target.value)}
                placeholder="e.g., Plot 123, Main Street"
                className="w-full"
              />                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                Make it easy for customers to find you by entering your location clearly (e.g., Plot 123, Main Street, Gaborone)
              </p>
            </div>          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <PhotoIcon className="w-6 h-6 text-primary-600" />
            Business Images (max 5)
          </h2>

          {/* Existing Photos */}
          {businessData.photos && businessData.photos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Uploaded Images</h3>
              <div className="flex gap-4 flex-wrap">
                {businessData.photos.map((photo) => (
                  <div key={photo.id} className="relative w-24 h-24">
                    <img src={photo.url} alt="Business" className="object-cover w-full h-full rounded-lg border border-neutral-200 dark:border-neutral-700" />
                    <button
                      onClick={() => handleDeleteImage(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">New Images to Upload</h3>
              <div className="flex gap-4 flex-wrap">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-24 h-24">
                    <img src={src} alt="Preview" className="object-cover w-full h-full rounded-lg border border-primary-200 dark:border-primary-700" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mb-4"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            {businessData.photos?.length || 0} of 5 images uploaded. You can add {5 - (businessData.photos?.length || 0)} more.
          </p>
        </div>

        {/* Save Button */}
        <ButtonPrimary className="mt-4" onClick={handleSave} disabled={saving}>
          {saving ? "Saving Profile..." : "Save Profile"}
        </ButtonPrimary>
      </div >
    );
  };

  const renderListingsTab = () => {
    if (loading) return <div className="text-center py-8">Loading listing details...</div>;

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleBusinessHoursChange = (dayIndex: number, field: "openTime" | "closeTime" | "isClosed", value: string | boolean) => {
      setBusinessData(prev => ({
        ...prev,
        businessHours: prev.businessHours.map((day, index) =>
          index === dayIndex ? { ...day, [field]: value } : day
        )
      }));
    };

    const handleAddService = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const newService = e.currentTarget.value.trim();
        if (newService && !businessData.services.includes(newService)) {
          setBusinessData(prev => ({
            ...prev,
            services: [...prev.services, newService]
          }));
          e.currentTarget.value = "";
        }
      }
    };

    const handleRemoveService = (serviceToRemove: string) => {
      setBusinessData(prev => ({
        ...prev,
        services: prev.services.filter(service => service !== serviceToRemove)
      }));
    };

    return (
      <div className="space-y-8">
        {/* Operation Hours */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <ClockIcon className="w-6 h-6 text-primary-600" />
            Operation Hours
          </h2>
          <div className="space-y-4">
            {daysOfWeek.map((dayName, index) => {
              const day = businessData.businessHours.find(d => d.dayOfWeek === index) || { dayOfWeek: index, isClosed: true, openTime: "", closeTime: "" };
              return (
                <div key={index} className="flex items-center space-x-4">
                  <span className="w-24 font-medium text-neutral-700 dark:text-neutral-300">{dayName}</span>
                  <input
                    type="time"
                    value={day.openTime || ""}
                    onChange={(e) => handleBusinessHoursChange(index, "openTime", e.target.value)}
                    className="w-32 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-primary-500 focus:border-primary-500"
                    disabled={day.isClosed}
                  />
                  <span className="text-neutral-500">-</span>
                  <input
                    type="time"
                    value={day.closeTime || ""}
                    onChange={(e) => handleBusinessHoursChange(index, "closeTime", e.target.value)}
                    className="w-32 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-primary-500 focus:border-primary-500"
                    disabled={day.isClosed}
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={day.isClosed}
                      onChange={(e) => handleBusinessHoursChange(index, "isClosed", e.target.checked)}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Closed</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Offered */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <CheckCircleIcon className="w-6 h-6 text-primary-600" />
            Services Offered
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Add a new service (Press Enter to add)
            </label>
            <Input
              type="text"
              placeholder="e.g., Web Design, Catering, Plumbing"
              onKeyPress={handleAddService}
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {businessData.services.map((service, index) => (
              <Badge
                key={index}
                className="flex items-center space-x-1"
                name={
                  <div className="flex items-center space-x-1">
                    <span>{service}</span>
                    <button
                      onClick={() => handleRemoveService(service)}
                      className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </div>

        {/* Product Listings */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <DocumentTextIcon className="w-6 h-6 text-primary-600" />
            Product Listings
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Create and manage product listings to showcase your offerings to customers.
          </p>
          <div className="flex gap-4">
            <ButtonPrimary onClick={() => router.push('/business/add-listing')}>
              <PlusIcon className="w-5 h-5 inline mr-2" />
              Add New Listing
            </ButtonPrimary>
            <ButtonSecondary onClick={() => router.push('/listings')}>
              View All Listings
            </ButtonSecondary>
          </div>
        </div>

        {/* Save Listing Details Button */}
        <ButtonPrimary
          className="mt-4"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving Listing Details..." : "Save Listing Details"}
        </ButtonPrimary>
      </div>
    );
  };

  return (
    <div className="nc-BusinessDashboardPage bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      {/* Business Navigation Header */}
      <BusinessNav business={{
        name: businessData.name,
        category: { name: businessData.category },
        email: session?.user?.email || businessData.email,
        photos: businessData.photos && businessData.photos.length > 0 
          ? businessData.photos 
          : [{ id: 'default', url: defaultBusinessImage, businessId: '', createdAt: new Date() }],
      }} />

      {/* Main Content */}
      <main className="lg:container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            Business Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
            Manage your business listings and track performance
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'profile', name: 'Profile', icon: BuildingStorefrontIcon },
                { id: 'products', name: 'Products & Listings', icon: DocumentTextIcon },
                { id: 'promotions', name: 'Promotions', icon: SparklesIcon },                { id: 'membership', name: 'Membership', icon: CheckCircleIcon },                { id: 'analytics', name: 'Analytics', icon: EyeIcon },
                { id: 'branches', name: 'Branches', icon: BuildingOfficeIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300'
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'products' && renderListingsTab()} {/* Render the products & listings tab */}
          {activeTab === 'promotions' && (
            <div className="text-center py-12">
              <SparklesIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Manage Promotions
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Create and manage special offers and promotions for your products
              </p>
              <div className="flex justify-center gap-4">
                <ButtonPrimary onClick={() => router.push('/business/promotions')}>
                  View All Promotions
                </ButtonPrimary>
                <ButtonSecondary onClick={() => router.push('/business/promotions/add')}>
                  <PlusIcon className="w-5 h-5 inline mr-2" />
                  Add Promotion
                </ButtonSecondary>
              </div>
            </div>
          )}
          {activeTab === 'membership' && businessData && (
            <MembershipUploadForm
              businessId={businessData.id || ''}
              currentMembership={{
                membershipCardImage: businessData.membershipCardImage || null,
                membershipNumber: businessData.membershipNumber || null,
                membershipStatus: businessData.membershipStatus || 'NONE',
                membershipType: businessData.membershipType || null,
                membershipExpiryDate: businessData.membershipExpiryDate ? new Date(businessData.membershipExpiryDate) : null,
                membershipProvider: businessData.membershipProvider || null,
                membershipUploadedAt: businessData.membershipUploadedAt ? new Date(businessData.membershipUploadedAt) : null,
              }}
              onSuccess={() => {
                // Refresh business data after successful upload
                fetchBusinessData();
              }}
            />
          )}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <ChartBarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                View Analytics
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Track your business performance and customer engagement
              </p>
            </div>
          )}
          {activeTab === 'branches' && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Branch Management
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Manage your business locations and branches
              </p>
              <ButtonPrimary onClick={() => router.push('/business/branches')}>
                Go to Branches
              </ButtonPrimary>
            </div>
          )}
        </div>

        {/* Quick Help Section */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100">
                Need help with your business profile?
              </h3>
              <p className="text-primary-700 dark:text-primary-300 mt-1">
                Our support team is here to help you optimize your listing.
              </p>
            </div>
            <ButtonSecondary className="border-primary-300 text-primary-700 dark:border-primary-600 dark:text-primary-300">
              Contact Support
            </ButtonSecondary>
          </div>
        </div>
      </main>

      {/* Status Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        buttonText="Close"
        onButtonClick={() => setModalOpen(false)}
        showCloseButton={false}
      >
        <p className="text-neutral-700 dark:text-neutral-300">{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default BusinessDashboardPage;