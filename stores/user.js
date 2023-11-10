import { defineStore } from 'pinia';
import { useVibrate } from '@vueuse/core';

const { vibrate, stop } = useVibrate({ pattern: [300, 100, 300] });

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    points: 50,
    shipments: 250,
  }),

  actions: {
    async addIndexedDB(userPromise) {
      try {
        const { user } = await userPromise;

        const dbName = 'db-local-voucher';
        const dbVersion = 1;
  
        const request = indexedDB.open(dbName, dbVersion);
  
        request.onupgradeneeded = function(event) {
          const db = event.target.result;
  
          if (!db.objectStoreNames.contains('me-voucher-user')) {
           db.createObjectStore('me-voucher-user', { keyPath: 'id', autoIncrement: true });
          }
        };
  
        request.onsuccess = function(event) {
          const db = event.target.result;
  
          const transaction = db.transaction(['me-voucher-user'], 'readwrite');
          const objectStore = transaction.objectStore('me-voucher-user');
  
          let email = user.email;
          let partes = email.split('@');
          let userName = partes[0];
  
          const newRecord = {
            name: userName.replace('.', ' '),
            date: new Date(),
            email,
            points: this.points,
            shipments: this.shipments
          };
  
          const addRequest = objectStore.add(newRecord);
  
          addRequest.onsuccess = function() {
            console.log('Registro adicionado com sucesso!');
          };
  
          addRequest.onerror = function() {
            console.error('Erro ao adicionar registro.');
          };
        };
      } catch (error) {
        console.error("Error: " + error);

        vibrate();

        setTimeout(() => {
          stop();
        }, 2000);
      }
    },
    
    async getIndexedDB() {
      const request = indexedDB.open('db-local-voucher');
      request.onsuccess = (event) => {
        const db = event.target.result;
       
        if(request) {
          const transaction = db.transaction(['me-voucher-user'], 'readonly');
          const objectStore = transaction.objectStore('me-voucher-user');
          const cursorRequest = objectStore.openCursor();
  
          cursorRequest.onsuccess = (event) => {
            const result = event.target.result;
  
            if (result) {
              const { name, email } = result.value;
  
              this.user = {
                name,
                email,
                points: this.points,
                shipments: this.shipments
              }
              
              this.setUserStorage();
            } else {
              console.log('Erro ao pegar os dados.');
  
              vibrate();
  
              setTimeout(() => {
                stop();
              }, 2000);
            }
          };
        } else {
          console.log('erro ao logar');
        }
      }; 
    },

    async deleteIndexedDB() {
      const db = 'db-local-voucher'
      indexedDB.deleteDatabase(db);

      this.deleteUserStorage();
      vibrate();

      setTimeout(() => {
        stop();
      }, 2000);
    },

    async setUserStorage() {
      try {
        if (navigator.storage && navigator.storage.persist) {
          const persisted = await navigator.storage.persist();

          if (persisted) {
            const points = this.points;
            const shipments = this.shipments;
            localStorage.setItem('user', JSON.stringify({...this.user, points, shipments}));
          } else {
            console.log("Armazenamento persistente solicitado, mas não concedido.");
          }
        } else {
          console.log("O armazenamento persistente não é suportado.");
        }
      } catch (error) {
        console.error("Um erro ocorreu:", error);
      }
    },

    async getUserStorage() {
      const userLocal = await localStorage.getItem('user');

      try {
        const { name, email, points, shipments } = JSON.parse(userLocal);
        
        const user = {
          name, 
          email, 
          points,
          shipments
        }

        return user;
      } catch (error) {
        console.error("Erro a buscar usuario", error);
      }
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