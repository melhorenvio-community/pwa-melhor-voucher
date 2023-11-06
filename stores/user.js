import { defineStore } from 'pinia';
import { useVibrate } from '@vueuse/core';

const { vibrate, stop, isSupported } = useVibrate({ pattern: [300, 100, 300] });


export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),

  actions: {
    async getIndexedDB() {
      const dbName = "firebaseLocalStorageDb";
      const request = indexedDB.open(dbName);

      request.onsuccess = (event) => {
        const db =  event.target.result;
      
        const transaction = db.transaction(["firebaseLocalStorage"], "readonly");
        const objectStore = transaction.objectStore("firebaseLocalStorage");
      
        const getAllRequest = objectStore.getAll();
      
        getAllRequest.onsuccess = (event) => {
          const db = event.target.result;
          
          if(db) {
            const { email } = db[0].value;

            let partes = email.split('@');
            let userName = partes[0];
  
            this.user = {
              name: userName.replace('.', ' '),
              email
            }
          } else {
            vibrate();

            setTimeout(() => {
              stop();
            }, 2000);
            
            navigateTo('/login');
          }
        };
      };

    
    },
  },
});