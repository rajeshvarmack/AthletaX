import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  css: {
    transformer: 'postcss',
  },
  plugins: [tailwindcss()],
});
