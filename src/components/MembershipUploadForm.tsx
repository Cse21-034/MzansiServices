"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { MembershipStatus } from "@prisma/client";

interface MembershipUploadFormProps {
  businessId: string;
  currentMembership?: {
    membershipCardImage: string | null;
    membershipNumber: string | null;
    membershipStatus: MembershipStatus;
    membershipType: string | null;
    membershipExpiryDate: Date | null;
    membershipProvider: string | null;
    membershipUploadedAt: Date | null;
  };
  onSuccess?: () => void;
}

export const MembershipUploadForm: React.FC<MembershipUploadFormProps> = ({
  businessId,
  currentMembership,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    currentMembership?.membershipCardImage || null
  );

  const [formData, setFormData] = useState({
    membershipNumber: currentMembership?.membershipNumber || "",
    membershipType: currentMembership?.membershipType || "",
    membershipProvider: currentMembership?.membershipProvider || "",
    membershipExpiryDate: currentMembership?.membershipExpiryDate
      ? new Date(currentMembership.membershipExpiryDate)
          .toISOString()
          .split("T")[0]
      : "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("File must be an image");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!selectedFile && !currentMembership?.membershipCardImage) {
        setError("Please select a membership card image");
        setLoading(false);
        return;
      }

      const submitFormData = new FormData();
      submitFormData.append("businessId", businessId);
      submitFormData.append(
        "membershipNumber",
        formData.membershipNumber || ""
      );
      submitFormData.append("membershipType", formData.membershipType || "");
      submitFormData.append(
        "membershipProvider",
        formData.membershipProvider || ""
      );
      submitFormData.append(
        "membershipExpiryDate",
        formData.membershipExpiryDate || ""
      );

      if (selectedFile) {
        submitFormData.append("membershipCard", selectedFile);
      }

      const response = await fetch("/api/business/membership", {
        method: "POST",
        body: submitFormData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload membership");
      }

      setSuccess(true);
      setSelectedFile(null);
      setFormData({
        membershipNumber: "",
        membershipType: "",
        membershipProvider: "",
        membershipExpiryDate: "",
      });
      setPreviewImage(null);

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this membership?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/business/membership", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove membership");
      }

      setFormData({
        membershipNumber: "",
        membershipType: "",
        membershipProvider: "",
        membershipExpiryDate: "",
      });
      setPreviewImage(null);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">
        Membership Management
      </h2>
      <p className="text-gray-600 mb-6">
        Upload your membership card and details to verify your business.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ Membership updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Membership Card Image *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
              id="membershipCard"
            />
            <label htmlFor="membershipCard" className="cursor-pointer">
              {previewImage ? (
                <div className="space-y-2">
                  <div className="relative w-full h-48">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-blue-600">Change image</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl">📸</div>
                  <p className="text-gray-900 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG or JFIF up to 5MB
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Membership Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Membership Number
          </label>
          <input
            type="text"
            name="membershipNumber"
            value={formData.membershipNumber}
            onChange={handleInputChange}
            placeholder="e.g., MEM-2025-001234"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Membership Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Membership Type
          </label>
          <select
            name="membershipType"
            value={formData.membershipType}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select membership type</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Membership Provider */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Membership Provider/Organization
          </label>
          <input
            type="text"
            name="membershipProvider"
            value={formData.membershipProvider}
            onChange={handleInputChange}
            placeholder="e.g., Botswana Business Council"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Membership Expiry Date
          </label>
          <input
            type="date"
            name="membershipExpiryDate"
            value={formData.membershipExpiryDate}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Current Status */}
        {currentMembership && currentMembership.membershipStatus !== "NONE" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Current Status:</p>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-900">
                {currentMembership.membershipStatus}
              </p>
              {currentMembership.membershipUploadedAt && (
                <p className="text-xs text-gray-500">
                  Uploaded:{" "}
                  {new Date(
                    currentMembership.membershipUploadedAt
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? "Uploading..." : "Upload Membership"}
          </button>

          {currentMembership &&
            currentMembership.membershipStatus !== "NONE" && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? "Removing..." : "Remove"}
              </button>
            )}
        </div>
      </form>
    </div>
  );
};
