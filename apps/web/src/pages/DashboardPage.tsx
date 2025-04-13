import React, { useEffect, useState } from 'react';
import { useCallListStore } from '../store';
import { CallRecord } from '@conista/shared-types';

/**
 * Dashboard page component
 */
const DashboardPage: React.FC = () => {
  const { fetchCalls, calls, isLoading, error } = useCallListStore();
  const [stats, setStats] = useState({
    totalCalls: 0,
    averageDuration: 0,
    byStatus: {} as Record<string, number>,
    bySentiment: {} as Record<string, number>,
  });
  
  // Fetch calls data when component mounts
  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);
  
  // Calculate statistics when calls data changes
  useEffect(() => {
    if (calls.length > 0) {
      // Calculate total calls
      const totalCalls = calls.length;
      
      // Calculate average duration
      const totalDuration = calls.reduce((sum: number, call: CallRecord) => sum + call.duration, 0);
      const averageDuration = Math.round(totalDuration / totalCalls);
      
      // Count by status
      const byStatus = calls.reduce((acc: Record<string, number>, call: CallRecord) => {
        acc[call.status] = (acc[call.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Count by sentiment
      const bySentiment = calls.reduce((acc: Record<string, number>, call: CallRecord) => {
        if (call.sentiment) {
          acc[call.sentiment] = (acc[call.sentiment] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      
      setStats({
        totalCalls,
        averageDuration,
        byStatus,
        bySentiment,
      });
    }
  }, [calls]);
  
  // Format duration in minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          <p>Error loading dashboard data: {error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Calls Card */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Calls</h3>
            <p className="mt-2 text-3xl font-bold">{stats.totalCalls}</p>
          </div>
          
          {/* Average Duration Card */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Average Duration</h3>
            <p className="mt-2 text-3xl font-bold">{formatDuration(stats.averageDuration)}</p>
          </div>
          
          {/* Status Breakdown Card */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Status Breakdown</h3>
            <div className="mt-2 space-y-2">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sentiment Breakdown Card */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Sentiment Analysis</h3>
            <div className="mt-2 space-y-2">
              {Object.entries(stats.bySentiment).map(([sentiment, count]) => (
                <div key={sentiment} className="flex items-center justify-between">
                  <span className="capitalize">{sentiment}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Calls Section */}
      {!isLoading && !error && calls.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold">Recent Calls</h2>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {calls.slice(0, 5).map((call: CallRecord) => (
                  <tr key={call.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{call.title}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {new Date(call.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{call.agentName}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{formatDuration(call.duration)}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold uppercase leading-5 text-green-800">
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 