import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import terminal from 'vite-plugin-terminal';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    terminal({
      console: {
        enabled: true,
        // Forward console.log, console.warn, console.error to terminal
        log: true,
        warn: true,
        error: true,
        // Optionally filter logs
        filter: {
          includes: [], // Only include logs containing these strings
          excludes: ['[HMR]', '[vite]'] // Exclude logs containing these strings
        },
        // Customize output format
        output: {
          // Add timestamp
          timestamp: true,
          // Add file and line information
          location: true,
          // Add custom prefix to each log
          prefix: '[Browser]'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  }
});
