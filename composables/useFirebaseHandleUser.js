//https://firebase.google.com/docs/auth/web/start?hl=pt-br

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from '~/stores/user';

/**
 * Creates a new user with the specified email and password.
 * @param {string} email - The email of the user to be created.
 * @param {string} password - The password of the user to be created.
 * @returns {Promise} A promise that resolves with the credentials of the newly created user.
 * @throws {Error} If an error occurs during user creation.
 */
export const createUser = async (email, password) => {
  const { addIndexedDBUser } = useUserStore();
  try {
    const auth = getAuth();
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    addIndexedDBUser(credentials);

    return credentials;
  } catch (error) {
    throw error; // Lança a exceção para quem chamar a função capturar e lidar com o erro
  }
}

/**
 * Signs in a user with the specified email and password.
 * @param {string} email - The email of the user to sign in.
 * @param {string} password - The password of the user to sign in.
 * @returns {Promise} A promise that resolves with the credentials of the signed-in user.
 * @throws {Error} If an error occurs during the sign-in process.
 */
export const signUser = async (email, password) => {
  try {
    const auth = getAuth();
    const credentials = await signInWithEmailAndPassword(auth, email, password);

    const { addIndexedDBUser } = useUserStore();

    addIndexedDBUser(credentials);
    return credentials
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
  }
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
  const auth = getAuth();
  const result = await auth.signOut();
  return result
}

