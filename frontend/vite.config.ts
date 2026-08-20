import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: true,
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
  optimizeDeps: {
    include: ["react-router-dom", "@tanstack/react-query", "lucide-react"],
  },
  build: {
    target: "esnext",
    cssCodeSplit: true,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
