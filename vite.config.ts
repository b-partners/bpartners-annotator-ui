import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), libInjectCss(), dts({ include: ['lib'], exclude: ['lib/__tests__'] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: [
        {
          dir: 'dist',
          entryFileNames: 'index.cjs',
          format: 'cjs',
        },
        {
          dir: 'dist',
          entryFileNames: 'index.mjs',
          format: 'esm',
        },
      ],
    },
  },
});
