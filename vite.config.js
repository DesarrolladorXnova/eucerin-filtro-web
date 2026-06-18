import { defineConfig } from 'vite'

export default defineConfig({
  base: '/eucerin-filtro-web/',
  build: {
    target: 'es2015',
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})