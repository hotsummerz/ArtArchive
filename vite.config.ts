import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// ponytail: inline 404.html generator for SPA deep linking on GitHub Pages without extra packages
function spaFallbackPlugin() {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const indexHtml = path.join(dist, 'index.html')
      const notFoundHtml = path.join(dist, '404.html')
      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, notFoundHtml)
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  base: '/'
})
