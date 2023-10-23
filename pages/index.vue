<template>
 <div v-if="firebaseUser">
   {{ firebaseUser }}
   <MEButton @click="logOut"> Sair </MEButton>
 </div>
</template>

<script setup>
import { MEButton } from '@melhorenvio/unbox';

definePageMeta({
   middleware: ['auth']
});

const firebaseUser = useFirebaseUser();

const logOut = async () => {
   await signOutUser();
  return navigateTo('/login')
}
</script>