import { defineStore } from 'pinia';
import { useVibrate } from '@vueuse/core';
import { openDB, deleteDB } from 'idb';

const { vibrate, stop } = useVibrate({ pattern: [300, 100, 300] });

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    points: 50,
  }),

  actions: {
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
              points: this.points,
            }),
            tx.done,
          ]);
        }
      } catch (error) {
        console.error("Error: " + error);
      }
    },
    
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
          const { name, email } = db[0];

          this.setUserStorage();
          
          this.user = {
            name,
            email,
            points: this.points
          }
        };
      };
    },

    async deleteIndexedDB() {
      const db = 'db-local-voucher'
      this.deleteUserStorage();
      
      await deleteDB(db, {
        blocked() {
          vibrate();

          setTimeout(() => {
            stop();
          }, 2000);
        },
      });
    },

    async setUserStorage() {
      try {
        if (navigator.storage && navigator.storage.persist) {
          const persisted = await navigator.storage.persist();

          if (persisted) {
            const points = this.points;
            localStorage.setItem('user', JSON.stringify({...this.user, points}));
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
      const user = localStorage.getItem('user');
      try {
        await JSON.parse(user);
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