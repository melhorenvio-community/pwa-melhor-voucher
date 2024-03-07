import { defineStore } from 'pinia';
import { useVibrate, useStorage } from '@vueuse/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const { vibrate, stop } = useVibrate({ pattern: [300, 100, 300] });

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
  
        request.onsuccess = async (event) => {
          const db = event.target.result;
  
          const transaction = db.transaction(['me-user'], 'readwrite');
          const objectStore = transaction.objectStore('me-user');
  
          let email = user.email;
          let partes = email.split('@');
          let userName = partes[0];
          
          let localStorageTags = this.getStorageTags()
       
          const newUser = {
            name: userName.replace('.', ' ') || 'Antônio Agusto',
            date: new Date(),
            email,
            tags: localStorageTags
          };

          objectStore.add(newUser);
          await this.addDataToFirestore(newUser);
        };
      } catch (error) {
        console.error("Error: " + error);

        vibrate();

        setTimeout(() => {
          stop();
        }, 2000);
      }
    },

    async updateIndexedDBTag(userId, newTags) {
      const dbName = 'db-local-user';
      const storeName = 'me-user';
      const version = 1;

      const request = indexedDB.open(dbName, version);

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const getRequest = objectStore.get(userId);

        getRequest.onsuccess = async () => {
          const record = getRequest.result;

          // Verifica se o registro foi encontrado
          if (record) {
            // Atualiza as tags do usuário
            const newTagsSet = new Set([...record.tags, ...newTags]); // Evita tags duplicadas
            record.tags = Array.from(newTagsSet);

            // Atualiza o registro no IndexedDB
            const updateRequest = objectStore.put(record);

            await thai.updateTagsInFireStore(userId, newTagsSet);

            updateRequest.onerror = () => {
              console.error('Erro ao atualizar o registro:', updateRequest.error);
            };


          } else {
            console.error('Usuário não encontrado no IndexedDB.');
          }
        };
      };
    },

    async addDataToFirestore(newUser) {
      console.log('new user save firestore', newUser)
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
        const success = await addDoc(collection(firestoreDb, 'data-user'), {
          user: newUser
        });
        if (success) {
          console.log('Usuário salvo no Firestore com sucesso!');
          return true;
        } else {
          console.error('Erro ao salvar usuário no Firestore');
          return false;
        }
      } catch (error) {
        console.error('Erro ao salvar usuário no Firestore:', error);
        return false;
      }
    },

    async updateTagsInFireStore(userId, newTags) {
      try {
        const firestore = getFirestore(); // Obtém a instância do Firestore
        const userRef = doc(firestore, 'users', userId); // Referência ao documento do usuário

        // Atualiza as tags do usuário
        await updateDoc(userRef, {
          tags: newTags // Define as novas tags
        });

        console.log('Tags atualizadas com sucesso para o usuário:', userId);
        return true; // Retorna verdadeiro para indicar sucesso
      } catch (error) {
        console.error('Erro ao atualizar as tags do usuário:', error);
        return false; // Retorna falso para indicar falha
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

      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'data-user'));
        const userData = [];

        querySnapshot.forEach((doc) => {
          // Para cada documento na coleção, adicione os dados ao array userData
          userData.push({ id: doc.id, ...doc.data() });
        });

        return userData; // Retorne os dados recuperados do Firestore
      } catch (error) {
        console.error('Erro ao buscar dados do Firestore:', error);
        throw error; // Se houver um erro, lance-o para que possa ser tratado no componente Vue
      }
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
              const { name, email, tags } = result.value;
              resolve({ name, email, tags }); // Resolvendo a Promise com os dados do usuário
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

    async validationIndexedDB() {
      try {
        const user = await this.getIndexedDBUser(); // Obtemos os dados do usuário
        return user;

        // Agora podemos salvar os dados do usuário no Firestore
        // await this.addDataToFirestore(user);
        // console.log('Usuário salvo no Firestore com sucesso.');
      } catch (error) {
        console.error(error);
        navigateTo('/login');
        this.clearAll();
      }
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

    async clearAll() {
      this.deleteStorageUser();
      this.deleteStorageTag();
      this.deleteIndexedDBUser();
    },
  },
});