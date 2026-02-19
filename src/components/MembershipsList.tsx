"use client";

import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import MembershipForm from "./MembershipForm";

interface BusinessMembership {
  id: string;
  issuerName: string;
  membershipNumber: string;
  membershipType?: string;
  cardImage?: string;
  expiryDate?: Date;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "REJECTED";
  uploadedAt: Date;
}

interface MembershipsListProps {
  businessId: string;
  onRefresh?: () => void;
}

export default function MembershipsList({
  businessId,
  onRefresh,
}: MembershipsListProps) {
  const [memberships, setMemberships] = useState<BusinessMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] =
    useState<BusinessMembership | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/business/memberships?businessId=${businessId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMemberships(data);
      }
    } catch (error) {
      console.error("Error fetching memberships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [businessId]);

  const handleEdit = (membership: BusinessMembership) => {
    setSelectedMembership(membership);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedMembership(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this membership?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(
        `/api/business/memberships?membershipId=${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setMemberships((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Error deleting membership:", error);
      alert("Failed to delete membership");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMembership(null);
  };

  const handleFormSuccess = () => {
    fetchMemberships();
    onRefresh?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
      case "EXPIRED":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
      case "REJECTED":
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100";
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading memberships...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Memberships
        </h3>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + Add Membership
        </button>
      </div>

      {memberships.length === 0 ? (
        <div className="p-6 text-center bg-gray-50 dark:bg-neutral-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No memberships added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {memberships.map((membership) => (
            <div
              key={membership.id}
              className="p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {membership.issuerName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {membership.membershipNumber}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {membership.membershipType && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 px-2 py-1 rounded">
                        {membership.membershipType}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(membership.status)}`}>
                      {membership.status}
                    </span>
                    {membership.expiryDate && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Expires: {new Date(membership.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {membership.cardImage && (
                  <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={membership.cardImage}
                      alt={membership.issuerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(membership)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-neutral-800 rounded transition"
                    title="Edit membership"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(membership.id)}
                    disabled={deletingId === membership.id}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800 rounded transition disabled:opacity-50"
                    title="Delete membership"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MembershipForm
        businessId={businessId}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        membership={selectedMembership}
      />
    </div>
  );
}
