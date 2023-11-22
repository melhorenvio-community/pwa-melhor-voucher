import { defineStore } from 'pinia';
import { useVibrate, useStorage } from '@vueuse/core';

const { vibrate, stop } = useVibrate({ pattern: [300, 100, 300] });

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    tags: useStorage('tag', [])
  }),

  actions: {
    async addIndexedDBUser(userPromise) {
      try {
        const { user } = await userPromise;

        const dbName = 'db-local-user';
        const dbVersion = 1;
  
        const request = indexedDB.open(dbName, dbVersion);
  
        request.onupgradeneeded = function(event) {
          const db = event.target.result;
  
          if (!db.objectStoreNames.contains('me-user')) {
           db.createObjectStore('me-user', { keyPath: 'id', autoIncrement: true });
          }
        };
  
        request.onsuccess = (event) => {
          const db = event.target.result;
  
          const transaction = db.transaction(['me-user'], 'readwrite');
          const objectStore = transaction.objectStore('me-user');
  
          let email = user.email;
          let partes = email.split('@');
          let userName = partes[0];

          const newUser = {
            name: userName.replace('.', ' ') || 'Antônio Agusto',
            date: new Date(),
            email
          };

          this.addIndexedDBTag();
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

    async addIndexedDBTag() {
      const tag = this.getTagsStorage();
      
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('db-local-tags', 1);

        request.onupgradeneeded = function(event) {
          const db = event.target.result;
          db.createObjectStore('me-tags', { keyPath: 'id', autoIncrement: true });
        };

        request.onsuccess = function(event) {
          const db = event.target.result;
          const transaction = db.transaction(['me-tags'], 'readwrite');
          const objectStore = transaction.objectStore('me-tags');

          tag.forEach(item => {
            objectStore.add({ valor: item });
          });

          transaction.oncomplete = function() {
            resolve('Dados adicionados com sucesso!');
          };
        };
      });
    },

    async getIndexedDB() {
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
              const { name, email } = result.value;
  
              this.user = {
                name: name || 'Antônio Agusto',
                email,
              }

            } else {
              this.deleteIndexedDB();
              navigateTo('/login');
            }
          };
        } catch(e) {
          this.deleteIndexedDB();
          navigateTo('/login');

          console.error("Erro ao buscar o banco:", error);
        }
      }; 
    },

    async validationIndexedDB() {
      return !localStorage.getItem('user') ? this.getIndexedDB() : this.getUserStorage();
    },

    async deleteIndexedDB() {
      const db = 'db-local-user'
      indexedDB.deleteDatabase(db);

      this.deleteUserStorage();
      vibrate();

      setTimeout(() => {
        stop();
      }, 2000);
    },

    async setUserStorage(result) {
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

    async getUserStorage() {
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

    getTagsStorage() {
      const userLocal = localStorage?.getItem('tag');
      const tags = JSON.parse(userLocal)

      return tags;
    },

    async deleteUserStorage() {
      localStorage.removeItem("user");

      vibrate();

      setTimeout(() => {
        stop();
      }, 2000);
    },
  },
});