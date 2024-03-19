import { defineStore } from 'pinia';
import { useVibrate, useStorage } from '@vueuse/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { vibrate, stop } = useVibrate({ pattern: [300, 100, 300] });
const currentDate = new Date();
const formattedDate = currentDate.toISOString();

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    tags: useStorage('tags', []),
  }),

  actions: {
    async addIndexedDBUser(userPromise) {
      try {
        const { user } = await userPromise;

        const dbName = 'db-local-user';
        const dbVersion = 1;

        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          if (!db.objectStoreNames.contains('me-user')) {
           db.createObjectStore('me-user', { keyPath: 'id', autoIncrement: true });
          }
        };

        this.setStorageUser(userPromise)
          let email = user.email;
          let partes = email.split('@');
          let userName = partes[0];


          let localStorageTags = this.getStorageTags()

          const newUser = {
            id: user.uid,
            name: userName.replace('.', ' ') || 'Antônio Agusto',
            date: Date.now(),
            email,
            tags: localStorageTags,
            updateAt: formattedDate
          };

        request.onsuccess = async (event) => {
          const db = event.target.result;

          const transaction = db.transaction(['me-user'], 'readwrite');
          const objectStore = transaction.objectStore('me-user');


          objectStore.add(newUser);
        };
        // await this.addDataToFirestore(newUser.id, newUser);
      } catch (error) {
        console.error("Error: " + error);

        vibrate();

        setTimeout(() => {
          stop();
        }, 2000);
      }
    },

    updateIndexedDBTag(userId) {
      const dbName = 'db-local-user';
      const storeName = 'me-user';
      const version = 1;
      const newTags = this.tags;
      const request = indexedDB.open(dbName, version);

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const getRequest = objectStore.get(userId);

        getRequest.onsuccess = async () => {
          const record = getRequest.result;

          const filterTags = newTags.filter((newTags) => {
            return !record.tags.includes(newTags);
          });

          record.tags.push(...filterTags);
          record.updateAt = formattedDate;

          const updateRequest = objectStore.put(record);
          await this.updateTagsInFireStore(userId, record.tags);


          updateRequest.onerror = () => {
            console.error('Erro ao atualizar o registro:', updateRequest.error);
          };
        };
      }
    },

    async updateIndexedDBUser(userId, updatedUserData) {
      updatedUserData.updateAt = formattedDate;

      return new Promise((resolve, reject) => {
        // Abrir uma conexão com o banco de dados
        const request = indexedDB.open("db-local-user");


        request.onerror = (event) => {
          console.error("IndexedDB error:", request.error);
          reject("Não foi possível abrir a base de dados IndexedDB.");
        };

        request.onupgradeneeded = (event) => {
          // Caso seja necessário atualizar a base de dados
          const db = event.target.result;
          if (!db.objectStoreNames.contains("users")) {
            db.createObjectStore("users", { keyPath: "id" });
          }
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("me-user", "readwrite");
          const store = transaction.objectStore("me-user");

          // Atualizar os dados do usuário
          const updateRequest = store.put({ ...updatedUserData, id: userId });

          updateRequest.onsuccess = () => {
            resolve("Dados locais do usuário atualizados com sucesso.");
          };

          updateRequest.onerror = () => {
            console.error("Erro ao atualizar dados locais do usuário:", updateRequest.error);
            reject("Erro ao atualizar dados locais do usuário.");
          };

          // Fechar a conexão quando a transação for completada
          transaction.oncomplete = () => {
            db.close();
          };
        };
      });
    },

    async getIndexedDBUser() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('db-local-user');

        request.onerror = (event) => {
          console.error("Erro ao abrir o banco de dados:", event.target.error);
          reject("Não foi possível abrir o banco de dados.");
        };

        request.onsuccess = (event) => {
          const db = event.target.result;

          const transaction = db.transaction(['me-user'], 'readonly');
          const objectStore = transaction.objectStore('me-user');
          const cursorRequest = objectStore.openCursor();

          cursorRequest.onsuccess = (event) => {
            const result = event.target.result;

            if (result) {
              const { id, name, email, tags, date } = result.value;
              resolve({ id, name, email, tags, date }); // Resolvendo a Promise com os dados do usuário
            } else {
              reject("Nenhum usuário encontrado.");
            }
          };

          cursorRequest.onerror = (event) => {
            console.error("Erro ao acessar os dados do cursor:", event.target.error);
            db.close();
            reject("Erro ao ler os dados do usuário.");
          };
        };
      });
    },

    async deleteIndexedDBUser() {
      const db = 'db-local-user'
      indexedDB.deleteDatabase(db);
    },

    async setStorageUser(result) {
      try {
        const { user } = await result
        const { email } = user;

        let partes = email.split('@');
        let userName = partes[0];

        this.user = {
          name: userName.replace('.', ' ') || 'Antônio Agusto',
          email,
        }

        localStorage.setItem('user', JSON.stringify(this.user));
        } catch (error) {
        console.error("Um erro ocorreu:", error);
      }
    },

    async getStorageUser() {
      const userLocal = await localStorage?.getItem('user');

      try {
        const { name, email } = JSON.parse(userLocal);

        this.user = {
          name: name || 'Antônio Agusto',
          email,
        }

        const user = {
          name: name || 'Antônio Agusto',
          email,
        }

        return user;
      } catch (error) {
        console.error("Erro a buscar usuario", error);
      }
    },

    getStorageTags() {
      const userLocal = localStorage?.getItem('tags');
      const tags = JSON.parse(userLocal);

      return tags;
    },

    async deleteStorageUser() {
      localStorage.removeItem("user");
    },

    async deleteStorageTag() {
      this.tags = []
    },

    async addDataToFirestore(userPromise) {
      const { user } = await userPromise;

      let email = user.email;
      let partes = email.split('@');
      let userName = partes[0];

      let localStorageTags = this.getStorageTags();

      const userDetails = {
        id: user.uid,
        name: userName.replace('.', ' ') || 'Antônio Agusto',
        date: Date.now(),
        email,
        tags: localStorageTags,
        updateAt: ''
      };

      try {
        const config = useRuntimeConfig()
        const firebaseConfig = {
          apiKey: config.public.FIREBASE_API_KEY,
          authDomain: config.public.FIREBASE_AUTH_DOMAIN,
          projectId: config.public.FIREBASE_PROJECT_ID,
          storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: config.public.FIREBASE_SENDER_ID,
          appId: config.public.FIREBASE_APP_ID
        };
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);

        const myCustomId = user.uid; // Esse é o ID que você quer usar
        const docRef = doc(firestoreDb, "users", myCustomId); // Especifica o ID do documento
        const docData = userDetails;

        await setDoc(docRef, docData);
        console.log("Documento salvo com ID personalizado!");
      } catch (error) {
        console.error("Erro ao salvar o documento:", error);
      }
    },

    async updateTagsInFireStore(userId, newTags) {
      try {
        const firestore = getFirestore(); // Obtém a instância do Firestore
        const userRef = doc(firestore, 'users', userId); // Referência ao documento do usuário

        // Atualiza as tags do usuário
        await updateDoc(userRef, {
          tags: newTags,
          updateAt: formattedDate// Define as novas tags
        });

        console.log('Tags atualizadas no firestore com sucesso para o usuário:', userId);
        return true; // Retorna verdadeiro para indicar sucesso
      } catch (error) {
        console.error('Erro ao atualizar as tags no firestore do usuário:', error);
        return false; // Retorna falso para indicar falha
      }
    },

    async updateFirestoreUserData(userId, userData) {
      const config = useRuntimeConfig()
        const firebaseConfig = {
          apiKey: config.public.FIREBASE_API_KEY,
          authDomain: config.public.FIREBASE_AUTH_DOMAIN,
          projectId: config.public.FIREBASE_PROJECT_ID,
          storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: config.public.FIREBASE_SENDER_ID,
          appId: config.public.FIREBASE_APP_ID
        };
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
      try {
        const userRef = doc(firestoreDb, 'users', userId);

        await setDoc(userRef, {
          name: userData.name,
          email: userData.email,
          tags: userData.tags,
          updateAt: formattedDate
        }, { merge: true });

        console.log('Dados do usuário atualizados no Firestore com sucesso.');
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário no Firestore:', error);
      }
    },

    async getDataFromFirestore() {
      const config = useRuntimeConfig();
      const firebaseConfig = {
        apiKey: config.public.FIREBASE_API_KEY,
        authDomain: config.public.FIREBASE_AUTH_DOMAIN,
        projectId: config.public.FIREBASE_PROJECT_ID,
        storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: config.public.FIREBASE_SENDER_ID,
        appId: config.public.FIREBASE_APP_ID
      };

      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'users'));
        const userData = [];

        querySnapshot.forEach((doc) => {
          if (doc.id === user?.uid) {
            userData.push({ id: doc.id, ...doc.data() });
          }
        });

        return userData;
      } catch (error) {
        console.error('Erro ao buscar dados do Firestore:', error);
      }
    },

    async clearAll() {
      this.deleteStorageUser();
      this.deleteStorageTag();
      this.deleteIndexedDBUser();
    },
  },
});