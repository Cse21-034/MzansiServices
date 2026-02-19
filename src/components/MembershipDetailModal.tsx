"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface BusinessMembership {
  id: string;
  issuerName: string;
  membershipNumber: string;
  membershipType?: string;
  cardImage?: string;
  expiryDate?: Date | string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "REJECTED" | "NONE";
  uploadedAt: Date | string;
}

interface MembershipDetailModalProps {
  membership: BusinessMembership;
  isOpen: boolean;
  onClose: () => void;
}

export default function MembershipDetailModal({
  membership,
  isOpen,
  onClose,
}: MembershipDetailModalProps) {
  const isExpired =
    membership.expiryDate &&
    new Date(membership.expiryDate) < new Date();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return status === "ACTIVE" && !isExpired
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400";
      case "REJECTED":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 text-left align-middle shadow-xl transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                {membership.issuerName}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Image */}
              {membership.cardImage && (
                <div className="h-full">
                  <img
                    src={membership.cardImage}
                    alt={membership.issuerName}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}

              {/* Details */}
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      membership.status === "ACTIVE" && !isExpired
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                        : membership.status === "EXPIRED" || isExpired
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
                    }`}
                  >
                    {isExpired ? "Expired" : membership.status}
                  </span>
                </div>

                {/* Membership Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Membership Number
                  </label>
                  <p className="text-lg font-mono text-gray-900 dark:text-white break-all">
                    {membership.membershipNumber}
                  </p>
                </div>

                {/* Membership Type */}
                {membership.membershipType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Membership Type
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {membership.membershipType}
                    </p>
                  </div>
                )}

                {/* Expiry Date */}
                {membership.expiryDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Valid Until
                    </label>
                    <p
                      className={`text-lg font-semibold ${
                        isExpired
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {new Date(membership.expiryDate).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}

                {/* Verified Badge */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">✓</div>
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Verified Membership
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        This business holds a verified membership with{" "}
                        {membership.issuerName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
