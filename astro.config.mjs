// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://secureaiframeworks.cloud',
  output: 'static',
  trailingSlash: 'always',

  build: {
    // Inline the stylesheet so first paint never waits on a second request.
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline page scripts — external same-origin modules keep the
      // Content-Security-Policy (`script-src 'self'`) enforceable.
      assetsInlineLimit: 0,
    },
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
