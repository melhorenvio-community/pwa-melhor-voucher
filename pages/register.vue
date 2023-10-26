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
        <MEButton @click="login" type="submit" class="focus:ring-2 focus:ring-[Highlight] focus:ring-[black]">
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
const showToast = ref(false);

const challenge = new Uint8Array([53, 69, 96, 194]).buffer;
const publicKeyCredential = ref(null);

async function registerCredential() {
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

  const result = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  });
  console.log('result', result);
  publicKeyCredential.value = result;
}

const submit = async () => {
  const credentials = await createUser(user.email, user.password);

  if (credentials) return showToast.value = true;
}
</script>
<style scoped>
.illustration {
  margin: 0 auto;
}
</style>
