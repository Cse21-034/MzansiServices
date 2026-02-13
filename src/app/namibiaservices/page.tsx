"use client";

import React, { FC, useState, useEffect } from "react";

type Business = {
  id: string;
  name: string;
  category?: { name: string } | string;
  owner?: { name: string };
  ownerId?: string;
  email?: string;
  phone?: string;
  location?: string;
  status: string;
  verified: boolean;
  reviews?: any[];
  viewCount?: number;
  averageRating?: number;
  createdAt?: string;
};
import { 
  BuildingStorefrontIcon,
  UsersIcon,
  ChartBarIcon,
  EyeIcon,
  StarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChevronDownIcon,
  // Cog6ToothIcon may be in the solid set depending on heroicons version
} from "@heroicons/react/24/outline";
import { Cog6ToothIcon as Cog6ToothIconSolid } from "@heroicons/react/24/solid";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Badge from "@/shared/Badge";
import AdminNav from "@/components/AdminNav";
import { useSession } from "next-auth/react";

export interface AdminDashboardPageProps {}



const AdminDashboardPage: FC<AdminDashboardPageProps> = ({}) => {
  const { data: session } = useSession();
  const user = session?.user ? {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    role: session.user.role || "Administrator",
    avatarUrl: session.user.image ?? "",
  } : undefined;
  const [activeTab, setActiveTab] = useState("overview");
  const categories = [
    {
      name: 'Food & Hospitality',
      subcategories: [
        'Restaurants', 'Hotels & Lodges', 'Cafes & Bars', 'Catering Services', 'Fast Food'
      ]
    },
    {
      name: 'Retail & Shopping',
      subcategories: [
        'Supermarkets', 'Clothing Stores', 'Electronics', 'Furniture', 'General Dealers'
      ]
    },
    {
      name: 'Healthcare',
      subcategories: [
        'Hospitals', 'Clinics', 'Pharmacies', 'Dental Services', 'Opticians'
      ]
    },
    {
      name: 'Professional Services',
      subcategories: [
        'Legal Services', 'Accounting', 'Consulting', 'IT Services', 'Marketing'
      ]
    },
    {
      name: 'Tourism & Recreation',
      subcategories: [
        'Tour Operators', 'Safari Companies', 'Travel Agencies', 'Adventure Sports', 'Cultural Tours'
      ]
    }
  ];

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Business Categories</h2>
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6">
        {categories.map(cat => (
          <div key={cat.name} className="mb-6">
            <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">{cat.name}</h3>
            <ul className="list-disc ml-6">
              {cat.subcategories.map(sub => (
                <li key={sub} className="text-neutral-700 dark:text-neutral-200">{sub}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    if (activeTab === 'users') {
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => setUsers(data.users || []));
    }
  }, [activeTab]);
  const renderUsersTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-600">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>(() => []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  // Fetch businesses from API
  useEffect(() => {
    const fetchBusinesses = async () => {
      const params: string[] = [];
      if (statusFilter !== 'all') params.push(`status=${statusFilter.toUpperCase()}`);
      if (verificationFilter !== 'all') params.push(`verified=${verificationFilter === 'verified'}`);
      if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const res = await fetch(`/api/admin/businesses${query}`);
      const data = await res.json();
      setBusinesses(data.businesses || []);
    };
    fetchBusinesses();
  }, [statusFilter, verificationFilter, searchTerm]);

  // PATCH business (verify, suspend, edit)
  const handleUpdateBusiness = async (id: string, update: Partial<Business>) => {
    await fetch(`/api/admin/businesses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    // Refresh list
    const res = await fetch('/api/admin/businesses');
    const data = await res.json();
    setBusinesses(data.businesses || []);
  };

  // DELETE business
  const handleDeleteBusiness = async (id: string) => {
    await fetch(`/api/admin/businesses/${id}`, { method: 'DELETE' });
    // Refresh list
    const res = await fetch('/api/admin/businesses');
    const data = await res.json();
    setBusinesses(data.businesses || []);
  };

  // Hide default header
  useEffect(() => {
    const siteHeader = document.querySelector('.nc-SiteHeader');
    if (siteHeader) {
      siteHeader.classList.add('hidden');
    }
    return () => {
      if (siteHeader) {
        siteHeader.classList.remove('hidden');
      }
    };
  }, []);

  // Filter businesses based on search and filters
  // Filtering now handled by API, so just use businesses
  const filteredBusinesses: Business[] = Array.isArray(businesses) ? businesses : [];

  // Stats calculations
  const totalBusinesses = businesses.length;
  const publishedBusinesses = businesses.filter(b => b.status === "PUBLISHED").length;
  const pendingBusinesses = businesses.filter(b => b.status === "PENDING").length;
  const suspendedBusinesses = businesses.filter(b => b.status === "SUSPENDED").length;
  const verifiedBusinesses = businesses.filter(b => b.verified).length;
  const totalReviews = businesses.reduce((sum, business) => sum + (business.reviews?.length || 0), 0);
  const totalViews = businesses.reduce((sum, business) => sum + (business.viewCount || 0), 0);
  const averageRating = businesses.length ? (
    businesses.reduce((sum, business) => sum + (typeof business.averageRating === 'number' ? business.averageRating : 0), 0) /
    businesses.filter(b => typeof b.averageRating === 'number' && b.averageRating > 0).length
  ) : 0;

  const renderOverviewTab = () => {
    return (
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Businesses</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{totalBusinesses}</p>
                <p className="text-xs text-green-600 font-medium mt-1">+5 this month</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <BuildingStorefrontIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Published</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{publishedBusinesses}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{((publishedBusinesses / totalBusinesses) * 100).toFixed(1)}% of total</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Pending Review</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{pendingBusinesses}</p>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">Needs attention</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <ClockIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Verified</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{verifiedBusinesses}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">{((verifiedBusinesses / totalBusinesses) * 100).toFixed(1)}% verified</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <StarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Reviews</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{totalReviews}</p>
                <p className="text-xs text-green-600 font-medium mt-1">+24 this week</p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <StarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Views</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-green-600 font-medium mt-1">+1.2k this month</p>
              </div>
              <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                <EyeIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{averageRating.toFixed(1)}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Across all businesses</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <ChartBarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { action: "New business registration", business: "Masa Square Hotel", time: "2 hours ago", type: "info" },
                { action: "Business published", business: "Fresh Farms Namibia", time: "1 day ago", type: "success" },
                { action: "Review reported", business: "Namibia Tech Solutions", time: "2 days ago", type: "warning" },
                { action: "Business suspended", business: "BuildPro Construction", time: "3 days ago", type: "error" },
                { action: "Business verified", business: "Sprint Couriers", time: "4 days ago", type: "success" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 py-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' : 
                    activity.type === 'warning' ? 'bg-yellow-500' : 
                    activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {activity.action}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {activity.business} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <ButtonPrimary className="w-full justify-center">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add New Business
              </ButtonPrimary>
              <ButtonSecondary className="w-full justify-center">
                <BuildingStorefrontIcon className="w-4 h-4 mr-2" />
                Manage Categories
              </ButtonSecondary>
              <ButtonSecondary className="w-full justify-center">
                <UsersIcon className="w-4 h-4 mr-2" />
                User Management
              </ButtonSecondary>
              <ButtonSecondary className="w-full justify-center">
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Generate Reports
              </ButtonSecondary>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBusinessesTab = () => {
    return (
      <div className="space-y-6">
        {/* Filters and Search */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 max-w-md">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>

              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>

              <ButtonSecondary>
                <FunnelIcon className="w-4 h-4 mr-2" />
                More Filters
              </ButtonSecondary>
            </div>
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-600">
                {filteredBusinesses.map((business) => (
                  <tr key={business.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <BuildingStorefrontIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <div className="font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                              {business.name}
                              {business.verified && (
                                <Badge name="Verified" color="green" className="ml-2" />
                              )}
                              <button
                                className="ml-2 p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                title="View details"
                                onClick={() => { setSelectedBusiness(business); setShowBusinessModal(true); }}
                              >
                                <EyeIcon className="w-4 h-4 text-blue-500" />
                              </button>
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                              {typeof business.category === 'object' && business.category !== null && 'name' in business.category ? business.category.name : business.category} • {business.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-neutral-900 dark:text-neutral-100">{business.owner?.name || business.ownerId}</div>
                        <div className="text-neutral-500 dark:text-neutral-400">{business.email}</div>
                        <div className="text-neutral-500 dark:text-neutral-400">{business.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <Badge 
                          name={business.status.charAt(0).toUpperCase() + business.status.slice(1).toLowerCase()} 
                          color={
                            business.status === 'PUBLISHED' ? 'green' :
                            business.status === 'PENDING' ? 'yellow' : 'red'
                          } 
                        />
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          Joined: {business.createdAt ? new Date(business.createdAt).toLocaleDateString() : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <StarIcon className="w-4 h-4 text-yellow-500" />
                          <span>{typeof business.averageRating === 'number' && business.averageRating > 0 ? business.averageRating.toFixed(1) : 'No ratings'}</span>
                          <span className="text-neutral-500">({business.reviews?.length || 0})</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <EyeIcon className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-500">{business.viewCount || 0} views</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Request documents" onClick={() => { setSelectedBusiness(business); setEmailMessage(`Dear ${business.name},\n\nPlease provide the required documents for special approval.\n\nBest regards,\nAdmin Team`); setShowEmailModal(true); }}>
                          <PencilIcon className="w-4 h-4" />
                        </button>
      {/* Email Modal */}
      {showEmailModal && selectedBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
            <button className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900" onClick={() => setShowEmailModal(false)}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Request Documents</h2>
            <form onSubmit={e => { e.preventDefault(); /* TODO: send email logic */ setShowEmailModal(false); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">To:</label>
                <input type="email" value={selectedBusiness.email || ''} readOnly className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message:</label>
                <textarea value={emailMessage} onChange={e => setEmailMessage(e.target.value)} rows={6} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-800" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Send</button>
                <button type="button" className="px-4 py-2 bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg" onClick={() => setShowEmailModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
                        <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="View details" onClick={() => { setSelectedBusiness(business); setShowBusinessModal(true); }}>
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" onClick={() => handleDeleteBusiness(business.id)}>
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
      {/* Business Details Modal */}
      {showBusinessModal && selectedBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
            <button className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900" onClick={() => setShowBusinessModal(false)}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Business Details</h2>
            <div className="space-y-2">
              <div><strong>Name:</strong> {selectedBusiness.name}</div>
              <div><strong>Email:</strong> {selectedBusiness.email}</div>
              <div><strong>Phone:</strong> {selectedBusiness.phone}</div>
              <div><strong>Location:</strong> {selectedBusiness.location}</div>
              <div><strong>Category:</strong> {typeof selectedBusiness.category === 'object' && selectedBusiness.category !== null && 'name' in selectedBusiness.category ? selectedBusiness.category.name : selectedBusiness.category}</div>
              <div><strong>Status:</strong> {selectedBusiness.status}</div>
              <div><strong>Verified:</strong> {selectedBusiness.verified ? 'Yes' : 'No'}</div>
              <div><strong>Created At:</strong> {selectedBusiness.createdAt ? new Date(selectedBusiness.createdAt).toLocaleDateString() : ''}</div>
              <div><strong>Reviews:</strong> {selectedBusiness.reviews?.length || 0}</div>
              <div><strong>Views:</strong> {selectedBusiness.viewCount || 0}</div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={() => { handleUpdateBusiness(selectedBusiness.id, { status: 'PUBLISHED', verified: true }); setShowBusinessModal(false); }}>Approve</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={() => { handleUpdateBusiness(selectedBusiness.id, { status: 'DISAPPROVED', verified: false }); setShowBusinessModal(false); }}>Disapprove</button>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg" onClick={() => { handleUpdateBusiness(selectedBusiness.id, { status: 'SUSPENDED' }); setShowBusinessModal(false); }}>Suspend</button>
            </div>
          </div>
        </div>
      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-600 flex items-center justify-between">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Showing {filteredBusinesses.length} of {businesses.length} businesses
            </div>
            <div className="flex items-center space-x-2">
              <ButtonSecondary>
                Previous
              </ButtonSecondary>
              <ButtonSecondary>
                Next
              </ButtonSecondary>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-AdminDashboardPage bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      {/* Admin Navigation Header */}
  <AdminNav user={user} />

      {/* Main Content */}
      <main className="lg:container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            Admin Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
            Manage Namibia Services Directory
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'businesses', name: 'Businesses', icon: BuildingStorefrontIcon },
                { id: 'users', name: 'Users', icon: UsersIcon },
                { id: 'categories', name: 'Categories', icon: MapPinIcon },
                { id: 'reports', name: 'Reports', icon: ChartBarIcon },
                { id: 'settings', name: 'Settings', icon: Cog6ToothIconSolid }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'businesses' && renderBusinessesTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'categories' && renderCategoriesTab()}
          {(activeTab === 'reports' || activeTab === 'settings') && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'reports' && <ChartBarIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />}
                {activeTab === 'settings' && <Cog6ToothIconSolid className="w-8 h-8 text-primary-600 dark:text-primary-400" />}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {activeTab === 'reports' && 'View system reports and analytics'}
                {activeTab === 'settings' && 'Configure system settings and preferences'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;