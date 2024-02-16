<template>
  <div class="max-w-2xl">
    <div class="flex flex-row items-baseline mt-4">
      <NuxtLink :to="back">
        <ionChevronLeft
          class="text-lg text-primary"
          to="/settings"
        />
      </NuxtLink>
      <h2 class="text-xl mt-9 lg:mt-0 mb-9 font-bold text-primary ml-4">
        Cadastrar credenciais
      </h2>
    </div>

      <p>Gerencie suas configurações de privacidade e acesse nossas políticas e termos de uso.</p>
          <MEButton
              @click="registerCredential"
              class="focus:ring-2 focus:ring-[Highlight] focus:ring-[black] mt-6"
              :disabled="activate"
            >
              <template #icon>
                <img src="/icons/ion_finger-print.svg" alt="ion_finger-print"/>
              </template>
              Cadastrar Credenciais de Login
            </MEButton>

    </div>
</template>
<script setup>
import { MEButton, MEAvatar, MEInfoBlock, MEClickable } from '@melhorenvio/unbox';
import ionChevronLeft from '~icons/ion/chevron-left';

definePageMeta({
  middleware: ['auth']
});

const route = useRoute();

const paths = computed(() => route.path
  .split('/')
  .slice(0, -1)
  .filter(base => !!base)
);

const user = ref({
  name: '',
  email: '',
  password: ''
});

const back = computed(() => {
  return '/' + paths.value.join('/');
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
      authenticatorAttachment: "platform",
    },
    attestation: "direct",
  };
  const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  });
  credentialId.value = bufferToBase64(credential.rawId);


  if (credentialId.value) {
    const credential = credentialId.value;
    sessionStorage.setItem('secure_credential_data', JSON.stringify({ credential }));
    return notify({
      title: 'Credenciais cadastradas com sucesso!',
      variant: 'success',
    });
  }
}
</script>
