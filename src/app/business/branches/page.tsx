"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import { PlusIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Branch {
    id: string;
    branchName: string;
    city: string;
    address?: string;
    phone: string;
    email: string;
    region?: string;
}

interface Business {
    id: string;
    name: string;
    branches: Branch[];
}

export default function BranchManagementPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        branchName: "",
        city: "",
        address: "",
        phone: "",
        email: "",
        region: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchBusinesses();
        }
    }, [status, router]);

    const fetchBusinesses = async () => {
        try {
            const res = await fetch("/api/business/branches");
            const data = await res.json();

            if (data.success) {
                setBusinesses(data.businesses);
            }
        } catch (err) {
            console.error("Error fetching businesses:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!selectedBusiness) {
            setError("Please select a business");
            return;
        }

        try {
            const res = await fetch("/api/business/branches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    parentBusinessId: selectedBusiness,
                    ...formData,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Branch added successfully!");
                setShowAddModal(false);
                setFormData({
                    branchName: "",
                    city: "",
                    address: "",
                    phone: "",
                    email: "",
                    region: "",
                });
                fetchBusinesses();
            } else {
                setError(data.error || "Failed to add branch");
            }
        } catch (err) {
            setError("An error occurred while adding the branch");
        }
    };

    const handleDeleteBranch = async (branchId: string) => {
        if (!confirm("Are you sure you want to delete this branch?")) {
            return;
        }

        try {
            const res = await fetch(`/api/business/branches/${branchId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setSuccess("Branch deleted successfully!");
                fetchBusinesses();
            } else {
                setError("Failed to delete branch");
            }
        } catch (err) {
            setError("An error occurred while deleting the branch");
        }
    };

    if (loading) {
        return (
            <div className="container py-16">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                            Branch Management
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Manage your business locations and branches
                        </p>
                    </div>
                    {businesses.length > 0 && (
                        <ButtonPrimary
                            onClick={() => {
                                setSelectedBusiness(businesses[0].id);
                                setShowAddModal(true);
                            }}
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Branch
                        </ButtonPrimary>
                    )}
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-green-600 dark:text-green-400">{success}</p>
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Business List */}
                {businesses.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-neutral-600 dark:text-neutral-400">
                            No businesses found. Please register a business first.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {businesses.map((business) => (
                            <div
                                key={business.id}
                                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                            {business.name}
                                        </h2>
                                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                                            {business.branches.length} branch{business.branches.length !== 1 ? "es" : ""}
                                        </p>
                                    </div>
                                    <ButtonPrimary
                                        onClick={() => {
                                            setSelectedBusiness(business.id);
                                            setShowAddModal(true);
                                        }}
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Add Branch
                                    </ButtonPrimary>
                                </div>

                                {/* Branches Grid */}
                                {business.branches.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {business.branches.map((branch) => (
                                            <div
                                                key={branch.id}
                                                className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                        {branch.branchName}
                                                    </h3>
                                                    <button
                                                        onClick={() => handleDeleteBranch(branch.id)}
                                                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <MapPinIcon className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-neutral-600 dark:text-neutral-400">
                                                            {branch.address || branch.city}
                                                            {branch.region && `, ${branch.region}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <PhoneIcon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                                                        <span className="text-neutral-600 dark:text-neutral-400">
                                                            {branch.phone}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <EnvelopeIcon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                                                        <span className="text-neutral-600 dark:text-neutral-400 truncate">
                                                            {branch.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                                        No branches yet. Click "Add Branch" to create one.
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Branch Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                                    Add New Branch
                                </h2>
                                <form onSubmit={handleAddBranch} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                            Branch Name *
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.branchName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, branchName: e.target.value })
                                            }
                                            placeholder="e.g., Main Mall, Francistown"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                                City *
                                            </label>
                                            <Input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, city: e.target.value })
                                                }
                                                placeholder="e.g., Windhoek, Oshakati"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                                Region
                                            </label>
                                            <Input
                                                type="text"
                                                value={formData.region}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, region: e.target.value })
                                                }
                                                placeholder="e.g., South-East"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                            Branch Address *
                                        </label>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                                            Provide the specific address for this branch location (must be different from other branches)
                                        </p>
                                        <Input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) =>
                                                setFormData({ ...formData, address: e.target.value })
                                            }
                                            placeholder="Plot 123, Main Mall, Building 45"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                                Phone
                                            </label>
                                            <Input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, phone: e.target.value })
                                                }
                                                placeholder="+267 XXX XXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                                Email
                                            </label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })
                                                }
                                                placeholder="branch@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <ButtonSecondary
                                            type="button"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setFormData({
                                                    branchName: "",
                                                    city: "",
                                                    address: "",
                                                    phone: "",
                                                    email: "",
                                                    region: "",
                                                });
                                            }}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </ButtonSecondary>
                                        <ButtonPrimary type="submit" className="flex-1">
                                            Add Branch
                                        </ButtonPrimary>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
