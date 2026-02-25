"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import {
  BellIcon,
  LockClosedIcon,
  CogIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("system");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [systemSettings, setSystemSettings] = useState({
    siteName: "Namibia Services",
    description: "Your trusted service marketplace",
    maintenanceMode: false,
  });

  if (!session?.user || session?.user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Admin access required</p>
          <Link
            href="/namibiaservices"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Go to Admin Panel
          </Link>
        </div>
      </div>
    );
  }

  const handleSystemUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(systemSettings),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "System settings updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to update system settings" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
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
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Settings</h1>
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
                  onClick={() => setActiveTab("system")}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    activeTab === "system"
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <CogIcon className="w-5 h-5" />
                  <span className="font-medium">System Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    activeTab === "security"
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="font-medium">Security</span>
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

            {/* System Settings */}
            {activeTab === "system" && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">System Settings</h2>
                <form onSubmit={handleSystemUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={systemSettings.description}
                      onChange={(e) => setSystemSettings({ ...systemSettings, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.maintenanceMode}
                        onChange={(e) =>
                          setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Maintenance Mode
                      </span>
                    </label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Enable to restrict access while performing maintenance
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save System Settings"}
                  </button>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Require 2FA for all admin accounts
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-300 dark:bg-neutral-600 transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                      </button>
                    </div>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">IP Whitelist</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Restrict admin access to specific IP addresses
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-300 dark:bg-neutral-600 transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">System Notifications</h2>
                <div className="space-y-4">
                  {[
                    {
                      label: "New User Registrations",
                      description: "Notify when new users sign up",
                    },
                    {
                      label: "Business Applications",
                      description: "Notify when businesses apply to list",
                    },
                    {
                      label: "Reported Content",
                      description: "Notify when content is reported",
                    },
                    {
                      label: "System Alerts",
                      description: "Critical system and security alerts",
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
