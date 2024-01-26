import { defineConfig, minimalPreset as preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset,
  images: [
    '/icons/logo.svg',
    '/icons/homeIllust.svg',
    '/icons/logo-melhor-voucher.svg'
  ],
  maskable: {
    sizes: [512]
  },
  apple: {
    sizes: [180]
  }
})