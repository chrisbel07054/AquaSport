import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon.svg'],
      manifest: {
        name: 'AquaSport - Natación',
        short_name: 'AquaSport',
        description: 'Aplicación para gestión de torneos de natación y deportes acuáticos',
        theme_color: '#0ea5e9',
        background_color: '#f8fafc',
        display: 'standalone',
        id: '/',
        start_url: '/',
        orientation: 'any',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: '/screenshot-mobile.png',
            sizes: '720x1280',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})