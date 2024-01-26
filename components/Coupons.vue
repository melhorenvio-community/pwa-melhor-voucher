<template>
  <div 
    class="rounded-lg p-4 px-5 shadow bg-neutral "
    :class="true ? 'bg-neutral hover:cursor-pointer' : 'bg-neutral-light'"
  >
    <div class="flex justify-between items-center">
      <div class="flex" @click="rescue(voucher)">
        <img 
          class="w-[42px] lg:w-[50px]"
          :src='image'
          :alt="title" 
        />

        <div class="pl-5">
          <p class="font-bold capitalize">
            {{ title }}
          </p>

          <p class="font-normal text-xs">
            {{ description }}.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-8">
        <img 
          class="cursor-pointer" 
          src="/icons/audio.svg" 
          alt="audio" 
          @click="play(title, description)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSpeechSynthesis } from '@vueuse/core';

defineProps({
  image: String,
  title: String,
  voucher: String,
  description: String
});

const emit = defineEmits();

const voice = ref(undefined);
const text = ref('');

const speech = useSpeechSynthesis(text, {
  lang: 'pt-BR',
  pitch: 1,
  rate: 1,
  volume: 1,
  voice,
});

function play(title, description) {
  text.value = title + description;

  speech.speak();
}

function rescue(voucher) {
  emit('rescue', voucher);
}
</script>