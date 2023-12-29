<template>
  <div class="h-screen flex flex-col items-center lg:flex-row lg:gap-5 lg:w-[1000px] lg:m-auto">
    <div class="flex-1 flex flex-col justify-center lg:flex-[6]">
      <img 
        class="w-[220px] lg:w-[420px]"
        src="/homeIllust.svg"
        alt="illustration"
      />
    </div>
    teste:
    Online: {{ isOnline }}
    Type: {{ type }}
    offlineAt:{{ offlineAt}}
    downlink:{{  downlink}}
    downlinkMax:{{  downlinkMax}}
    effectiveType:{{  effectiveType}}
    saveData: {{  saveData }}
    <div class="flex flex-1 flex-col items-center lg:flex-[4]">
      <MEForm class="flex flex-col gap-6 lg:gap-8">
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

        <MEButton 
          @click="login"
          type="submit"
          class="focus:ring-2 focus:ring-[Highlight] focus:ring-[black]"
        >
          Acessar
        </MEButton>

        <div class="text-center">
          <p>Ainda não tem cadastro no Melhor Voucher?</p>

          <NuxtLink id="register-now" class="text-primary underline" to="/register">
            Cadastre-se agora!
          </NuxtLink>
        </div>
      </MEForm>
    </div>
  </div>
</template>

<script setup>
import { MEEmailField, MEPasswordField, MEButton, MEForm } from '@melhorenvio/unbox';
import { useNetwork } from '@vueuse/core'

const { isOnline, offlineAt, downlink, downlinkMax, effectiveType, saveData, type } = useNetwork()


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


  if (credentialId.value && credentials.userCredentials.user === email) {
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
