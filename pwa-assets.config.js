import { defineConfig, minimalPreset as preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset,
  images: [
    'icons/logo.svg',
    '~/public/icons/homeIllust.svg',
    'icons/logo-melhor-voucher.svg'
  ],
  maskable: {
    sizes: [512]
  },
  apple: {
    sizes: [180]
  }
})