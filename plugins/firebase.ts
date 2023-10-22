
import { initializeApp } from 'firebase/app';

export default defineNuxtPlugin(({ vueApp }) => {
  const config = useRuntimeConfig()
  console.log('config', config)
  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
  };

  const app = initializeApp(firebaseConfig);

  console.log(app)
});


