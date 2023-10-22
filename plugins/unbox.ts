// plugins/unbox.js
import { defineNuxtPlugin } from '#app';
import Unbox from '@melhorenvio/unbox';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(Unbox);
});