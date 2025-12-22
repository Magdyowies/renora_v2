import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // This makes global APIs like `expect` and `test` available without importing them
    setupFiles: './setupTests.js', // Optional: for global test setup
  },
})