import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { validationIndexedDB } = useUserStore();

  const auth = getAuth();
  await validationIndexedDB();

  onAuthStateChanged(auth, (user) => {    
    if (!user) navigateTo('/login');
  });
});