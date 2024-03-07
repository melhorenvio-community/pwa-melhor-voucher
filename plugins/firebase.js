
import { defineNuxtPlugin } from '#app';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initUser } from '../composables/useFirebaseHandleUser';
import { openDB } from 'idb';

export default defineNuxtPlugin(({ vueApp }) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig);
  const firestoreDb = getFirestore(app);

  initUser();

  return {
    firestoreDb,
    provide: {
      app,
      firestoreDb,
    }
  }
});


