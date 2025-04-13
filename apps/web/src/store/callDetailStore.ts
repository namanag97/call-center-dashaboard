import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CallDetail } from '@conista/shared-types';

// API endpoint
const API_URL = '/api/calls';

// Define QA input interface
interface QAInput {
  question: string;
  answer: string;
  category?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

// Define call detail store state
interface CallDetailState {
  // State
  call: CallDetail | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCallDetail: (callId: string) => Promise<void>;
  clearCallDetail: () => void;
  updateQA: (callId: string, qaData: QAInput) => Promise<void>;
}

// Create the call detail store
export const useCallDetailStore = create<CallDetailState>()(
  devtools(
    (set, get) => ({
      // Initial state
      call: null,
      isLoading: false,
      error: null,

      // Actions
      fetchCallDetail: async (callId: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_URL}/${callId}`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to fetch call details');
          }

          const data = await response.json();

          set({
            call: data.data,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch call details';
          set({ error: errorMessage, isLoading: false });
        }
      },

      clearCallDetail: () => {
        set({
          call: null,
          error: null,
        });
      },

      updateQA: async (callId: string, qaData: QAInput) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_URL}/${callId}/qa`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(qaData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to update Q&A');
          }

          const data = await response.json();
          
          // Update the call with new QA data
          const currentCall = get().call;
          if (currentCall) {
            set({
              call: {
                ...currentCall,
                qa: data.data.qa || currentCall.qa,
              },
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update Q&A';
          set({ error: errorMessage, isLoading: false });
        }
      },
    }),
    {
      name: 'call-detail-store',
    }
  )
);

export default useCallDetailStore; 