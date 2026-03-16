"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import Label from "@/components/Label";
import Modal from "@/shared/Modal";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface EditListingPageProps {}

const EditListingPage: React.FC<EditListingPageProps> = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const listingId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Fetch listing details
  useEffect(() => {
    if (!session?.user?.email) {
      router.push("/login");
      return;
    }

    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/business/listings/${listingId}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Listing not found");
          }
          throw new Error("Failed to load listing");
        }

        const data = await res.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCurrentImageUrl(data.image || null);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setModalTitle("Error");
        setModalMessage(error instanceof Error ? error.message : "Failed to load listing");
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, session, router]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      alert("Please upload a valid image (JPG, PNG, or GIF)");
      return;
    }

    setImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a listing title");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`/api/business/listings/${listingId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update listing");
      }

      setModalTitle("Success");
      setModalMessage("Listing updated successfully!");
      setModalOpen(true);

      // Redirect back to dashboard after short delay
      setTimeout(() => {
        router.push("/business?tab=products");
      }, 1500);
    } catch (error) {
      console.error("Error updating listing:", error);
      setModalTitle("Error");
      setModalMessage(error instanceof Error ? error.message : "Failed to update listing");
      setModalOpen(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Edit Listing</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">Update your listing details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700">
          {/* Title Field */}
          <div className="mb-6">
            <Label>Listing Title *</Label>
            <Input
              type="text"
              placeholder="Enter listing title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
              disabled={saving}
            />
          </div>

          {/* Description Field */}
          <div className="mb-6">
            <Label>Description</Label>
            <Textarea
              placeholder="Enter listing description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2"
              disabled={saving}
              rows={6}
            />
          </div>

          {/* Image Field */}
          <div className="mb-6">
            <Label>Image</Label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
              JPG, PNG or GIF (max 5MB)
            </p>

            {/* Current Image Preview */}
            {/* Show logo as placeholder if no image */}
            {(!currentImageUrl && !imagePreview) && (
              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  No image uploaded. Using default logo:
                </p>
                <img
                  src="/images/namibia-logo/squarelogo.PNG"
                  alt="Default logo"
                  className="w-32 h-32 object-cover rounded-lg border border-neutral-300 dark:border-neutral-600"
                />
              </div>
            )}
            {currentImageUrl && !imagePreview && (
              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Current Image:
                </p>
                <img
                  src={currentImageUrl}
                  alt="Current listing"
                  className="w-32 h-32 object-cover rounded-lg border border-neutral-300 dark:border-neutral-600"
                />
              </div>
            )}

            {/* New Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  New Image Preview:
                </p>
                <img
                  src={imagePreview}
                  alt="New listing"
                  className="w-32 h-32 object-cover rounded-lg border border-neutral-300 dark:border-neutral-600"
                />
              </div>
            )}

            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-input"
                disabled={saving}
              />
              <label
                htmlFor="image-input"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:border-primary-600 dark:hover:border-primary-400 transition-colors bg-neutral-50 dark:bg-neutral-900/50"
              >
                <div className="text-center">
                  <PhotoIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Click to upload a new image
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <ButtonSecondary
              onClick={() => router.back()}
              disabled={saving}
              className="flex-1"
            >
              Cancel
            </ButtonSecondary>
            <ButtonPrimary
              type="submit"
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Saving..." : "Save Changes"}
            </ButtonPrimary>
          </div>
        </form>
      </div>

      {/* Status Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (modalTitle === "Success") {
            router.push("/business?tab=products");
          }
        }}
        title={modalTitle}
        buttonText="Close"
        onButtonClick={() => {
          setModalOpen(false);
          if (modalTitle === "Success") {
            router.push("/business?tab=products");
          }
        }}
        showCloseButton={false}
      >
        <p className="text-neutral-700 dark:text-neutral-300">{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default EditListingPage;
