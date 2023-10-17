// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@vite-pwa/nuxt"],
  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    injectManifest: {
      globPatterns: ['**/*.{js,css,html}']
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    },
    devOptions: {
      enabled: true
    },
    manifest: {
      name: 'Melhor Voucher',
      short_name: 'MelhorVoucher',
      description: 'Acompanhe sua pontuação na Melhor Envio',
      theme_color: '#ffffff',
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }
})
