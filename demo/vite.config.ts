import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: './',
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': resolve(__dirname, '../src/vite/stubs/react-native-svg.tsx'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
  },
  define: {
    __DEV__: JSON.stringify(true),
    process: JSON.stringify({ env: {}, platform: 'web' }),
  },
  build: {
    outDir: '../docs/demo',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
})
