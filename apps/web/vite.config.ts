import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001 // Use a specific port
  },
  resolve: {
    alias: {
      'shared-types': resolve(__dirname, '../../packages/shared-types/src')
    }
  }
})
