<template>
  <div class="flex items-center justify-center h-screen">
    <MEForm class="flex items-center justify-center text-center  grid grid-cols-1 gap-6 md:gap-7" @submit="login">
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
  email : '',
  password : ''
})

const credentialsUser = useCredentialsUser();
console.log('credentialsUser', credentialsUser)

const login = async () => {
  const email = user.value.email;
  const password = user.value.password;

  if (credentialsUser) {
    await authCredential(credentialsUser.value);
  }

  try {
    const isLogged = await signUser(email, password);
    if (isLogged) return navigateTo('/');

  } catch (error) {
    return console.error(error.message);
  }
}

async function authCredential(publicKeyCredential) {
  const challenge = new Uint8Array([53, 69, 96, 194]).buffer;
  const publicKey = publicKeyCredential;
  if (!publicKey) {
    console.log("Nenhuma credencial registrada.");
    return;
  }

  try {
    const result = await navigator.credentials.get({
      publicKey: {
        challenge: challenge,
        allowCredentials: [
          {
            id: publicKey.rawId,
            type: "public-key",
          },
        ],
        rpId: "localhost",
        userVerification: "required",
      },
    });
    if (result) {
      console.log("Autenticação bem-sucedida:", result);
      return navigateTo('/');
    } else {
      console.log("Autenticação falhou.");
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
  }
}
</script>
<style scoped>
.illustration {
  margin: 0 auto;
}
</style>
