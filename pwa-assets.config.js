import { defineConfig, minimalPreset as preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset,
  images: [
    '/logo.svg',
    '/homeIllust.svg',
    '/logo-melhor-voucher.svg'
  ],
  transparent: {
    sizes: [64, 192, 512],
    favicons: [[48, 'favicon.ico']]
  },
  maskable: {
    sizes: [512]
  },
  apple: {
    sizes: [180]
  }
})