import { getAuth, onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (!user) navigateTo('/login');
  });
});