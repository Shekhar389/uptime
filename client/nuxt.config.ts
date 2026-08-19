// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || process.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
    },
  },
  nitro: {
    devProxy: {
      '/api/v1': {
        target: 'http://localhost:3001/api/v1',
        changeOrigin: true,
      },
    },
  },
  devtools: { enabled: false },
  compatibilityDate: '2024-11-01',
});
