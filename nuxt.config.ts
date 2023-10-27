// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    }
  },
  devtools: { enabled: true },
  modules: ["@vite-pwa/nuxt", '@vueuse/nuxt',],
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
          src: "icons/android-chrome-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          src: "icons/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          src: "icons/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
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
