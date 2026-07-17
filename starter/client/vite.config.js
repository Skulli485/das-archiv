import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Der Browser spricht nur mit unserer Grenze (/api). Vite leitet /api an den
// Bun-Server auf Port 3000 weiter, im dev-Server UND in der preview. Darum nie
// CORS, und Lighthouse läuft trotzdem gegen `vite preview`.
const proxy = { '/api': 'http://localhost:3000' }

export default defineConfig({
  plugins: [vue()],
  server: { proxy },
  preview: { proxy },
})
