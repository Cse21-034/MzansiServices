"use client";
import React, { useState, useMemo } from "react";
import { namibiaDirectory, DirectoryEntry, getDirectoryByType } from "@/data/govementdirectory";
import GovernmentDirectoryCard from "@/components/GovernmentDirectoryCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function GovernmentDirectoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<DirectoryEntry['type'] | "all">("all");

    const filteredEntries = useMemo(() => {
        let results = namibiaDirectory;

        // Filter by type
        if (selectedType !== "all") {
            results = getDirectoryByType(selectedType);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const searchTerm = searchQuery.toLowerCase();
            results = results.filter(entry =>
                entry.name.toLowerCase().includes(searchTerm) ||
                entry.city?.toLowerCase().includes(searchTerm) ||
                entry.address?.toLowerCase().includes(searchTerm) ||
                entry.type.toLowerCase().includes(searchTerm)
            );
        }

        return results;
    }, [searchQuery, selectedType]);

    const typeOptions: Array<{ value: DirectoryEntry['type'] | "all", label: string, count: number }> = [
        { value: "all", label: "All Categories", count: namibiaDirectory.length },
        { value: "ministry", label: "Ministries", count: getDirectoryByType("ministry").length },
        { value: "parastatal", label: "Parastatals", count: getDirectoryByType("parastatal").length },
        { value: "agency", label: "Agencies", count: getDirectoryByType("agency").length },
        { value: "local_authority", label: "Local Authorities", count: getDirectoryByType("local_authority").length },
        { value: "utility", label: "Utilities", count: getDirectoryByType("utility").length },
        { value: "other", label: "Other", count: getDirectoryByType("other").length },
    ];

    return (
        <div className="nc-GovernmentDirectoryPage bg-neutral-50 dark:bg-neutral-900 min-h-screen pt-8">
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                        Government Directory
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Find contact information for government ministries, parastatals, agencies, and local authorities in South Africa
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="max-w-5xl mx-auto mb-8 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by name, location, or type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 text-lg rounded-2xl border-2 border-burgundy-200 dark:border-burgundy-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-burgundy-600 focus:border-burgundy-600 outline-none transition shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Quick Filter Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {typeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSelectedType(option.value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedType === option.value
                                        ? 'bg-burgundy-600 text-white shadow-lg scale-105'
                                        : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-2 border-burgundy-200 dark:border-burgundy-800 hover:border-burgundy-400 dark:hover:border-burgundy-600'
                                    }`}
                            >
                                {option.label} ({option.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="max-w-5xl mx-auto mb-6">
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Showing <span className="font-semibold text-burgundy-600 dark:text-burgundy-400">{filteredEntries.length}</span> {filteredEntries.length === 1 ? 'result' : 'results'}
                        {searchQuery && ` for "${searchQuery}"`}
                    </p>
                </div>

                {/* Results Grid */}
                {filteredEntries.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {filteredEntries.map((entry, index) => (
                            <GovernmentDirectoryCard key={index} data={entry} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 text-neutral-400 dark:text-neutral-600">
                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                            No Results Found
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Try adjusting your search or filter to find what you're looking for
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedType("all");
                            }}
                            className="px-6 py-3 bg-burgundy-600 text-white rounded-xl hover:bg-burgundy-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Info Section */}
                <div className="max-w-5xl mx-auto mt-16 p-6 bg-burgundy-50 dark:bg-burgundy-900/20 rounded-2xl border-2 border-burgundy-200 dark:border-burgundy-800">
                    <h3 className="text-lg font-semibold text-burgundy-900 dark:text-burgundy-100 mb-2">
                        About This Directory
                    </h3>
                    <p className="text-burgundy-800 dark:text-burgundy-200">
                        This directory provides comprehensive contact information for government institutions in South Africa.
                        Click on any entry to view full details including addresses, phone numbers, emails, and websites.
                    </p>
                </div>
            </main>
        </div>
    );
}
