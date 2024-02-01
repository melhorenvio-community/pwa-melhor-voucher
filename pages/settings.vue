<template>
  <div>
    <MEClickable @click="registerCredential"
      class="flex grow py-6 px-5 justify-between md:flex-row md:py-4 text-neutral-dark bg-white border-[1px] rounded border-neutral-light mt-8">
      <MEInfoBlock title="Cadastrar digital" text="Cadastre sua digital e garanta mais segurança para sua conta.">
        <template #icon>
          <iconFingerPrint class="mt-4" />
        </template>
      </MEInfoBlock>
    </MEClickable>
  </div>
</template>
<script setup>
import { MEButton, MEAvatar, MEInfoBlock, MEClickable } from '@melhorenvio/unbox';
import iconFingerPrint from '~icons/ion/finger-print';

definePageMeta({
  middleware: ['auth']
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
      authenticatorAttachment: "platform",
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
</script>