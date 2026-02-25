"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BellIcon,
  LockClosedIcon,
  BuildingStorefrontIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";

export default function BusinessSettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("business");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [businessData, setBusinessData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    description: "",
  });
  const [subscriptionData, setSubscriptionData] = useState({
    currentPlan: "Free",
    renewalDate: "",
  });

  useEffect(() => {
    // Fetch business data
    const fetchBusinessData = async () => {
      try {
        const response = await fetch("/api/business/profile");
        if (response.ok) {
          const data = await response.json();
          setBusinessData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            category: data.category?.name || data.category || "",
            description: data.description || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch business data", error);
      }
    };

    if (session?.user?.role === "BUSINESS") {
      fetchBusinessData();
    }
  }, [session]);

  if (!session?.user || session?.user?.role !== "BUSINESS") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            You don't have access to this page
          </p>
          <Link
            href="/business"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // The existing endpoint expects more fields, so we'll send a minimal request
      const payload = {
        name: businessData.name,
        email: businessData.email,
        phone: businessData.phone,
        description: businessData.description,
        category: { name: businessData.category },
        subcategory: null,
      };

      const response = await fetch("/api/business/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Update the local state with the response
        setBusinessData({
          name: responseData.name || businessData.name,
          email: responseData.email || businessData.email,
          phone: responseData.phone || businessData.phone,
          category: responseData.category?.name || businessData.category,
          description: responseData.description || businessData.description,
        });
        setMessage({ type: "success", text: "Business profile updated successfully!" });
      } else {
        setMessage({ 
          type: "error", 
          text: responseData.error || "Failed to update business profile" 
        });
      }
    } catch (error) {
      console.error("Error updating business:", error);
      setMessage({ type: "error", text: "An error occurred while updating profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-40">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Business Settings</h1>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden sticky top-20">
              <nav className="divide-y divide-neutral-200 dark:divide-neutral-800">
                <button
                  onClick={() => setActiveTab("business")}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    activeTab === "business"
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <BuildingStorefrontIcon className="w-5 h-5" />
                  <span className="font-medium">Business Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("subscription")}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    activeTab === "subscription"
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <CreditCardIcon className="w-5 h-5" />
                  <span className="font-medium">Subscription</span>
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    activeTab === "notifications"
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <BellIcon className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  message.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                }`}
              >
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                <p>{message.text}</p>
              </div>
            )}

            {/* Business Profile */}
            {activeTab === "business" && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Business Profile</h2>
                <form onSubmit={handleUpdateBusiness} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessData.name}
                      onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={businessData.email}
                        onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={businessData.phone}
                        onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={businessData.category}
                      onChange={(e) => setBusinessData({ ...businessData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={businessData.description}
                      onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-burgundy-600 hover:bg-burgundy-800 text-neutral-50 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* Subscription Settings */}
            {activeTab === "subscription" && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Subscription & Billing</h2>
                <div className="space-y-6">
                  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">Current Plan</h3>
                        <p className="text-2xl font-bold text-primary-600 mt-2">{subscriptionData.currentPlan}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full font-medium">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Next billing date: <span className="font-semibold text-neutral-900 dark:text-white">{subscriptionData.renewalDate}</span>
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/business/upgrade"
                      className="flex-1 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-center"
                    >
                      Upgrade Plan
                    </Link>
                    <button className="flex-1 px-6 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      Manage Billing
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  {[
                    {
                      label: "New Orders",
                      description: "Get notified when you receive new orders",
                    },
                    {
                      label: "Customer Reviews",
                      description: "Receive notifications for customer reviews and ratings",
                    },
                    {
                      label: "Business Messages",
                      description: "Notifications for customer inquiries",
                    },
                    {
                      label: "Marketing Updates",
                      description: "Marketing tips and platform updates",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.description}</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
