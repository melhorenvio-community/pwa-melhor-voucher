//https://firebase.google.com/docs/auth/web/start?hl=pt-br

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export const createUser = async (email, password) => {
  const auth = getAuth();
  const credetials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
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
      const errorCode = error.code;
      const errorMessage = error.message;
  });
  return credetials;
}

export const initUser = () => {
  const auth = getAuth();
  const firebaseUser = useFirebaseUser();
  firebaseUser.value = auth.currentUser;

  onAuthStateChanged(auth, (user) => {
    if (user) console.log('auth change', user);
    else console.log('auth change else', user);

    firebaseUser.value = user;
  });
}

export const signOutUser = async () => {
  const auth = getAuth();
  const result = await auth.signOut();
}

