'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface SelectBusinessProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (businessId: string) => void;
  onCreateNew: () => void;
  planTier: string;
}

interface Business {
  id: string;
  name: string;
  city: string;
  status: string;
  subscription?: {
    status: string;
    plan?: {
      tier: string;
    };
  };
}

export const SelectBusinessModal: React.FC<SelectBusinessProps> = ({
  isOpen,
  onClose,
  onSelect,
  onCreateNew,
  planTier,
}) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (isOpen && session) {
      fetchBusinesses();
    }
  }, [isOpen, session]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/businesses');
      const data = await response.json();
      if (data.success) {
        setBusinesses(data.businesses || []);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Select Business
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Choose a business to subscribe to the {planTier} plan
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
          </div>
        ) : businesses.length > 0 ? (
          <>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {businesses.map((business) => (
                <button
                  key={business.id}
                  onClick={() => {
                    onSelect(business.id);
                    onClose();
                  }}
                  className="w-full text-left p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-burgundy-600 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {business.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {business.city}
                  </p>
                  {business.subscription && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Current: {business.subscription.plan?.tier || 'Free'}
                    </p>
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={onCreateNew}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                + Create New Business
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You don't have any businesses yet
            </p>
            <button
              onClick={onCreateNew}
              className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Create Your First Business
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
