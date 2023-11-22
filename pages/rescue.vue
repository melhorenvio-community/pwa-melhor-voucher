<template>
  <div class="px-5">
    <p class="font-bold pt-4">Resgate de voucher</p>

    <div class="flex gap-2">
      <P>{{ text }}</P>

      <img 
        class="cursor-pointer" 
        src="~/assets/icons/audio.svg" 
        alt="audio" 
        @click="play()"
      />
    </div>
    
    <div class="my-8 w-full">
      <div class="flex items-center gap-2">
        <MEButton @click="openScanner = !openScanner">
          {{ textCamera }}
        </MEButton>

        <div class="flex-col">
          <p class="text-xs">* Click no botão para fazer seu resgate.</p>
          <p class="text-xs text-danger" v-if="notice">{{ notice }}</p>
        </div>
      </div>

      <QRCodeScanner 
        v-if="openScanner" 
        class="w-full" 
        @result="onScan" 
      />
    </div>

    <div class="my-8 md:flex justify-center items-center gap-4" v-if="textRecharge">
      <img 
        class="w-[250px] md:w-[350px] text-center mx-auto my-4" 
        src="~/assets/icons/congratulations.svg" 
        alt="Imagem de Parabéns"
      >
      <p class="max-w-[350px] my-4 mx-auto text-primary text-center text-lg font-bold md:w-[350px] md:text-xl">
        {{ textRecharge }}
      </p> 
    </div>
  </div>
</template>

<script setup>
import { MEButton, meToast } from  '@melhorenvio/unbox';
import { useSpeechSynthesis } from '@vueuse/core';
import QRCodeScanner from '~/components/QRCodeScanner.vue'
import { useUserStore } from '~/stores/user';

const { $state, getTagsStorage } = useUserStore();

const openScanner = ref(false);
const scan = ref({});
const voice = ref(undefined);
const notice = ref('')
const text = ref('Coloque a câmera na direção do QRCode');
const textRecharge = ref('');

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
 
  scan.value = {
    decodedText,
    decodedResult,
  };

  validateVoucher(scan.value.decodedText);
  openScanner.value = !openScanner.value
}

function validateVoucher(qrcodeValue) {
  if(qrcodeValue) {
    const tag = getTagsStorage();

    if (!tag.includes(qrcodeValue)) {
      textRecharge.value = 'Parabéns você acaba de ganhar um Cupom!'
      
      $state.tags.push(qrcodeValue);
    } else {
      textRecharge.value = 'Desculpe, mas parece que este QR Code já foi usado anteriormente.'

      meToast.show({
        variant: 'danger',
        title: 'Cupom inválido.',
        message: textRecharge.value,
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
  if(!openScanner.value) return 'Câmera';
  return 'Fechar'
})

definePageMeta({
 middleware: ['auth']
});
</script>