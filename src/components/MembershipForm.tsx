"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface MembershipFormProps {
  businessId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  membership?: {
    id: string;
    issuerName: string;
    membershipNumber: string;
    membershipType?: string;
    cardImage?: string;
    expiryDate?: Date;
  } | null;
}

export default function MembershipForm({
  businessId,
  isOpen,
  onClose,
  onSuccess,
  membership,
}: MembershipFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    issuerName: membership?.issuerName || "",
    membershipNumber: membership?.membershipNumber || "",
    membershipType: membership?.membershipType || "",
    expiryDate: membership?.expiryDate
      ? new Date(membership.expiryDate).toISOString().split("T")[0]
      : "",
  });
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [cardImagePreview, setCardImagePreview] = useState(
    membership?.cardImage || ""
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCardImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCardImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("businessId", businessId);
      form.append("issuerName", formData.issuerName);
      form.append("membershipNumber", formData.membershipNumber);
      form.append("membershipType", formData.membershipType);
      form.append("expiryDate", formData.expiryDate);

      if (cardImage) {
        form.append("cardImage", cardImage);
      }

      if (membership?.id) {
        form.append("membershipId", membership.id);
       const response = await fetch("/api/business/memberships", {
          method: "PUT",
          body: form,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to update membership");
        }
      } else {
        const response = await fetch("/api/business/memberships", {
          method: "POST",
          body: form,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to add membership");
        }
      }

      onSuccess();
      onClose();
      setFormData({
        issuerName: "",
        membershipNumber: "",
        membershipType: "",
        expiryDate: "",
      });
      setCardImage(null);
      setCardImagePreview("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                {membership ? "Edit Membership" : "Add New Membership"}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-100 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Issuer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Membership Issuer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuerName}
                  onChange={(e) =>
                    setFormData({ ...formData, issuerName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Chamber of Commerce"
                />
              </div>

              {/* Membership Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Membership Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.membershipNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      membershipNumber: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MEM12345"
                />
              </div>

              {/* Membership Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Membership Type
                </label>
                <input
                  type="text"
                  value={formData.membershipType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      membershipType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Gold, Silver, Bronze"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiryDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Card Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Membership Card Image
                </label>
                <div className="space-y-2">
                  {cardImagePreview && (
                    <div className="relative w-full h-40 bg-gray-100 dark:bg-neutral-700 rounded-lg overflow-hidden">
                      <img
                        src={cardImagePreview}
                        alt="Membership card preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-100 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : membership ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
