import { defineStore } from 'pinia';

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
          const data = event.target.result;
          const { email } = data[0].value;

          let partes = email.split('@');
          let userName = partes[0];

          this.user = {
            name: userName.replace('.', ' '),
            email
          }
        };
      };

      request.onerror = (event) => {
        console.error("Erro ao abrir o banco de dados: " + event.target.errorCode);
      };
    },
  },
});