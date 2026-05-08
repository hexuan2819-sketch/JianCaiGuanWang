// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'ar', 'ru', 'tr', 'fa', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'th', 'vi', 'hi'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});