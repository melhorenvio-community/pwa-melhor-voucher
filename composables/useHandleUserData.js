import { useUserStore } from '~/stores/user';

const { isOnline } = useNetwork();

export async function syncUserData() {
  try {
    const {  updateFirestoreUserData, updateIndexedDBUser, getDataFromFirestore, getIndexedDBUser } = useUserStore();
    const firestoreData = await getDataFromFirestore();
    const indexedDBData = await getIndexedDBUser();

    if (!firestoreData || !indexedDBData) {
      console.log("Erro ao obter dados do Firestore ou IndexedDB.");
      return;
    }

    const indexedDBUpdatedAt = new Date(indexedDBData.updateAt);
    const firestoreUpdatedAt = new Date(firestoreData.updateAt);

    if (indexedDBUpdatedAt > firestoreUpdatedAt) {
      console.log("Dados do IndexedDB são mais recentes. Atualizando o Firestore.");
      await updateFirestoreUserData(indexedDBData.id, indexedDBData);
    } else if (firestoreUpdatedAt > indexedDBUpdatedAt) {
      // Dados do Firestore são mais recentes
      console.log("Dados do Firestore são mais recentes. Atualizando o IndexedDB.");
      await updateIndexedDBUser(firestoreData[0].id, firestoreData[0]);
    } else {
      // Ambos os dados estão atualizados
      console.log("Os dados do IndexedDB e do Firestore estão atualizados.");
    }

    // compareUserData();
  } catch (error) {
    console.error("Erro ao sincronizar dados:", error);
  }
}

export async function compareUserData() {
   const {  updateFirestoreUserData, updateIndexedDBUser, getDataFromFirestore, getIndexedDBUser } = useUserStore();
  const firestoreUser = await getDataFromFirestore();
  const firestoreUserData = firestoreUser[0]
  const indexedDBUserData = await getIndexedDBUser();

  const indexedDBInFirestore = Object.keys(indexedDBUserData).every(key => {
    return firestoreUserData.hasOwnProperty(key) && firestoreUserData[key] === indexedDBUserData[key];
  });

  if (!indexedDBInFirestore) {
    await updateIndexedDBUser(firestoreUserData.id, firestoreUserData);
  }

  const firestoreInIndexedDB = Object.keys(firestoreUserData).every(key => {
    return indexedDBUserData.hasOwnProperty(key) && indexedDBUserData[key] === firestoreUserData[key];
  });


  if (!firestoreInIndexedDB) {
    await updateFirestoreUserData(indexedDBUserData.id, indexedDBUserData);
  }
}

export async function getDataUser() {
  const { getDataFromFirestore, getIndexedDBUser } = useUserStore();
  if (isOnline.value) {
    try {
      const user = await getDataFromFirestore();
      console.log('Buscando dados remotos...');
      if (user) return user[0];
    } catch (error) {
      if (error.code === 'unavailable') {
        console.log('Firestore temporariamente indisponível. Recuperando dados locais.');
        return await getIndexedDBUser();
      } else {
        console.error('Erro ao recuperar dados do Firestore. Recuperando dados locais.', error);
        return await getIndexedDBUser();
      }
    }
  } else {
    console.log('Usuário offline. Recuperando dados locais.');
    return await getIndexedDBUser();
  }
}

export async function fetchData() {
  const {  $state } = useUserStore();
  const user = ref();
  user.value = await getDataUser();
  try {
    user.value = await getDataUser();
    $state.user = user.value;
    return user.value;
  } catch (error) {
    console.error('Erro ao recuperar dados:', error);
  }
}