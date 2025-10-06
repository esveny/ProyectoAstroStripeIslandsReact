import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless'; // 👈 importante

export default defineConfig({
  output: 'server', // 👈 cambia de 'static' a 'server'
  adapter: vercel(), // 👈 usa el adaptador instalado
  site: 'http://localhost:4321', // tu dominio local o en producción
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
