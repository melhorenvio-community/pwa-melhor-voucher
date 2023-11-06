import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getIndexedDB } = useUserStore();

  const auth = getAuth();
  await getIndexedDB();

  onAuthStateChanged(auth, (user) => {    
    if (!user) navigateTo('/login');
  });
});