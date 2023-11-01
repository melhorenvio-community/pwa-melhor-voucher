<template>
   <div>
    <div
      class="
        full-bleed
        p-7
        bg-primary
        rounded-b
        shadow
        text-white
        lg:flex
        lg:justify-between
        lg:p-9
        lg:mx-0
        lg:rounded-t
      "
    >
        <div class="flex flex-col items-center mb-7 lg:block lg:mb-0">
          <p class="text-base">
            {{ greetingsMessage }}, <strong class="text-base font-bold">{{ user }}</strong>
          </p>
        </div>

        <div class="flex flex-col flex-wrap">
          <p class="basis-full mb-5 text-lg font-bold lg:basis-auto lg:mr-7 lg:mb-0">
            Pontos atual:
          </p>

          <MESkeleton
            v-if="loading"
            width="100px"
            height="30px"
            line
          />

          <p
            v-else
            class="text-2xl font-bold"
          >
            {{ points }} <small class="text-minute">{{ description }}</small>
          </p>

          <small class="text-minute">{{ inspire }}</small>
        </div>
    </div>

    <div class="px-5">
      <p class="font-bold pt-4">Selos</p>

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
        <card 
          v-for="(message, title) in getCard" 
          :key="title"
          :image="message.image"
          :point="message.point"
          :title="message.title"
          :description="message.description" 
          :available="message.available"
        />
      </div>
    </div>
   </div>
</template>

<script setup>
import { MESkeleton, MEInputField } from '@melhorenvio/unbox';
import card from '~/components/card.vue';
import { sealMessage } from '~/enums/selosMessages';

const loading = ref(true);
const points = ref(200);
const inspire = ref('Inspira 28/03/2024');
const user = ref('Renata Leal');
const hours = new Date().getHours();
const transcript = ref('');
const isRecording = ref(false);

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
const sr = new Recognition();


function search() {
  let title = sealMessage.map((item) => item.title);

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

const greetingsMessage = computed(() => {
  if (hours >= 0 && hours < 12) return 'Bom dia';

  if (hours >= 12 && hours <= 18) return 'Boa tarde';

  return 'Boa noite';
});

const getCard = computed(() => {
  return search().map((searchs) => {
    return sealMessage.find((item) => item.title === searchs);
  });
});

const description = computed(() => {
  if (points.value > 1) return 'Pontos'; 

  return'Ponto';
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