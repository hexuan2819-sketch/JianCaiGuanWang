// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://hexuan2819-sketch.github.io',
  base: '/JianCaiGuanWang',
  vite: {
    plugins: [tailwindcss()]
  }
});
