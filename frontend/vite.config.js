export const config = { __vite_skip_native_binding_check: true }
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    host: '0.0.0.0', // Exposes the server to all network interfaces (needed for Docker)
  }
})
