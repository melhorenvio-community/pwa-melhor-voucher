import { defineStore } from 'pinia';
import { useVibrate } from '@vueuse/core';
import { openDB, deleteDB } from 'idb';

const { vibrate, stop } = useVibrate({ pattern: [300, 100, 300] });

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),

  actions: {
    async getIndexedDB() {
      const dbName = "db-local-voucher";
      const request = indexedDB.open(dbName);

      request.onsuccess = (event) => {
        const db =  event.target.result;
      
        const transaction = db.transaction(["me-voucher-user"], "readonly");
        const objectStore = transaction.objectStore("me-voucher-user");
      
        const getAllRequest = objectStore.getAll();
      
        getAllRequest.onsuccess = (event) => {
          const db = event.target.result;
          const { name, email, points } = db[0];
          
          this.user = {
            name,
            points,
            email
          }
        };
      };
    },

    async addIndexedDB(userPromise) {
      try {
        const { user } = await userPromise;

        const db = await openDB('db-local-voucher', 1, {
          upgrade(db) {
            const store = db.createObjectStore('me-voucher-user', {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('date', 'date');
          },
        });

        let email = user.email;
        let partes = email.split('@');
        let userName = partes[0];

        {
          const tx = db.transaction('me-voucher-user', 'readwrite');
         
          await Promise.all([
            tx.store.add({
              name: userName.replace('.', ' '),
              date: new Date(),
              email,
              points: 0,
            }),
            tx.done,
          ]);
        }
      } catch (error) {
        console.error("Error: " + error);
      }
    },

    async deleteIndexedDB() {
      const db = 'db-local-voucher'
    
      await deleteDB(db, {
        blocked() {
          vibrate();

          setTimeout(() => {
            stop();
          }, 2000);
        },
      });
    },
  },
});