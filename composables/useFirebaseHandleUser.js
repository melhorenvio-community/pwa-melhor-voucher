//https://firebase.google.com/docs/auth/web/start?hl=pt-br

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from '~/stores/user';

export const createUser = async (email, password) => {
  const auth = getAuth();

  const credetials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
  });

  return credetials;
}

export const signUser = async (email, password) => {
  const auth = getAuth();
  const credetials = signInWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((error) => {
    if (error instanceof Error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error Code:", errorCode);
      console.error("Error Message:", errorMessage);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  });

  const { addIndexedDB } = useUserStore();
  addIndexedDB(credetials);

  return credetials;
}

export const initUser = () => {
  const auth = getAuth();
  const firebaseUser = useFirebaseUser();
  firebaseUser.value = auth.currentUser;

  onAuthStateChanged(auth, (user) => {
    firebaseUser.value = user;
  });
}

export const signOutUser = async () => {
  const { deleteIndexedDB } = useUserStore();
  deleteIndexedDB();
  
  const auth = getAuth();
  const result = await auth.signOut();
}

