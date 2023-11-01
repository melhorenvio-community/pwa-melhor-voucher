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
    
    
    <MEButton @click="start">Câmera</MEButton>
  </div>
</template>

<script setup>
import { MEButton } from  '@melhorenvio/unbox';
import { useSpeechSynthesis } from '@vueuse/core';

const scanner = ref(null);
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

definePageMeta({
 middleware: ['auth']
});
</script>