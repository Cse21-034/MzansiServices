import React from "react";
import { MembershipStatus } from "@prisma/client";

interface MembershipBadgeProps {
  status: MembershipStatus;
  membershipType?: string | null;
  expiryDate?: Date;
}

export const MembershipBadge: React.FC<MembershipBadgeProps> = ({
  status,
  membershipType,
  expiryDate,
}) => {
  if (status === "NONE") return null;

  const isExpired =
    expiryDate && new Date(expiryDate) < new Date();

  const statusConfig = {
    ACTIVE: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Verified Member",
      icon: "✓",
    },
    PENDING: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Pending Verification",
      icon: "⏳",
    },
    EXPIRED: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Membership Expired",
      icon: "⚠",
    },
    REJECTED: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Membership Rejected",
      icon: "✕",
    },
    NONE: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Not Verified",
      icon: "○",
    },
  };

  const config =
    isExpired && status === "ACTIVE"
      ? statusConfig.EXPIRED
      : statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
      {membershipType && <span className="ml-1">({membershipType})</span>}
    </div>
  );
};
