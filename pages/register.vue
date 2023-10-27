<template>
  <div class="flex items-center justify-center h-screen">
    <MEForm class="flex items-center justify-center text-center  grid grid-cols-1 gap-6 md:gap-7" @submit="submit">
      <img class="illustration" src="/homeIllust.svg" />
       <div class="text-center">
          <p>Cadastra-se agora no Melhor Voucher e aproveite os beneficíos!</p>
        </div>

      <!--
        Name
      -->
      <MEInputField v-model="user.name" label="Nome" name="Nome" rules="required"/>
      <!--

      Email

    -->
      <MEEmailField v-model="user.email" label="E-mail" name="email" rules="required" :hide-requirement="false"
        autocomplete="email" autofocus />
      <!--

      Password

    -->
      <MEPasswordField v-model="user.password" label="Senha" name="password" rules="required" :hide-requirement="false"
        autocomplete="current-password" />
      <!--

      Submit / Password Request Button

    -->
    <div class="text-center">
      <p class="text-minute text-danger">Preencha os campos de nom e email antes de realizar cadastro de credenciais</p>
      <NuxtLink class="text-primary underline" @click="registerCredential">
        Cadastrar Credenciais de Login
      </NuxtLink>
    </div>
      <div class="flex flex-col">
        <MEButton @click="registerUser" type="submit" class="focus:ring-2 focus:ring-[Highlight] focus:ring-[black]">
          Registrar
        </MEButton>
      </div>

       <div class="text-center">
          <p>Já possui cadastro no Melhor Voucher?</p>
          <NuxtLink class="text-primary underline" to="/login">
            Fazer login
          </NuxtLink>
        </div>
    </MEForm>

    <METoast
      v-if="showToast"
      title="Usuário criado com sucesso"
      message="Faça seu login"
      :variant="success"
    />

  </div>
</template>
<script setup>
import {
  MEEmailField,
  MEPasswordField,
  MEButton,
  MEForm,
  METoast,
  MEInputField
} from '@melhorenvio/unbox';
definePageMeta({
  layout: 'empty',
});
const user = ref({
  name: '',
  email: '',
  password: ''
});
const bufferToBase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));
const challenge = new Uint8Array([53, 69, 96, 194]).buffer;
const selectOptionToRegisterCredentials = ref(false);
const credentialId = ref(null);
const registerCredential = async () => {
  selectOptionToRegisterCredentials.value = true;
  const publicKeyCredentialCreationOptions = {
    challenge: challenge,
    rp: {
      name: 'Melhor Voucher',
      id: 'localhost',
    },
    user: {
      id: Uint8Array.from("UZSL85T9AFC", c => c.charCodeAt(0)),
      name: user.value.email,
      displayName: user.value.name,
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: {
      authenticatorAttachment: "cross-platform",
    },
    attestation: "direct",
  };
  const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  });
  credentialId.value = bufferToBase64(credential.rawId);
  if (credentialId.value) {
    return notify({
      title: 'Credenciais cadastradas!',
      message: 'Faça seu login e aproveite.',
      variant: 'success',
    })
  }
}
const registerUser = async () => {
  const credentials = await createUser(user.value.email, user.value.password);
  const userCredentials = {
    ...user,
    credentialId: credentialId.value
  }
  sessionStorage.setItem('user-credential', JSON.stringify({ userCredentials }));
  if (credentials) {
    return notify({
      title: 'Conta registrada com sucesso!',
      message: 'Faça seu login e aproveite.',
      variant: 'success',
    })
  }
}
</script>
<style scoped>
.illustration {
  margin: 0 auto;
}
</style>
