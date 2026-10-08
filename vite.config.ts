import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/office': 'http://localhost:3000',
      '/settings': 'http://localhost:3000',
      '/schedule-blocks': 'http://localhost:3000',
      '/work-schedule': 'http://localhost:3000',
      '/logs': 'http://localhost:3000',
      '/stats': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    },
  },
})
