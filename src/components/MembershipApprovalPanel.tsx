"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

interface Membership {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  membershipCardImage: string | null;
  membershipNumber: string | null;
  membershipStatus: string;
  membershipType: string | null;
  membershipExpiryDate: string | null;
  membershipProvider: string | null;
  membershipUploadedAt: string | null;
  owner: {
    name: string | null;
    email: string | null;
  };
}

interface MembershipApprovalProps {
  initialStatus?: string;
}

export const MembershipApprovalPanel: React.FC<MembershipApprovalProps> = ({
  initialStatus = "PENDING",
}) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(initialStatus);
  const [approving, setApproving] = useState<string | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

  useEffect(() => {
    fetchMemberships();
  }, [status]);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/memberships?status=${status}`);
      const data = await response.json();
      setMemberships(data.memberships || []);
    } catch (error) {
      console.error("Error fetching memberships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (membershipId: string) => {
    setApproving(membershipId);
    try {
      const response = await fetch("/api/admin/memberships", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId,
          status: "ACTIVE",
        }),
      });

      if (response.ok) {
        setMemberships(
          memberships.filter((m) => m.id !== membershipId)
        );
        setSelectedMembership(null);
      }
    } catch (error) {
      console.error("Error approving membership:", error);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (membershipId: string) => {
    setApproving(membershipId);
    try {
      const response = await fetch("/api/admin/memberships", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId,
          status: "REJECTED",
        }),
      });

      if (response.ok) {
        setMemberships(
          memberships.filter((m) => m.id !== membershipId)
        );
        setSelectedMembership(null);
      }
    } catch (error) {
      console.error("Error rejecting membership:", error);
    } finally {
      setApproving(null);
    }
  };

  const statusBadgeConfig = {
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending Review" },
    ACTIVE: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
    REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    EXPIRED: { bg: "bg-gray-100", text: "text-gray-800", label: "Expired" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Membership Management
        </h2>
        <div className="flex gap-2">
          {["PENDING", "ACTIVE", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatus(st)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                status === st
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {st} ({memberships.length})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading memberships...</p>
        </div>
      ) : memberships.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No {status.toLowerCase()} memberships
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {memberships.map((membership) => (
            <div
              key={membership.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Membership Card Image */}
                {membership.membershipCardImage && (
                  <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={membership.membershipCardImage}
                      alt="Membership Card"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => setSelectedMembership(membership)}
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <span className="text-white font-semibold">View Full</span>
                    </button>
                  </div>
                )}

                {/* Business Info */}
                <div className="lg:col-span-2 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {membership.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {membership.city}, Namibia
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Owner:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {membership.owner.name || "N/A"}
                      </p>
                    </div>
                    {membership.membershipNumber && (
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Membership #:
                        </span>
                        <p className="text-gray-600 dark:text-gray-400 font-mono">
                          {membership.membershipNumber}
                        </p>
                      </div>
                    )}
                    {membership.membershipProvider && (
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Provider:
                        </span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {membership.membershipProvider}
                        </p>
                      </div>
                    )}
                    {membership.membershipExpiryDate && (
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Expires:
                        </span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {new Date(membership.membershipExpiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusBadgeConfig[membership.membershipStatus as keyof typeof statusBadgeConfig]
                          ?.bg || "bg-gray-100"
                      } ${
                        statusBadgeConfig[membership.membershipStatus as keyof typeof statusBadgeConfig]
                          ?.text || "text-gray-800"
                      }`}
                    >
                      {statusBadgeConfig[membership.membershipStatus as keyof typeof statusBadgeConfig]
                        ?.label || membership.membershipStatus}
                    </div>
                    {membership.membershipUploadedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Uploaded:{" "}
                        {new Date(membership.membershipUploadedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {status === "PENDING" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleApprove(membership.id)}
                        disabled={approving === membership.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        {approving === membership.id ? "Approving..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(membership.id)}
                        disabled={approving === membership.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        {approving === membership.id ? "Rejecting..." : "Reject"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Card Modal */}
      {selectedMembership && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedMembership.name}
              </h3>
              <button
                onClick={() => setSelectedMembership(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>

            {selectedMembership.membershipCardImage && (
              <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
                <Image
                  src={selectedMembership.membershipCardImage}
                  alt="Full Membership Card"
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Business:</p>
                  <p>{selectedMembership.name}</p>
                </div>
                <div>
                  <p className="font-semibold">City:</p>
                  <p>{selectedMembership.city}</p>
                </div>
                <div>
                  <p className="font-semibold">Owner:</p>
                  <p>{selectedMembership.owner.name || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Membership Type:</p>
                  <p>{selectedMembership.membershipType || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Membership Number:</p>
                  <p className="font-mono">{selectedMembership.membershipNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Provider:</p>
                  <p>{selectedMembership.membershipProvider || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Expiry Date:</p>
                  <p>
                    {selectedMembership.membershipExpiryDate
                      ? new Date(selectedMembership.membershipExpiryDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <p>{selectedMembership.membershipStatus}</p>
                </div>
              </div>
            </div>

            {status === "PENDING" && (
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    handleApprove(selectedMembership.id);
                  }}
                  disabled={approving === selectedMembership.id}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  {approving === selectedMembership.id ? "Approving..." : "Approve Membership"}
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedMembership.id);
                  }}
                  disabled={approving === selectedMembership.id}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                >
                  <XCircleIcon className="w-5 h-5" />
                  {approving === selectedMembership.id ? "Rejecting..." : "Reject Membership"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
