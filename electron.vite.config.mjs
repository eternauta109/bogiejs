import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      visualizer({
        open: true, // Apri automaticamente il report nel browser
        filename: 'stats.html', // Nome del file di output
        gzipSize: true, // Mostra le dimensioni gzip
        brotliSize: true // Mostra anche le dimensioni Brotli
      })
    ]
  }
})
