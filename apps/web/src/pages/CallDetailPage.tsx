import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCallDetailStore } from '../store';

interface TranscriptEntry {
  speaker: string;
  text: string;
}

const CallDetailPage: React.FC = () => {
  const { callId } = useParams<{ callId: string }>();
  const navigate = useNavigate();
  const { 
    call, 
    isLoading, 
    error, 
    fetchCallDetail,
    clearCallDetail
  } = useCallDetailStore();

  useEffect(() => {
    if (callId) {
      fetchCallDetail(callId);
    }
    
    return () => {
      clearCallDetail();
    };
  }, [callId, fetchCallDetail, clearCallDetail]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full border-t-4 border-primary-500 border-opacity-50 h-12 w-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-red-500 mb-4">Error loading call details: {error}</div>
        <button 
          onClick={() => navigate('/calls')}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
        >
          Return to Call List
        </button>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mb-4">Call not found</div>
        <button 
          onClick={() => navigate('/calls')}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
        >
          Return to Call List
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{call.title || 'Call Details'}</h1>
        <button 
          onClick={() => navigate('/calls')}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
        >
          Back to Call List
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Call Information</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500">ID:</span> {call.id}
                </div>
                <div>
                  <span className="text-gray-500">Date:</span> {new Date(call.date).toLocaleString()}
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span> {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')} min
                </div>
                <div>
                  <span className="text-gray-500">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    call.status === 'completed' ? 'bg-green-100 text-green-800' :
                    call.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {call.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Sentiment Analysis</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500">Overall Sentiment:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    call.sentiment > 0.7 ? 'bg-green-100 text-green-800' :
                    call.sentiment > 0.4 ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {call.sentiment > 0.7 ? 'Positive' : 
                     call.sentiment > 0.4 ? 'Neutral' : 'Negative'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Score:</span> {(call.sentiment * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Transcript</h2>
            <div className="bg-gray-50 p-4 rounded max-h-[400px] overflow-y-auto">
              {call.transcript ? (
                <div className="space-y-4">
                  {call.transcript.map((entry: TranscriptEntry, index: number) => (
                    <div key={index} className={`flex ${entry.speaker === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg p-3 ${
                        entry.speaker === 'agent' ? 'bg-primary-100 text-primary-800' : 'bg-gray-200'
                      }`}>
                        <div className="font-semibold mb-1">{
                          entry.speaker === 'agent' ? 'Agent' : 'Customer'
                        }</div>
                        <div>{entry.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic">No transcript available for this call.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDetailPage; 