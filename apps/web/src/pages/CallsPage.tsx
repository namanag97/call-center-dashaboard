import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallListStore } from '../store';

interface Call {
  id: string;
  title: string;
  date: string;
  duration: number;
  status: string;
  sentiment: number;
}

const CallsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    calls, 
    isLoading, 
    error, 
    fetchCalls,
  } = useCallListStore();

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const handleViewCall = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.7) return { label: 'Positive', className: 'bg-green-100 text-green-800' };
    if (score > 0.4) return { label: 'Neutral', className: 'bg-blue-100 text-blue-800' };
    return { label: 'Negative', className: 'bg-red-100 text-red-800' };
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-red-500 text-xl mb-4">Failed to load calls</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => fetchCalls()}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Call History</h1>
        <button 
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          onClick={() => navigate('/new-call')}
        >
          New Call
        </button>
      </div>

      {calls.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-4">No calls found. Start by creating a new call.</p>
          <button 
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
            onClick={() => navigate('/new-call')}
          >
            Create Your First Call
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sentiment
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calls.map((call: Call) => {
                  const sentiment = getSentimentLabel(call.sentiment);
                  return (
                    <tr key={call.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{call.title || `Call #${call.id}`}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(call.date).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDuration(call.duration)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(call.status)}`}>
                          {call.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sentiment.className}`}>
                          {sentiment.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewCall(call.id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallsPage; 