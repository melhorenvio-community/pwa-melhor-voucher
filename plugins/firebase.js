
import { initializeApp } from 'firebase/app';
import { initUser } from '../composables/useFirebaseHandleUser'

export default defineNuxtPlugin(({ vueApp }) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
  };

  const app = initializeApp(firebaseConfig);

  initUser();
});
