<template>
   <div class="p-8 text-center">
    <div v-if="!firebaseUser">
       <MEForm
          class="grid grid-cols-1 gap-6 md:gap-7 mt-8"
        >
          <MEEmailField
            label="Email"
            name="test"
            rules="required"
            v-model="user.email"
          />

          <MEPasswordField
            label="Test"
            name="test"
            rules="required"
            v-model="user.password"
          />

          <MEButton @click="login"> Entrar </MEButton>

        </MEForm>
    </div>

    <div v-else>
      {{ firebaseUser }}
      <MEButton @click="logOut"> Sair </MEButton>
    </div>



   </div>
</template>
<script setup>
import { MEEmailField, MEPasswordField, MEButton } from '@melhorenvio/unbox';

definePageMeta({
  layout: 'empty',
});

const firebaseUser = useFirebaseUser();
const user = ref({
  email : '',
  password : ''
})

const credentials = ref();

const login = async () => {
  const email = user.value.email;
  const password = user.value.password;

  credentials.value = await signUser(email, password);
  console.log('credentials',  credentials.value)
  return  credentials.value;
}

const logOut = async () => {
  credentials.value = await signOutUser();
  console.log('result logout', result);
}
</script>