'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, MousePointer, Activity } from 'lucide-react';

interface AdAnalytics {
  id: string;
  adTitle: string;
  packageId: string;
  status: string;
  impressions: number;
  clicks: number;
  ctr: number;
  startDate: string;
  expiryDate: string;
  lastPaymentDate?: string;
  analytics: Array<{
    id: string;
    eventType: 'impression' | 'click';
    eventDate: string;
    referrer?: string;
    country?: string;
    city?: string;
  }>;
}

interface AdAnalyticsDashboardProps {
  businessId: string;
  subscriptionId: string;
}

export function AdAnalyticsDashboard({ businessId, subscriptionId }: AdAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AdAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [subscriptionId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/advertising/analytics?subscriptionId=${subscriptionId}`);

      if (!res.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await res.json();
      if (data.success) {
        // Merge subscription data with stats
        const analyticsData = {
          ...data.data.subscription,
          impressions: data.data.stats?.impressions || 0,
          clicks: data.data.stats?.clicks || 0,
          ctr: data.data.stats?.ctr || 0,
          analytics: data.data.recentEvents || [],
        };
        setAnalytics(analyticsData);
        
        // Process events for chart data
        processChartData(data.data.recentEvents || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Process events into chart-friendly format
  const processChartData = (events: any[]) => {
    const eventsByDate = new Map<string, { impressions: number; clicks: number }>();

    events.forEach((event) => {
      const date = new Date(event.eventDate).toLocaleDateString();
      const current = eventsByDate.get(date) || { impressions: 0, clicks: 0 };

      if (event.eventType === 'impression') {
        current.impressions += 1;
      } else if (event.eventType === 'click') {
        current.clicks += 1;
      }

      eventsByDate.set(date, current);
    });

    const data = Array.from(eventsByDate.entries())
      .map(([date, counts]) => ({
        date,
        ...counts,
      }))
      .reverse();

    setChartData(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const daysRemaining = getDaysRemaining(analytics.expiryDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {analytics.adTitle}
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
            {analytics.status}
          </span>
          <span>
            {formatDate(analytics.startDate)} - {formatDate(analytics.expiryDate)} ({daysRemaining} days remaining)
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Impressions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Impressions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {(analytics.impressions || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total views</p>
        </div>

        {/* Clicks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MousePointer className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Clicks</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {(analytics.clicks || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total clickthrus</p>
        </div>

        {/* Click-Through Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">CTR</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {((analytics.ctr || 0).toFixed(2))}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click-through rate</p>
        </div>

        {/* Engagement Ratio */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {(((analytics.clicks || 0) / Math.max((analytics.impressions || 0), 1)) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Engagement ratio</p>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Impressions & Clicks Over Time */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Impressions"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Daily Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="impressions" fill="#3b82f6" name="Impressions" />
                <Bar dataKey="clicks" fill="#10b981" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No activity data yet. Ad is waiting for visitors!</p>
        </div>
      )}

      {/* Recent Events Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Event</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Location</th>
              </tr>
            </thead>
            <tbody>
              {(analytics.analytics || []).slice(0, 10).map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        event.eventType === 'impression'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}
                    >
                      {event.eventType === 'impression' ? '👁️ Impression' : '🖱️ Click'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(event.eventDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {event.city ? `${event.city}, ${event.country}` : event.country || 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
