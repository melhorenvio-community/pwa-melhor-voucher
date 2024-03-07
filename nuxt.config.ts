export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { dir: 'ltr', lang: 'pt' },
      link: [{ rel: 'icon', type: 'image/svg', href: "/icons/logo.svg" }],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_SENDER_ID: process.env.FIREBASE_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    }
  },
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt', '@vueuse/nuxt', '@pinia/nuxt', ['unplugin-icons/nuxt', {
    scale: 1,
    compiler: 'vue3',
    autoInstall: true,
  }]],
  pwa: {
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg}'],
      runtimeCaching: [
        {
          urlPattern: ({ url }) => {
            return url.pathname.startsWith('/');
          },
          handler: "CacheFirst" as const,
          options: {
            cacheName: 'pwa-melhor-full',
            cacheableResponse: {
              statuses: [0, 200]
            },
          }
        },
      ],
    },
    devOptions: {
      enabled: true,
      type:'module'
    },
    client: {
      installPrompt: true
    },
    manifest: {
      scope: '/',
      name: 'Melhor Voucher',
      short_name: 'MelhorVoucher',
      start_url:'/',
      lang: 'pt-br',
      description: 'Acompanhe sua pontuação na Melhor Envio',
      screenshots: [
        {
          src: "icons/home-screen.png",
          sizes: "1476x658",
          type: "image/png",
          form_factor: "wide",
          label: "Melhor Voucher"
        }
      ],
      icons: [
        {
          src: 'icons/pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
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
          purpose: 'any'
        },
        {
          src: 'icons/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: 'icons/apple-touch-icon-180x180.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
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