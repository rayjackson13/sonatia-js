import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        assets: resolve('src/renderer/src/assets'),
        components: resolve('src/renderer/src/components'),
        constants: resolve('src/renderer/src/constants'),
      },
    },
  },
})
