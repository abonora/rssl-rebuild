import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // ✅ You need this

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        suppressWarnings: true,
      }
    })
  ],
  server: {
    watch: {
      usePolling: true, // ✅ Can help with HMR issues, especially on certain systems
    },
  }
})
