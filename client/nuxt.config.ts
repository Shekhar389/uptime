// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  devtools: { enabled: false },
  compatibilityDate: '2024-11-01',
});
