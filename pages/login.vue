<template>
  <div class="flex items-center justify-center h-screen">
    <MEForm class="flex items-center justify-center text-center  grid grid-cols-1 gap-6 md:gap-7">
      <img class="illustration" src="/homeIllust.svg"/>

      <!--

      Email

    -->
      <MEEmailField v-model="user.email" label="E-mail" name="email" rules="required" :hide-requirement="false" autocomplete="email" autofocus />
      <!--

      Password

    -->
      <MEPasswordField v-model="user.password" label="Senha" name="password" rules="required" :hide-requirement="false"
        autocomplete="current-password" />
      <!--

      Submit / Password Request Button

    -->
      <div class="flex flex-col">
        <MEButton @click="login" type="submit" class="focus:ring-2 focus:ring-[Highlight] focus:ring-[black]">
          Acessar
        </MEButton>

        <NuxtLink id="forgot-password"
          class="w-auto mt-3 mx-auto text-primary underline" to="/request-password" rel="noopener noreferrer" minimal>
          Esqueceu sua senha?
        </NuxtLink>
      </div>
      <!--

      Info / Register Button

    -->
      <div class="text-center">
        <p>Ainda não tem cadastro no Melhor Voucher?</p>
        <NuxtLink id="register-now" class="text-primary underline" to="/register">
          Cadastre-se agora!
        </NuxtLink>
      </div>
    </MEForm>

  </div>

</template>
<script setup>
import { MEEmailField, MEPasswordField, MEButton, MEForm } from '@melhorenvio/unbox';
definePageMeta({
  layout: 'empty',
});
const user = ref({
  email: '',
  password: ''
})

const credentialsUser = useCredentialsUser();
const base64ToBuffer = base64 => Uint8Array.from(atob(base64), c => c.charCodeAt(0));
const credentialId = ref(null);


const authenticateLogin = async (email, password) => {
  credentialsUser.value = await signUser(email, password);
  if (credentialsUser.value) return navigateTo('/');
}

const login = async () => {
  const credentials = JSON.parse(sessionStorage.getItem('user-credential')) || null;
  const email = user.value.email;
  const password = user.value.password;
  credentialId.value = credentials?.userCredentials?.credentialId;


  if (credentialId.value  && credentials.userCredentials.user === email) {
    return authCredential(email, password);
  }
  authenticateLogin(email, password);
}
async function authCredential(email, password) {
  const challenge = new Uint8Array([53, 69, 96, 194]).buffer;
  if (!credentialId.value) {
    return;
  }
  const hasCredentials = await navigator.credentials.get({
    publicKey: {
      challenge: challenge,
      allowCredentials: [
        {
          id: base64ToBuffer(credentialId.value),
          type: "public-key",
        },
      ],
      rpId: "localhost",
      userVerification: "required",
    },
  });
  if (hasCredentials) {
    return authenticateLogin(email, password);
  } else {
    return notify({
      title: 'Autenticação falhou',
      message: 'Tente novamente.',
      variant: 'danger',
    });
  }
}
</script>
<style scoped>
.illustration {
  margin: 0 auto;
}
</style>
