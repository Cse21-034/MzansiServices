import React from "react";
import { MembershipStatus } from "@prisma/client";
import { MembershipCard } from "./MembershipCard";
import { MembershipBadge } from "./MembershipBadge";

interface MembershipSectionProps {
  cardImage?: string;
  membershipNumber?: string;
  membershipType?: string;
  membershipProvider?: string;
  expiryDate?: Date;
  status: MembershipStatus;
  uploadedAt?: Date;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({
  cardImage,
  membershipNumber,
  membershipType,
  membershipProvider,
  expiryDate,
  status,
  uploadedAt,
}) => {
  if (status === "NONE" || !cardImage) {
    return null;
  }

  return (
    <section className="my-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-indigo-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Membership & Credentials
          </h2>
          <p className="text-gray-600">
            This business has been verified and holds a valid membership.
          </p>
        </div>
        <MembershipBadge
          status={status}
          membershipType={membershipType}
          expiryDate={expiryDate}
        />
      </div>

      {/* Main Card Display */}
      <div className="mb-6">
        <MembershipCard
          cardImage={cardImage}
          membershipNumber={membershipNumber}
          membershipType={membershipType}
          membershipProvider={membershipProvider}
          expiryDate={expiryDate}
          status={status}
        />
      </div>

      {/* Additional Info */}
      {uploadedAt && (
        <div className="text-xs text-gray-500 text-right">
          Membership verified on{" "}
          {new Date(uploadedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      )}

      {/* Trust Badge */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🏆</div>
          <div>
            <h3 className="font-semibold text-gray-900">Trustworthy Business</h3>
            <p className="text-sm text-gray-600">
              This business has been verified and maintains an active membership.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
