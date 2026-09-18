import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.CI === 'true';

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPages ? '/VibeCodingSpace/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-state': ['zustand', 'clsx', 'tailwind-merge'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
