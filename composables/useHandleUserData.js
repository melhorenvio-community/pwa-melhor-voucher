import { useUserStore } from '~/stores/user';
const { addDataToFirestore, updateIndexedDBUser, updateFirestoreUserData, getDataFromFirestore } = useUserStore();
const { isOnline } = useNetwork();

async function syncUserData() {
  try {
    const firestoreData = await getDataFromFirestore();
    const indexedDBData = await getIndexedDBUser();

    if (!firestoreData || !indexedDBData) {
      console.log("Erro ao obter dados do Firestore ou IndexedDB.");
      return;
    }

    await syncFirestoreToIndexedDB(firestoreData, indexedDBData);
    await syncIndexedDBToFirestore(firestoreData, indexedDBData);
  } catch (error) {
    console.error("Erro ao sincronizar dados:", error);
  }
}

async function syncFirestoreToIndexedDB(firestoreData, indexedDBData) {
  const firestoreMilliseconds = firestoreData[0].date.seconds * 1000 + firestoreData[0].date.nanoseconds / 1000000;
  if (firestoreMilliseconds > indexedDBData.date) {
    await updateIndexedDBUser(firestoreData[0].id, firestoreData[0]);
    $state.user = firestoreData[0];
    console.log("Dados do Firestore atualizados no IndexedDB.");
  }

   await updateFieldsIfNeeded(firestoreData[0], indexedDBData);
}

async function syncIndexedDBToFirestore(firestoreData, indexedDBData) {
  const firestoreMilliseconds = firestoreData[0].date.seconds * 1000 + firestoreData[0].date.nanoseconds / 1000000;
  if (firestoreMilliseconds < indexedDBData.date) {
    await updateFirestoreUserData(indexedDBData.id, indexedDBData);
    $state.user = indexedDBData;
    console.log("Dados do IndexedDB atualizados no Firestore.");
  }

   await updateFieldsIfNeeded(indexedDBData, firestoreData[0]);
}

function compareFields(value1, value2) {
  return value1 !== value2;
}
async function updateFieldsIfNeeded(data1, data2) {
   const fieldsToCheck = ['name', 'email', 'tags'];
  for (const field of fieldsToCheck) {
    if (compareFields(data1[field], data2[field])) {
      await updateIndexedDBUser(data1.id, data1);
    }
  }
}

async function getDataUser() {
  if (isOnline.value) {
    console.log('Dados recuperados do firestore com sucesso!');
    return await getDataFromFirestore()
      .catch(async (error) => {
        if (error.code === 'unavailable') {
          console.log('Firestore temporariamente indisponível. Recuperando dados locais.');
          return await getIndexedDBUser();
        } else {
          console.error('Erro ao recuperar dados do Firestore. Recuperando dados locais.', error);
          return await getIndexedDBUser();
        }
      });
  } else {
    console.log('Usuário offline. Recuperando dados locais.');
    return getIndexedDBUser();
  }
}

async function fetchData() {
  const user = ref();
  try {
    loading.value = true;
    user.value = await getDataUser();
    $state.user = user.value[0];
    return user.value;
  } catch (error) {
    console.error('Erro ao recuperar dados:', error);
  } finally {
    loading.value = false;
  }
}