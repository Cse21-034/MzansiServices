import React from "react";
import Image from "next/image";
import { MembershipStatus } from "@prisma/client";

interface MembershipCardProps {
  cardImage: string;
  membershipNumber?: string;
  membershipType?: string;
  membershipProvider?: string;
  expiryDate?: Date;
  status: MembershipStatus;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  cardImage,
  membershipNumber,
  membershipType,
  membershipProvider,
  expiryDate,
  status,
}) => {
  const isExpired = expiryDate && new Date(expiryDate) < new Date();
  const daysUntilExpiry = expiryDate
    ? Math.floor(
        (new Date(expiryDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const statusColor = {
    ACTIVE: "border-green-500 bg-green-50",
    PENDING: "border-yellow-500 bg-yellow-50",
    EXPIRED: "border-red-500 bg-red-50",
    REJECTED: "border-gray-500 bg-gray-50",
    NONE: "border-gray-300 bg-gray-50",
  };

  const statusText = {
    ACTIVE: "text-green-700",
    PENDING: "text-yellow-700",
    EXPIRED: "text-red-700",
    REJECTED: "text-gray-700",
    NONE: "text-gray-700",
  };

  return (
    <div
      className={`border-2 p-4 rounded-lg ${statusColor[status]} relative overflow-hidden`}
    >
      {/* Status Banner */}
      {status !== "NONE" && (
        <div
          className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold ${statusText[status]} bg-white/80 rounded-bl-lg`}
        >
          {status === "ACTIVE" && !isExpired ? "✓ ACTIVE" : status}
        </div>
      )}

      {/* Card Image */}
      <div className="relative h-64 mb-4 rounded-lg overflow-hidden bg-gray-200">
        <Image
          src={cardImage}
          alt="Membership Card"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Details Section */}
      <div className="space-y-3">
        {membershipProvider && (
          <div>
            <label className="text-xs font-semibold text-gray-600 block">
              Issued By
            </label>
            <p className="text-sm font-medium text-gray-900">
              {membershipProvider}
            </p>
          </div>
        )}

        {membershipNumber && (
          <div>
            <label className="text-xs font-semibold text-gray-600 block">
              Membership Number
            </label>
            <p className="text-sm font-mono text-gray-900">
              {membershipNumber}
            </p>
          </div>
        )}

        {membershipType && (
          <div>
            <label className="text-xs font-semibold text-gray-600 block">
              Membership Type
            </label>
            <p className="text-sm text-gray-900">{membershipType}</p>
          </div>
        )}

        {expiryDate && (
          <div>
            <label className="text-xs font-semibold text-gray-600 block">
              Expiry Date
            </label>
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-900">
                {new Date(expiryDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {isExpired ? (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                  Expired
                </span>
              ) : daysUntilExpiry !== null && daysUntilExpiry < 30 ? (
                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  Expires in {daysUntilExpiry} days
                </span>
              ) : (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                  Valid
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
