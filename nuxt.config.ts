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
      runtimeCaching: [
        {
          urlPattern: ({ url }) => {
            return url.pathname.startsWith('/')
          },
          handler: "CacheFirst" as const,
          options: {
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [0, 200]
            }

          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type:'module'
    },
    manifest: {
      scope: '/',
      name: 'Melhor Voucher',
      short_name: 'MelhorVoucher',
      start_url:'/',
      description: 'Acompanhe sua pontuação na Melhor Envio',
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
      ],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone'
    }
  },
  css: ['@/assets/pcss/index.pcss'],
  postcss: {
    plugins: {
      'postcss-import': {
      path: ['./node_modules'],
    },
    'tailwindcss/nesting': {},
    'tailwindcss': {},
    'autoprefixer': {},
    },
  },
  ssr: false,
})
