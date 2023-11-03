<template>
  <div class="px-5">
    <p class="font-bold pt-4">Produtos</p>

    <MEInputField
      class="my-3"
      v-model="transcript"
      label="Buscar selos"
      name="transcript"
    >
      <template #right-icon>
        <img 
          src="~/assets/icons/micro.svg" 
          alt="microfone" 
          class="hover:scale-110" 
          @click="ToggleMic" 
        />
      </template>
    </MEInputField>

    <div class="flex flex-col mt-4 gap-4">
    <MESkeleton
        v-if="loading"
        v-for="(message) in getCard" 
        :key="message"
        width="w-full"
        height="80px"
        line
      />

      <div class="flex flex-col mt-4 gap-4" v-else>
      <buy 
        v-for="(message, title) in getCard" 
        :key="title"
        :image="message.image"
        :price="message.price"
        :title="message.title"
        :description="message.description" 
      />
      </div>
    </div>
  </div>
</template>

<script setup>
import { MESkeleton, MEInputField } from '@melhorenvio/unbox';
import { productMessages } from '~/enums/productMessages';
import buy from '~/components/buy.vue';

const loading = ref(true);
const points = ref(200);
const user = ref('Renata Leal');
const hours = new Date().getHours();
const transcript = ref('');
const isRecording = ref(false);

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
const sr = new Recognition();

function search() {
 let title = productMessages.map((item) => item.title);

 return title.filter((item) =>
   item.includes(transcript.value.toLowerCase()),
 );
}

function CheckForCommand(result) {
 const voice = result[0].transcript;
 isRecording.value = false

 if (voice.includes('finalizar') || voice.includes('ok')) {
   sr.stop()
 }

 setTimeout(() => sr.stop(), 100);
}

function ToggleMic() {
 isRecording.value ? sr.stop() : sr.start()
}

function init() {
 setTimeout(() => {
   loading.value = false;
 }, 1000);
}

const getCard = computed(() => {
 return search().map((searchs) => {
   return productMessages.find((item) => item.title === searchs);
 });
});

onMounted(() => {
 sr.continuous = true
 sr.interimResults = true

 sr.onstart = () => {
   isRecording.value = true
 }

 sr.onend = () => {
   isRecording.value = false
 }

 sr.onresult = (evt) => {
   for (const element of evt.results) {
     const result = element

     if (result.isFinal) CheckForCommand(result)
   }

   const voice = Array.from(evt.results)
     .map(result => result[0])
     .map(result => result.transcript)
     .join('')
   
   transcript.value = voice;
 }
})

definePageMeta({
 middleware: ['auth']
});

init();
</script>