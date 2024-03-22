import { useUserStore } from '~/stores/user';

const { isOnline } = useNetwork();

export async function syncUserData() {
  if (isOnline.value) {
    const {  updateFirestoreUserData, updateIndexedDBUser, getDataFromFirestore, getIndexedDBUser } = useUserStore();
    try {
      // Recupera os dados do Firestore e do IndexedDB
      const firestoreData = await getDataFromFirestore();
      const indexedDBData = await getIndexedDBUser();

      if (!firestoreData || !indexedDBData) {
        console.log("Erro ao obter dados do Firestore ou IndexedDB.");
        return;
      }

      // Compara as tags entre o Firestore e o IndexedDB
      const firestoreTags = firestoreData[0]?.tags || [];
      const indexedDBTags = indexedDBData?.tags || [];
      const newTagsFirestore = firestoreTags?.filter(tag => !indexedDBTags.includes(tag));
      const newTagsIndexedDB = indexedDBTags?.filter(tag => !firestoreTags?.includes(tag));

      if (firestoreData[0].updateAt > indexedDBData.updateAt) {
        console.log("Dados do IndexedDB são mais recentes. Atualizando o Firestore.");
        await updateFirestoreUserData(indexedDBData.id, indexedDBData);
      } else if (indexedDBData.updateAt > firestoreData[0].updateAt) {
        // Dados do Firestore são mais recentes
        console.log("Dados do Firestore são mais recentes. Atualizando o IndexedDB.");
        await updateIndexedDBUser(firestoreData[0].id, firestoreData[0]);
      }

      // Atualiza as tags no IndexedDB com as novas do Firestore
      if (newTagsFirestore?.length) {
        console.log('Atualiza as tags no IndexedDB com as novas do Firestore')
        indexedDBData.tags.push(...newTagsFirestore);
        await updateIndexedDBUser(indexedDBData.id, indexedDBData);
      }

      // Atualiza as tags no Firestore com as novas do IndexedDB
      if (newTagsIndexedDB?.length) {
        console.log('Atualiza as tags no Firestore com as novas do IndexedDB')
        firestoreData[0].tags.push(...newTagsIndexedDB);
        await updateFirestoreUserData(firestoreData[0].id, firestoreData[0]);
      }

      // Compara as datas de última atualização e realiza a sincronização conforme necessário
      // ...
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
    }
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