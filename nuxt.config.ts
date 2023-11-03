const isPWADevMode = process.env.VITE_PWA_DEV_MODE === 'true';

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    }
  },
  devtools: { enabled: true },
  modules: ["@vite-pwa/nuxt", '@vueuse/nuxt', ['unplugin-icons/nuxt', {
    scale: 1,
    compiler: 'vue3',
    autoInstall: true,
  }]],
  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    strategies: 'generateSW',
    workbox: {
      runtimeCaching: [{
        urlPattern: ({ url }) => {
          return url.pathname.startsWith('/');
        },
        handler: "NetworkFirst" as const,
        options: {
          cacheName: 'cache-melhor-voucher',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }]

    },
    devOptions: {
      enabled: isPWADevMode,
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
      description: 'Acompanhe sua pontuação na Melhor Envio',
      screenshots: [
        {
          src: "icons/home-screen.png",
          sizes: "1476x658",
          type: "image/svg",
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
