import { defineConfig, minimalPreset as preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset,
  images: [
    'public/logo.svg',
    'public/homeIllust.svg',
    'public/logo-melhor-voucher.svg'
  ],
  maskable: {
    sizes: [512]
  },
  apple: {
    sizes: [180]
  }
})