import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ai': {
        target: 'https://kkumgeurimi.o-r.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, ''),
        secure: true
      },
      '/api': {
        target: 'https://api.kkumgeurimi.r-e.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true
      }
    }
  }
})
