import { defineStore } from 'pinia';
import { useVibrate, useStorage, useNetwork } from '@vueuse/core';
const { isOnline, offlineAt, downlink, downlinkMax, effectiveType, saveData, type } = useNetwork()

const { vibrate, stop } = useVibrate({ pattern: [300, 100, 300] });

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    tags: useStorage('tags', []),
    status: isOnline.value
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
  
        request.onsuccess = (event) => {
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
        };
      } catch (error) {
        console.error("Error: " + error);

        vibrate();

        setTimeout(() => {
          stop();
        }, 2000);
      }
    },

    updateIndexedDBTag() {
      const dbName = 'db-local-user';
      const storeName = 'me-user';
      const version = 1;
      const idToUpdate = 1;
      const newValue = this.tags;

      const request = indexedDB.open(dbName, version);

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const getRequest = objectStore.get(idToUpdate);
      
        getRequest.onsuccess = () => {
          const record = getRequest.result;

          const filterTags = newValue.filter((newValue) => {
            return !record.tags.includes(newValue);
          });
        
          record.tags.push(...filterTags);
        
          const updateRequest = objectStore.put(record);
      
          updateRequest.onerror = () => {
            console.error('Erro ao atualizar o registro:', updateRequest.error);
          };
        };
      }
    },

    async getIndexedDBUser() {
      const request = indexedDB.open('db-local-user');

      request.onsuccess = (event) => {
        const db = event.target.result;

        try {
          const transaction = db.transaction(['me-user'], 'readonly');
          const objectStore = transaction.objectStore('me-user');
          const cursorRequest = objectStore.openCursor();

          cursorRequest.onsuccess = (event) => {
            const result = event.target.result;
          
            if (result) {
              const { name, email, tags } = result.value;

              this.user = {
                name: name || 'Antônio Agusto',
                email,
                tags
              }
            }
          }
        } catch(e) {
          navigateTo('/login');
          this.clearAll();
        }
      }; 
    },

    async validationIndexedDB() {
      return !localStorage.getItem('user') ? this.getIndexedDBUser() : this.getStorageUser();
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