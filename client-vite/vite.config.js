import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    react(),
    VitePWA({ 
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    // devOptions: {
    //   enabled: true
    // },
    manifest: {
      "name": "Plants Database",
      "short_name": "Plants Database",
      "start_url": "/",
      "theme_color": "#ffffff",
      "background_color": "#ffffff",
      "icons": [
        {
          "src": "pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        },
        
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
