import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optimized configuration for faster startup and development
export default defineConfig({
  plugins: [react()],
  
  // Optimize dependencies to speed up startup
  optimizeDeps: {
    // Only include essential dependencies to speed up startup
    include: ['react', 'react-dom', 'react-router-dom'],
    // Exclude MSW which seems to cause issues during pre-bundling
    exclude: ['msw'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  
  // Configure server for better performance
  server: {
    port: 3001, // Different port to avoid conflicts
    host: 'localhost',
    open: false, // Disable auto-open for debugging
    hmr: true,
    // Add a longer timeout for operations
    middlewareMode: false,
  },
  
  // Build optimization
  build: {
    minify: 'esbuild',
    target: 'esnext',
    // Limit chunk size for better performance
    chunkSizeWarningLimit: 1000,
  },
  
  // Debugging helpers
  logLevel: 'info',
  clearScreen: false,
})
