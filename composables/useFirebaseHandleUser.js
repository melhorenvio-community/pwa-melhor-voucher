//https://firebase.google.com/docs/auth/web/start?hl=pt-br

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

/**
 * Creates a new user with the specified email and password.
 * @param {string} email - The email of the user to be created.
 * @param {string} password - The password of the user to be created.
 * @returns {Promise} A promise that resolves with the credentials of the newly created user.
 * @throws {Error} If an error occurs during user creation.
 */
export const createUser = async (email, password) => {
  try {
    const auth = getAuth();
    const credentials = await createUserWithEmailAndPassword(auth, email, password);

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

    return credentials
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === 'auth/invalid-login-credentials') {
      notify({
        title: 'E-mail ou senha incorretos',
        message: 'Verifique suas credenciais e tente novamente',
        variant: 'danger',
      });

      return;

    }
    console.error("Error Code:", errorCode);
    console.error("Error Message:", errorMessage);
    notify({
      title: 'Ocorreu um erro',
      message: 'tente novamente mais tarde',
      variant: 'danger',
    });

  }
}

export const signOutUser = async () => {
  const auth = getAuth();
  const result = await auth.signOut();
  return result
}

