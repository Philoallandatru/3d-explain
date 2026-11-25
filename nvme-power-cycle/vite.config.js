import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: './',
  build: {
    rolldownOptions: {
      input: {
        report: resolve(import.meta.dirname, 'index.html'),
        beginner: resolve(import.meta.dirname, 'beginner.html'),
      },
    },
  },
})
