<template>
  <div class="px-5">
     <div class="flex flex-row items-baseline mt-4">
        <NuxtLink :to="back">
          <ionChevronLeft
            class="text-lg text-primary"
            to="/settings"
          />
        </NuxtLink>
        <h2 class="text-xl mt-9 lg:mt-0 mb-9 font-bold text-primary ml-4">
           Resgate seu Voucher
        </h2>
      </div>
    <div class="flex gap-2">
      <span>{{ text }}</span>

      <img
        class="cursor-pointer ml-3"
        src="/icons/audio.svg"
        alt="audio"
        @click="play()"
      />
    </div>
    
    <div class="my-8 w-full">
      <MEButton @click="openScanner = !openScanner">
        {{ textCamera }}
      </MEButton>
      <div class="flex items-center gap-2">
        <div class="flex-col">
          <p class="text-xs mt-2">Click no botão para fazer seu resgate.</p>
          <p class="text-xs text-danger" v-if="notice">{{ notice }}</p>
        </div>
      </div>

      <QRCodeScanner 
        v-if="openScanner" 
        class="w-full" 
        @result="onScan" 
      />
    </div>

    <div class="my-8 md:flex justify-center items-center gap-4">
      <div v-if="textRecharge">
        <img 
          class="w-[250px] md:w-[350px] text-center mx-auto my-4" 
          src="/icons/congratulations.svg" 
          alt="Imagem de Parabéns"
        >
        <p class="max-w-[350px] my-4 mx-auto text-primary text-center text-lg font-bold md:w-[350px] md:text-xl">
          {{ textRecharge }}
        </p> 
      </div>

      <div v-if="textErrorRecharge">
        <img 
          class="w-[250px] md:w-[350px] text-center mx-auto my-4" 
          src="/icons/error.svg" 
          alt="Imagem de Erro"
        >
        <p class="max-w-[350px] my-4 mx-auto text-danger text-center text-lg font-bold md:w-[350px] md:text-xl">
          {{ textErrorRecharge }}
        </p> 
      </div>
      
      <NuxtLink 
        class="flex justify-center text-primary mx-auto underline mt-12"
        to="/"
      >
        {{ textCupom }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { MEButton, meToast } from  '@melhorenvio/unbox';
import { useSpeechSynthesis } from '@vueuse/core';
import { useUserStore } from '~/stores/user';
import QRCodeScanner from '~/components/QRCodeScanner.vue'
import ionChevronLeft from '~icons/ion/chevron-left';

const { $state, getStorageTags, updateIndexedDBTag } = useUserStore();

const openScanner = ref(false);
const scan = ref({});
const voice = ref(undefined);
const notice = ref('')
const text = ref('Coloque a câmera na direção do QRCode');
const textRecharge = ref('');
const textErrorRecharge = ref('');
const route = useRoute();

const paths = computed(() => route.path
  .split('/')
  .slice(0, -1)
  .filter(base => !!base)
);
const back = computed(() => {
  return '/' + paths.value.join('/');
});


const speech = useSpeechSynthesis(text, {
  lang: 'pt-BR',
  pitch: 1,
  rate: 1,
  volume: 1,
  voice,
});

function play() {
  speech.speak();
}

function onScan(decodedText, decodedResult) {
  textRecharge.value = null;
  textErrorRecharge.value = null;

  scan.value = {
    decodedText,
    decodedResult,
  };

  validateVoucher(scan.value.decodedText);
  openScanner.value = !openScanner.value
}

function validateVoucher(qrcodeValue) {
  if(qrcodeValue) {
    const tag = getStorageTags();

    if (!tag.includes(qrcodeValue)) {
      textRecharge.value = 'Parabéns você acaba de ganhar um Cupom!'

      $state.tags.push(qrcodeValue);
      
      updateIndexedDBTag();
    } else {
      textErrorRecharge.value = 'Desculpe, mas parece que este QR Code já foi usado anteriormente.'

      meToast.show({
        variant: 'danger',
        title: 'Cupom inválido.',
        message: textErrorRecharge.value,
      }); 
    }
  } else {
    notice.value = "Problemas na bipagem do QR Code, tente novamente";

    meToast.show({
      variant: 'danger',
      title: 'QR Code inválido.',
      message: notice.value,
    });
  }
}

const textCamera = computed(()=>{
  if(!openScanner.value) return 'Ativar Câmera';
  return 'Fechar'
})

const textCupom = computed(()=>{
  return textRecharge.value ? 'Quero usar o cupom!' : 'Voltar a página inicial'
})

definePageMeta({
 middleware: ['auth']
});
</script>