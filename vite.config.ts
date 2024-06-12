import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), libInjectCss(), dts({ include: ['lib'], exclude: ['lib/__tests__'] })],
    define: {
      'process.env': env,
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'lib/index.ts'),
        formats: ['cjs', 'es', 'umd'],
        fileName: 'index',
        name: 'index',
      },
      copyPublicDir: false,
      rollupOptions: {
        external: ['react', 'react/jsx-runtime'],
      },
    },
  };
});
