// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- ADD THIS 'test' CONFIGURATION ---
  test: {
    environment: 'jsdom', // This tells Vitest to simulate a browser environment
    globals: true, // This makes describe, it, expect globally available
    setupFiles: './src/tests/setup.js', // We'll create this file for common setup/mocks
  },
  // --- END 'test' CONFIGURATION ---
})