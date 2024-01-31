import { defineConfig, minimalPreset as preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset,
  images: [
    'public/icons/logo.svg',
    'public/icons/homeIllust.svg',
    'public/icons/logo-melhor-voucher.svg'
  ],
  maskable: {
    sizes: [512]
  },
  apple: {
    sizes: [180]
  }
})