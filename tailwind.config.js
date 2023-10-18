const { config } = require('@melhorenvio/unbox/theme.config')();

module.exports = {
  presets: [config],
  content: [
    './app.vue',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './node_modules/@melhorenvio/unbox/**/*.{js,mjs,pcss}',
  ],
};