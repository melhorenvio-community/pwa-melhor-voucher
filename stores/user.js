import { defineStore } from 'pinia';
import { useVibrate, useStorage } from '@vueuse/core';

const { vibrate, stop } = useVibrate({ pattern: [300, 100, 300] });

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    tags: useStorage('tags', [])
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

    updateIndexedDBTag(tags) {
      const dbName = 'db-local-tags';
      const storeName = 'me-tags';
      const idToUpdate = 1;
      const newValue = tags;

      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      };

      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        const getRequest = objectStore.get(idToUpdate);

        getRequest.onsuccess = function(event) {
          const existingItem = getRequest.result;

          if (existingItem) {
            existingItem.valor = newValue;

            const updateRequest = objectStore.put(existingItem);

            updateRequest.onsuccess = function() {
              console.log(`Valor do item com chave ${idToUpdate} atualizado com sucesso!`);
              resolve(`Valor do item com chave ${idToUpdate} atualizado com sucesso!`);
            };

            updateRequest.onerror = function() {
              console.error(`Erro ao atualizar o valor do item com chave ${idToUpdate}`);
              reject(`Erro ao atualizar o valor do item com chave ${idToUpdate}`);
            };
          } else {
            console.error(`Item com chave ${idToUpdate} não encontrado`);
            reject(`Item com chave ${idToUpdate} não encontrado`);
          }
        };

        getRequest.onerror = function() {
          console.error(`Erro ao buscar o item com chave ${idToUpdate}`);
          reject(`Erro ao buscar o item com chave ${idToUpdate}`);
        };

        transaction.oncomplete = function() {
          console.log('Transação concluída');
        };

        transaction.onerror = function(event) {
          console.error('Erro na transação:', event.target.error);
        };
      };

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