import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate',
    injectRegister: 'auto',
    manifest: {
      "name": "Plants Database",
      "short_name": "Plants Database",
      "start_url": "/",
      "display": "standalone",
      "theme_color": "#000000",
      "background_color": "#ffffff",
      "icons": [
        {
          "src": "/icons/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/icons/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    },
  
  })
  ],
  server: {
    hmr: {
        host: "localhost"
    },
    host: "localhost",
    watch: {
        usePolling: true,
    },
    https: {
        key: fs.readFileSync(`../ssl/homeserver.key`),
        cert: fs.readFileSync(`../ssl/homeserver.crt`),
    }
  }
})
