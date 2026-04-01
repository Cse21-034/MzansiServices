"use client";

import React, { useState } from "react";
import MembershipDetailModal from "./MembershipDetailModal";

export interface BusinessMembership {
  id: string;
  issuerName: string;
  membershipNumber: string;
  membershipType?: string;
  cardImage?: string;
  expiryDate?: Date | string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "REJECTED" | "NONE";
  uploadedAt: Date | string;
}

interface MembershipsDisplayProps {
  memberships: BusinessMembership[];
}

export default function MembershipsDisplay({
  memberships,
}: MembershipsDisplayProps) {
  const [selectedMembership, setSelectedMembership] =
    useState<BusinessMembership | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter only active memberships for display to customers
  const activeMemberships = memberships.filter((m) => m.status === "ACTIVE");

  const handleMembershipClick = (membership: BusinessMembership) => {
    setSelectedMembership(membership);
    setIsModalOpen(true);
  };

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Memberships & Associations
      </h2>
      
      {activeMemberships.length === 0 ? (
        // No memberships message
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <p className="text-center text-neutral-600 dark:text-neutral-400">
            <span className="block font-medium mb-1">✓ No memberships or associations registered</span>
            <span className="text-sm">This business does not currently have any active memberships or professional associations.</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeMemberships.map((membership) => (
            <div
              key={membership.id}
              onClick={() => handleMembershipClick(membership)}
              className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition"
            >
              {/* Card Image */}
              {membership.cardImage && (
                <div className="w-full h-32 bg-gray-100 dark:bg-neutral-700 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={membership.cardImage}
                    alt={membership.issuerName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Issuer Name (Clickable) */}
              <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-2">
                {membership.issuerName}
              </h3>

              {/* Additional Info */}
              <div className="space-y-1">
                {membership.membershipType && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Type: <span className="font-medium">{membership.membershipType}</span>
                  </p>
                )}
                {membership.expiryDate && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Valid until: <span className="font-medium">
                      {new Date(membership.expiryDate).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>

              {/* Hover Indicator */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-neutral-700">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Click to view details
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMembership && (
        <MembershipDetailModal
          membership={selectedMembership}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMembership(null);
          }}
        />
      )}
    </section>
  );
}
