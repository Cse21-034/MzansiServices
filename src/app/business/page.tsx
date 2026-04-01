"use client";

import React, { FC, useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
import MembershipsList from "@/components/MembershipsList";
import FeaturedHeroSpaceTab from "@/components/FeaturedHeroSpaceTab";
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
  SparklesIcon,
  PencilIcon,
  HomeIcon
} from "@heroicons/react/24/outline";
import { categories } from "@/data/categories";
import CreatableSelect from "@/components/CreatableSelect";

// Dynamically import MapPicker with client-side rendering only (no SSR)
const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center animate-pulse">
      <p className="text-neutral-500 dark:text-neutral-400">Loading map...</p>
    </div>
  ),
});

// Type for CreatableSelect option
interface Option {
  value: string;
  label: string;
}

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
  slug?: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  phone: string;
  mobileNumber?: string;
  email: string;
  website: string;
  address: string;
  establishedYear: string;
  // Address fields - separate structure
  country?: string;
  city?: string;
  streetName?: string;
  plotNumber?: string;
  unitShopBuilding?: string;
  postalCode?: string;
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
  const [country, setCountry] = useState<string>("Namibia");
  const [city, setCity] = useState<Option | null>(null);
  const [streetName, setStreetName] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [unitShopBuilding, setUnitShopBuilding] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Listings state
  const [listings, setListings] = useState<any[]>([]);
  const [showAddListing, setShowAddListing] = useState(false);
  const [listingForm, setListingForm] = useState({ title: "", description: "", image: null as File | null });
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [listingPreview, setListingPreview] = useState<string | null>(null);

  // Property listings state
  type PropertyListing = {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    beds?: number;
    baths?: number;
    pricePerNight?: number;
    city?: string;
    image?: string;
  };
  const [propertyListings, setPropertyListings] = useState<PropertyListing[]>([]);
  const [loadingPropertyListings, setLoadingPropertyListings] = useState(false);

  const emptyBusiness: BusinessData = {
    name: "",
    category: "",
    subcategory: "",
    description: "",
    phone: "",
    mobileNumber: "",
    email: "",
    website: "",
    address: "",
    establishedYear: "",
    country: "Namibia",
    city: "",
    streetName: "",
    plotNumber: "",
    unitShopBuilding: "",
    postalCode: "",
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

        // Parse address and separate fields
        setCountry(data.country || "Namibia");
        setCity(data.city ? { value: data.city, label: data.city } : null);
        setStreetName(data.streetName || "");
        setPlotNumber(data.plotNumber || "");
        setUnitShopBuilding(data.unitShopBuilding || "");
        setPostalCode(data.postalCode || "");

        // Set latitude and longitude from fetched data
        setLatitude(data.latitude || null);
        setLongitude(data.longitude || null);

        setBusinessData({
          ...data,
          category: typeof data.category === 'object' ? data.category?.name || "" : data.category || "",
          subcategory: typeof data.subcategory === 'object' ? data.subcategory?.name || "" : data.subcategory || "",
          businessHours: fullBusinessHours,
          services: data.services || [],
          photos: (data.photos || []).map((photo: any) => ({
            id: photo.id,
            url: photo.url,
            businessId: photo.businessId,
            createdAt: new Date(photo.createdAt)
          })),
          establishedYear: data.establishedYear ? data.establishedYear.toString() : "",
          country: data.country || "Namibia",
          city: data.city || "",
          streetName: data.streetName || "",
          plotNumber: data.plotNumber || "",
          unitShopBuilding: data.unitShopBuilding || "",
          postalCode: data.postalCode || "",
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

  // Fetch listings when businessData.id changes
  useEffect(() => {
    if (businessData.id) {
      fetchListings();
      fetchPropertyListings();
    }
  }, [businessData.id]);

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

      // Construct the full address from separate fields
      const cityStr = city?.value || '';
      const countryStr = country || 'Namibia';
      
      // Build address: Unit/Shop, Plot Number, Street Name, City, Country
      const addressParts = [];
      if (unitShopBuilding?.trim()) addressParts.push(unitShopBuilding.trim());
      if (plotNumber?.trim()) addressParts.push(`Plot ${plotNumber.trim()}`);
      if (streetName?.trim()) addressParts.push(streetName.trim());
      if (cityStr?.trim()) addressParts.push(cityStr.trim());
      if (countryStr?.trim()) addressParts.push(countryStr.trim());
      
      const fullAddress = addressParts.join(", ");

      if (!fullAddress.trim()) {
        throw new Error("Please provide at least a street name and plot number");
      }

      // Prepare business data (without photos array for the main update)
      const { photos, ...businessDataWithoutPhotos } = businessData;

      // Log what we're sending
      const sendData = {
        ...businessDataWithoutPhotos,
        category: { name: businessData.category },
        subcategory: { name: businessData.subcategory },
        address: fullAddress,
        city: cityStr,
        country: countryStr,
        latitude: latitude,
        longitude: longitude,
        businessHours: businessData.businessHours,
        services: businessData.services,
        // Include separated address fields for storage
        streetName: streetName,
        plotNumber: plotNumber,
        unitShopBuilding: unitShopBuilding,
        postalCode: postalCode,
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

  // Fetch listings for the business
  const fetchListings = async () => {
    if (!businessData.id) return;
    try {
      const res = await fetch(`/api/business/listings?businessId=${businessData.id}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  // Fetch property listings for the business
  const fetchPropertyListings = async () => {
    if (!businessData.id) return;
    setLoadingPropertyListings(true);
    try {
      const res = await fetch(`/api/business/property-listings?businessId=${businessData.id}`);
      if (res.ok) {
        const data = await res.json();
        setPropertyListings(data.listings || []);
      }
    } catch (error) {
      console.error('Error fetching property listings:', error);
    } finally {
      setLoadingPropertyListings(false);
    }
  };

  // Handle listing image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, or GIF)');
      return;
    }

    setListingForm(prev => ({ ...prev, image: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setListingPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle listing form submission
  const handleAddListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!listingForm.title.trim()) {
      alert('Please enter a listing title');
      return;
    }

    if (!businessData.id) {
      alert('Business ID not found');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', listingForm.title);
      formData.append('description', listingForm.description);
      formData.append('businessId', businessData.id);
      
      if (listingForm.image) {
        formData.append('image', listingForm.image);
      }

      const res = await fetch('/api/business/listings', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create listing');
      }

      // Listing created successfully
      setModalTitle('Success');
      setModalMessage('Listing created successfully!');
      setModalOpen(true);

      // Reset form
      setListingForm({ title: '', description: '', image: null });
      setListingPreview(null);
      setShowAddListing(false);

      // Refresh listings
      await fetchListings();

    } catch (error) {
      console.error('Error creating listing:', error);
      setModalTitle('Error');
      setModalMessage(getErrorMessage(error));
      setModalOpen(true);
    } finally {
      setSaving(false);
    }
  };

  // Handle update listing status
  const handleUpdateListingStatus = async (listingId: string, newStatus: string) => {
    if (!businessData.id) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const res = await fetch(`/api/business/listings/${listingId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update listing');
      }

      setModalTitle('Success');
      setModalMessage('Listing status updated successfully!');
      setModalOpen(true);

      // Refresh listings
      await fetchListings();

    } catch (error) {
      console.error('Error updating listing:', error);
      setModalTitle('Error');
      setModalMessage(getErrorMessage(error));
      setModalOpen(true);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete listing
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/business/listings/${listingId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete listing');
      }

      setModalTitle('Success');
      setModalMessage('Listing deleted successfully!');
      setModalOpen(true);

      // Refresh listings
      await fetchListings();

    } catch (error) {
      console.error('Error deleting listing:', error);
      setModalTitle('Error');
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
                <p className="text-xs text-green-600 font-medium mt-1">{businessData.mobileNumber ? `${businessData.mobileNumber}` : 'No mobile provided'}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <PhoneIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
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
              <ButtonPrimary className="w-full justify-center" onClick={() => setActiveTab('products')}>
                <BuildingStorefrontIcon className="w-4 h-4 mr-2" />
                Add New Listing
              </ButtonPrimary>
              <ButtonSecondary className="w-full justify-center" onClick={() => {
                // Use slug if available, otherwise generate from name
                const slugToUse = businessData.slug || businessData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                router.push(`/listing-stay-detail/${slugToUse}`);
              }}>
                <EyeIcon className="w-4 h-4 mr-2" />
                View Public Profile
              </ButtonSecondary>
              <ButtonSecondary className="w-full justify-center" onClick={() => setActiveTab('analytics')}>
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
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Mobile Number *</label>
              <Input 
                name="mobileNumber" 
                value={businessData.mobileNumber || ""} 
                onChange={handleInputChange} 
                placeholder="+264..." 
                className="w-full" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email Address *</label>
              <Input name="email" type="email" value={businessData.email || ""} onChange={handleInputChange} placeholder="contact@yourbusiness.com.na" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Website</label>
              <Input name="website" value={businessData.website || ""} onChange={handleInputChange} placeholder="www.yourbusiness.com.na" className="w-full" />
            </div>
          </div>

          {/* Business Address Section */}
          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <MapPinIcon className="w-5 h-5 text-primary-600" />
              Business Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Country *</label>
                <Select
                  name="country"
                  value={country}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}
                  className="w-full"
                  disabled
                >
                  <option value="Namibia">Namibia</option>
                </Select>
              </div>

              <div className="md:col-span-2">
                <CreatableSelect
                  label="City / Town / Village *"
                  options={NAMIBIA_LOCATIONS}
                  value={city}
                  onChange={setCity}
                  placeholder="Select or type a city/town/village"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Street Name *</label>
                <Input
                  value={streetName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStreetName(e.target.value)}
                  placeholder="e.g., Main Street"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Plot Number *</label>
                <Input
                  value={plotNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlotNumber(e.target.value)}
                  placeholder="e.g., 123"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Unit / Shop / Building</label>
                <Input
                  value={unitShopBuilding}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnitShopBuilding(e.target.value)}
                  placeholder="e.g., Shop 5"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Postal Code</label>
                <Input
                  value={postalCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostalCode(e.target.value)}
                  placeholder="e.g., 10123"
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">📍 Your Complete Address:</p>
                <p className="text-base font-semibold text-primary-600 dark:text-primary-400">
                  {[unitShopBuilding, plotNumber, streetName, city?.value, country].filter(Boolean).join(", ")}
                </p>
              </div>

              {/* Map Picker for Location */}
              <div className="md:col-span-2">
                <MapPicker
                  latitude={latitude}
                  longitude={longitude}
                  address={[plotNumber, streetName].filter(Boolean).join(", ")}
                  city={city?.value || "Windhoek"}
                  onCoordinatesChange={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                />
              </div>
            </div>
          </div>
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

        {/* Business Hours */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <ClockIcon className="w-6 h-6 text-primary-600" />
            Business Hours
          </h2>
          <div className="space-y-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
              const hour = businessData.businessHours?.[index] || { dayOfWeek: index, isClosed: true };
              return (
                <div key={index} className="flex items-center gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                  <div className="w-24">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{day}</p>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hour.isClosed}
                      onChange={(e) => {
                        const updated = [...businessData.businessHours];
                        updated[index] = { ...updated[index], isClosed: e.target.checked };
                        setBusinessData(prev => ({ ...prev, businessHours: updated }));
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Closed</span>
                  </label>
                  {!hour.isClosed && (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="time"
                        value={hour.openTime || hour.open || "09:00"}
                        onChange={(e) => {
                          const updated = [...businessData.businessHours];
                          updated[index] = { ...updated[index], openTime: e.target.value };
                          setBusinessData(prev => ({ ...prev, businessHours: updated }));
                        }}
                        className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm"
                      />
                      <span className="text-neutral-500">to</span>
                      <input
                        type="time"
                        value={hour.closeTime || hour.close || "17:00"}
                        onChange={(e) => {
                          const updated = [...businessData.businessHours];
                          updated[index] = { ...updated[index], closeTime: e.target.value };
                          setBusinessData(prev => ({ ...prev, businessHours: updated }));
                        }}
                        className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Offered */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
            <SparklesIcon className="w-6 h-6 text-primary-600" />
            Services Offered
          </h2>
          <div className="space-y-3">
            {(businessData.services || []).map((service, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => {
                    const updated = [...(businessData.services || [])];
                    updated[index] = e.target.value;
                    setBusinessData(prev => ({ ...prev, services: updated }));
                  }}
                  placeholder="e.g., Consultation, Design, Implementation"
                  className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = (businessData.services || []).filter((_, i) => i !== index);
                    setBusinessData(prev => ({ ...prev, services: updated }));
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const updated = [...(businessData.services || []), ''];
                setBusinessData(prev => ({ ...prev, services: updated }));
              }}
              className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Service
            </button>
          </div>
        </div>

        {/* Save Button */}
        <ButtonPrimary className="mt-4" onClick={handleSave} disabled={saving}>
          {saving ? "Saving Profile..." : "Save Profile"}
        </ButtonPrimary>
      </div >
    );
  };

  const renderPropertyListingsTab = () => {
    if (loadingPropertyListings) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <HomeIcon className="w-6 h-6 text-primary-600" />
                Property Listings
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">Manage your rental properties and accommodations</p>
            </div>
            <a href="/add-listing/1">
              <ButtonPrimary className="flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Add Property
              </ButtonPrimary>
            </a>
          </div>

          {propertyListings.length === 0 ? (
            <div className="text-center py-12">
              <HomeIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                No Property Listings Yet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Create your first property listing to start accepting bookings
              </p>
              <a href="/add-listing/1">
                <ButtonPrimary>
                  <PlusIcon className="w-4 h-4 mr-2 inline" />
                  Create First Property
                </ButtonPrimary>
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {propertyListings.map((listing) => (
                <div
                  key={listing.id}
                  className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:shadow-lg transition-shadow hover:border-primary-300 dark:hover:border-primary-600"
                >
                  <div className="flex items-start gap-4">
                    {listing.image && (
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 break-words">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-neutral-500 mt-1">
                            Created {new Date(listing.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          name={listing.status.charAt(0).toUpperCase() + listing.status.slice(1).toLowerCase()}
                          color={
                            listing.status === 'APPROVED'
                              ? 'green'
                              : listing.status === 'PENDING'
                              ? 'yellow'
                              : listing.status === 'REJECTED'
                              ? 'red'
                              : listing.status === 'SUSPENDED'
                              ? 'purple'
                              : 'pink'
                          }
                        />
                      </div>

                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {listing.beds !== undefined && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{listing.beds}</span>
                            <span>bed{listing.beds !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                        {listing.baths !== undefined && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{listing.baths}</span>
                            <span>bath{listing.baths !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                        {listing.pricePerNight !== undefined && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">NAD {listing.pricePerNight}/night</span>
                          </div>
                        )}
                        {listing.city && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{listing.city}</span>
                          </div>
                        )}
                      </div>

                      {listing.status === 'REJECTED' && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700 mb-3">
                          <p className="text-sm text-red-800 dark:text-red-300">
                            <strong>Rejection Reason:</strong> {(listing as any).rejectionReason || 'Not specified'}
                          </p>
                        </div>
                      )}

                      {listing.status === 'PENDING' && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                          <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            ⏳ Your property is under review by our admin team. You'll be notified once it's approved.
                          </p>
                        </div>
                      )}

                      {listing.status === 'APPROVED' && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                          <p className="text-sm text-green-800 dark:text-green-300">
                            ✓ Your property is live and visible to all users!
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() => window.open(`/property-listings/${listing.id}`, '_blank')}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View listing"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => router.push(`/add-listing/1?edit=${listing.id}`)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Edit property"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
            Property Listing Status
          </h3>
          <div className="space-y-2 text-sm text-primary-800 dark:text-primary-300">
            <p>
              <strong>Pending:</strong> Your property is waiting for admin approval. Make sure all details are accurate.
            </p>
            <p>
              <strong>Approved:</strong> Your property is now visible to all users and accepting bookings.
            </p>
            <p>
              <strong>Rejected:</strong> Review the rejection reason and update your property details to resubmit.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderListingsTab = () => {
    return (
      <div className="space-y-8">
        {/* Add Listing Form */}
        {showAddListing && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <PlusIcon className="w-6 h-6 text-primary-600" />
              Add New Listing
            </h2>
            <form onSubmit={handleAddListing} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={listingForm.title}
                  onChange={(e) => setListingForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Summer Collection 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description
                </label>
                <textarea
                  value={listingForm.description}
                  onChange={(e) => setListingForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your listing in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Listing Image
                </label>
                {listingPreview && (
                  <div className="mb-4 relative w-40 h-40">
                    <img
                      src={listingPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setListingPreview(null);
                        setListingForm(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50"
                />
                <p className="text-xs text-neutral-500 mt-2">JPG, PNG or GIF (max 5MB)</p>
              </div>

              <div className="flex gap-4">
                <ButtonPrimary type="submit" disabled={saving || !listingForm.title}>
                  {saving ? "Saving..." : "Add Listing"}
                </ButtonPrimary>
                <ButtonSecondary onClick={() => {
                  setShowAddListing(false);
                  setListingForm({ title: "", description: "", image: null });
                  setListingPreview(null);
                }}>
                  Cancel
                </ButtonSecondary>
              </div>
            </form>
          </div>
        )}

        {/* Listings List */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <DocumentTextIcon className="w-6 h-6 text-primary-600" />
              Your Listings ({listings.length})
            </h2>
            {!showAddListing && (
              <ButtonPrimary onClick={() => setShowAddListing(true)} className="flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Add Listing
              </ButtonPrimary>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                No listings yet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Create your first listing to showcase your products and services
              </p>
              <ButtonPrimary onClick={() => setShowAddListing(true)}>
                <PlusIcon className="w-5 h-5 inline mr-2" />
                Add Your First Listing
              </ButtonPrimary>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing: any) => (
                <div key={listing.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    {listing.image && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover rounded-lg" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 break-words">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            Created {new Date(listing.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge color={listing.status === 'ACTIVE' ? 'green' : 'yellow'} name={listing.status} />
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 mb-4">
                        {listing.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleUpdateListingStatus(listing.id, listing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Toggle status">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => router.push(`/business/listings/${listing.id}/edit`)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteListing(listing.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
                { id: 'property-listings', name: 'Property Listings', icon: HomeIcon },
                { id: 'featured-ads', name: 'Featured Ads', icon: StarIcon },
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
          {activeTab === 'property-listings' && renderPropertyListingsTab()}
          {activeTab === 'featured-ads' && businessData?.id && (
            <FeaturedHeroSpaceTab businessId={businessData.id} />
          )}
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
            <div>
              <MembershipsList
                businessId={businessData.id || ''}
                onRefresh={fetchBusinessData}
              />
            </div>
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