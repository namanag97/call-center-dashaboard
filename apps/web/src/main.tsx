import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Define the MSW initialization function (keep the version with timeout/error handling)
async function initMocks() {
  if (import.meta.env.DEV) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('MSW initialization timed out')), 5000);
      });

      const workerPromise = import('./mocks/browser').then(({ worker }) => {
        console.log('Starting MSW worker...');
        return worker.start({
          onUnhandledRequest: 'bypass',
        });
      });

      return Promise.race([workerPromise, timeoutPromise])
        .catch(error => {
          console.error('MSW initialization failed:', error);
          console.warn('Continuing without MSW - API requests will go to real endpoints');
          return Promise.resolve(); // Ensure promise resolves even on error
        });
    } catch (error) {
      console.error('MSW import failed:', error);
      console.warn('Continuing without MSW - API requests will go to real endpoints');
      return Promise.resolve(); // Ensure promise resolves even on error
    }
  }
  return Promise.resolve(); // Resolve immediately in non-DEV environment
}

// --- TEMPORARY DEBUGGING STEP ---
// Call initMocks BUT DO NOT wait for it before rendering.
// This lets the app render while MSW tries to initialize in the background.
// If MSW hangs, the app might still render (but API calls won't be mocked initially).
// If MSW errors, it will log to console without blocking rendering.
if (import.meta.env.DEV) {
  initMocks(); // Start MSW init, but don't await it here
}
// --- END TEMPORARY DEBUGGING STEP ---


// --- ALWAYS RENDER THE APP ---
// This part MUST run to see your application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
// --- END ALWAYS RENDER ---