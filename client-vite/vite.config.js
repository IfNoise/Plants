import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [react()],
  server: {
    hmr: {
        host: "localhost"
    },
    host: "localhost",
    watch: {
        usePolling: true,
    },
    https: {
        key: fs.readFileSync(`/home/noise83/Документы/Projects/node/MERN/ssl/homeserver.key`),
        cert: fs.readFileSync(`/home/noise83/Документы/Projects/node/MERN/ssl/homeserver.crt`),
    }
  }
})
