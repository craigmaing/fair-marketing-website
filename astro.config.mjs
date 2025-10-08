// @ts-check
import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://fairmarketing.com',
  integrations: [partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  })],
  vite: {
    plugins: [tailwindcss()]
  }
});