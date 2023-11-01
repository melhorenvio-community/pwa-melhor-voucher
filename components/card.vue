<template>
  <div 
    class="rounded-lg p-4 px-5 shadow"
    :class="available ? 'bg-neutral border' : 'bg-neutral-light'"
  >
    <div class="flex justify-between items-center">
      <div class="flex">
        <img 
          src='~/assets/icons/selo-azul.svg'
          :alt="props.title" 
        />
      
        <div class="pl-4">
          <p class="font-bold capitalize">
            {{ props.title }}
          </p>

          <p class="font-normal text-xs">
            {{ info }} 
          </p>

          <p class="font-bold text-xs">
            {{ props.point }} pontos.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-8">
        <img 
          class="cursor-pointer" 
          src="~/assets/icons/audio.svg" 
          alt="audio" 
          @click="play(title, info, point, description)"
        />

        <img 
          class="cursor-pointer"
          :class="rotateChevron" 
          src="~/assets/icons/chevron.svg" 
          alt="chevron" 
          @click="openDecription" 
        />
      </div>
    </div>

    <p v-if="showDescription" class="pl-10 pt-5 text-sm">{{ description }}</p>
  </div>
</template>

<script setup>
import { useSpeechSynthesis } from '@vueuse/core';

const props = defineProps({
  image: String,
  title: String,
  point: Number,
  description: String,
  available: Boolean,
})

const showDescription = ref(false);
const voice = ref(undefined);
const info = ref('Para alcançar esses premiso você precisa ter:');
const text = ref('');

const speech = useSpeechSynthesis(text, {
  lang: 'pt-BR',
  pitch: 1,
  rate: 1,
  volume: 1,
  voice,
});

function play(title, info, point, description) {
  const desc = showDescription.value ? description : '';
  text.value = title + info + point + 'pontos'+ desc;

  speech.speak();
}
function openDecription() {
  showDescription.value = !showDescription.value
}

const rotateChevron = computed(() => {
  if (showDescription.value) return 'rotate-90'; 
  
  return 'rotate-0';
});
</script>