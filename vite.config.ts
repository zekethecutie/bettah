
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Critical for Replit to expose the server
    hmr: {
        clientPort: 443 // Ensures Hot Module Replacement works through Replit's proxy
    }
  }
})
