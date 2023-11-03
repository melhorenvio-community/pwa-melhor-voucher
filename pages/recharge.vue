<template>
  <div class="px-5">
    <p class="font-bold pt-4">Recarga de pontos</p>

    <div class="flex gap-2">
      <P>{{ text }}</P>

      <img 
        class="cursor-pointer" 
        src="~/assets/icons/audio.svg" 
        alt="audio" 
        @click="play()"
      />
    </div>
    
    <div>
      <MEButton @click="openScanner = !openScanner">
        {{ textCamera }}
      </MEButton>

      <qrcodescanner 
        v-if="openScanner" 
        style="width: 500px;" 
        @result="onScan" 
      />

      <p>
        {{ scan }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { MEButton } from  '@melhorenvio/unbox';
import { useSpeechSynthesis } from '@vueuse/core';
import qrcodescanner from '../components/qrcodescanner.vue'

const openScanner = ref(false);
const scan = ref({});
const voice = ref(undefined);
const text = ref('Coloque a câmera na direção do QRCode');

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
  if (scan.value.decodedText) {
    return false;
  } else {
    scan.value = {
      decodedText,
      decodedResult,
    };

    openScanner.value = !openScanner.value
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