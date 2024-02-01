<template>
  <div class="h-screen flex flex-col items-center lg:flex-row lg:gap-5 lg:w-[1000px] lg:m-auto">
    <div class="flex-1 flex flex-col justify-center lg:flex-[6]">
      <img 
        class="w-[220px] lg:w-[420px]" 
        src="/icons/homeIllust.svg" 
        alt="illustration" 
      />
    </div>

    <div class="flex flex-1 flex-col items-center lg:flex-[4]">
      <MEForm class="flex flex-col gap-6">
        <MEInputField 
          v-model="user.name" 
          label="Nome" 
          name="Nome" 
          rules="required"
        />

        <MEEmailField 
          v-model="user.email" 
          label="E-mail" 
          name="email"
          rules="required" 
          :hide-requirement="false"
          autocomplete="email" 
          autofocus 
        />

        <MEPasswordField 
          v-model="user.password" 
          label="Senha" 
          name="password" 
          rules="required" 
          :hide-requirement="false"
          autocomplete="current-password" 
        />

        <p class="text-minute text-center font-normal text-danger" v-if="activate">
          *Preencha todos campos antes de realizar cadastro de credenciais
        </p>

        <MEButton
          class="focus:ring-2 focus:ring-[Highlight] focus:ring-[black]"
          @click="registerUser" 
          type="submit"
          :disabled="!selectOptionToRegisterCredentials"
        >
          Registrar Conta
        </MEButton>

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
      id: process.env.APP_DOMAIN,
    },
    user: {
      id: Uint8Array.from("UZSL85T9AFC", c => c.charCodeAt(0)),
      name: user.value.email,
      displayName: user.value.email,
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
      title: 'Credenciais cadastradas com sucesso!',
      variant: 'success',
    })
  }
}

const registerUser = async () => {
  const credentials = await createUser(user.value.email, user.value.password);
  const userCredentials = {
    user: user?.value?.email
  }
  sessionStorage.setItem('user-credential', JSON.stringify({ userCredentials }));
  if (credentials) {
    notify({
      title: 'Conta registrada com sucesso!',
      message: 'Faça seu login e aproveite.',
      variant: 'success',
    });
    return navigateTo('/login');
  }
}
</script>
