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
            {{ greetingsMessage }},
            <strong class="text-base font-bold capitalize">
              {{ user }}
            </strong>
          </p>


            <div class="flex flex-row-2 mt-4">
              <span>
                <wifiSharp class="mt-2 mr-2"/>

              </span>
              <span>
                status de rede:
                <strong class="text-normal font-bold capitalize ml-2">
                  {{ statusOnline }}
                </strong>
              </span>
            </div>

        </div>

        <div class="flex flex-col flex-wrap">
          <p class="basis-full mb-5 text-lg font-bold lg:basis-auto lg:mr-7 lg:mb-0">
            Meus cupons
          </p>

          <MESkeleton
            v-if="loading"
            width="100px"
            height="30px"
            line
          />

          <div class="flex gap-4" v-else>
            <p class="text-2xl font-bold">
              {{ $state.user.tags.length }} <small class="text-minute">{{ description }}</small>
            </p>
          </div>
          <small class="text-minute">
            <p> Expira em: {{  expirationDate }}</p>
          </small>
        </div>
    </div>

    <div class="px-5">
      <p class="font-bold pt-4">Cupons</p>
      <div class="flex gap-4">
        <div class="relative w-full">
          <MEInputField
            class="w-full"
            v-model="transcript"
            label="Buscar selos"
            name="transcript"
          >
            <template #right-icon>
              <img
                class="hover:scale-110 ml-8"
                src="/icons/search.svg"
                alt="search"
                @click="ToggleMic"
              />
            </template>
          </MEInputField>

        </div>

        <img
          class="bg-neutral-light w-12 h-12 p-4 rounded-full hover:scale-110"
          src="/icons/micro.svg"
          alt="microfone"
          @click="ToggleMic"
        />
      </div>

      <div class="flex flex-col mt-4 gap-4">
        <div v-if="loading">
          <MESkeleton
            v-for="(message) in dataCards"
            :key="message"
            width="w-full"
            height="80px"
            line
          />
        </div>

        <div v-else class="flex flex-col mt-4 gap-4">
          <Coupons
            v-for="(message, title) in dataCards"
            :key="title"
            :image="message.image"
            :voucher="message.voucher"
            :title="message.title"
            :description="message.description"
            @rescue="rescue"
          />

          <MEDialog
            :open="openModal"
            @close="closeBuyModal"
          >
            <template #body>
              <h3 class="text-xl font-bold mb-7">
                Você acaba de adquirir nosso voucher!
              </h3>

              <p class="text-base text-primary ont-bold mb-5">
                código do voucher: <span class="text-black">{{ voucherNumber }}</span>
              </p>
            </template>

            <template #footer>
            <div class="flex justify-center gap-4">
              <MECopyToClipboard
                class="block"
                :content="voucherNumber"
                alt
              />

              <MEButton class="block" @click="shared()">
                <template #icon>
                  <div class="flex items-center gap-2">
                    <img
                      src='/icons/share.svg'
                      alt="titsharedle"
                    />

                    <span class="text-sm">Compartilhar</span>
                  </div>
                </template>
              </MEButton>
            </div>
            </template>
          </MEDialog>
        </div>
      </div>
    </div>
   </div>
</template>

<script setup>
import {
  MESkeleton,
  MEInputField,
  meDialog,
  MEButton,
  MEDialog,
  MECopyToClipboard
} from '@melhorenvio/unbox';
import Coupons from '~/components/Coupons.vue';
import { sealMessage } from '~/enums/selosMessages';
import { useUserStore } from '~/stores/user';
import { useNetwork } from '@vueuse/core';
import wifiSharp from '~icons/ion/wifi-sharp';
const { isOnline, effectiveType } = useNetwork();

const statusOnline = computed(() => {
  return isOnline.value ? effectiveType.value : 'Offline';
});

const {
  $state,
  updateIndexedDBUser,
  getDataFromFirestore,
  getIndexedDBUser,
  updateFirestoreUserData
} = useUserStore();

const loading = ref(true);
const hours = new Date().getHours();
const transcript = ref('');
const isRecording = ref(false);
const openModal = ref(false);
const voucherNumber = ref('');

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
const sr = new Recognition();
const expirationDate = ref('');

async function search() {
  const user = await fetchData();

  if (user) {
    const tag = user.tags

    let numberCompany = tag?.map((string) =>
      parseInt(string.split(';').pop())
    );

    let cumponFree = 0;

    numberCompany?.unshift(cumponFree);

    let matchingObjects = numberCompany?.map((value) =>
      sealMessage.find((obj) => obj.company === value)
    );

    let description = matchingObjects?.map((item) => item.description);

    return description?.filter((item) =>
      item.includes(transcript.value?.toLowerCase()),
    );
  }
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

function shared() {
  if(navigator.share) {
    navigator.share({
      title: 'Adquirindo este voucher',
      text: voucherNumber.value,
      url: "https://melhorenvio.com.br/login"
    });
  } else {
    navigator.clipboard.writeText(voucherNumber.value);
  }
}

async function rescue( voucher) {
 if( voucher ) {
  voucherNumber.value = voucher.toUpperCase();

  const { confirmed } = await meDialog.fire({
    icon: '',
    iconClasses: '',
    title: 'Melhor Voucher!',
    body: 'você deseja resgatar seu voucher?',
    confirmButtonText: 'Resgatar',
    cancelButtonText: 'Cancelar',
    showConfirmButton: true,
    showCancelButton: true,
  });

  if (confirmed) {
    openBuyModal();
  }
 }

 return false
}

function closeBuyModal() {
  openModal.value = false;
}

function openBuyModal() {
  openModal.value = true;
}

const greetingsMessage = computed(() => {
  if (hours >= 0 && hours < 12) return 'Bom dia';

  if (hours >= 12 && hours <= 18) return 'Boa tarde';

  return 'Boa noite';
});

const user =  computed(() => {
  return $state.user?.name;
});

const dataCards = ref();

async function getCard() {
  try {
    const cards = await search();

    if (cards) {
      const result = cards.map((description) => {
        return sealMessage.find((item) => item.description === description);
      });

      dataCards.value = result;
      loading.value = false;
    }
  } catch (error) {
    console.error(error);
  }
}

watch(isOnline, () => {
  getCard();
  syncUserData();
});

watch(transcript, () => {
  getCard();
});

const description = computed(() => {
  return $state.user.tags.length > 1 ? 'Cupons' : 'Cupon';
});

function formatarData(data) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const dataFormatada = data.toLocaleDateString('pt-BR', options);
  return dataFormatada;
}

function generateFutureDate() {
  const currentDate = new Date();
  const daysToAdd = Math.floor(Math.random() * 30) + 1; // Adiciona de 1 a 30 dias
  currentDate.setDate(currentDate.getDate() + daysToAdd);
  expirationDate.value = formatarData(currentDate);
}

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
  getCard();
  syncUserData();
  generateFutureDate();
})

definePageMeta({
  middleware: ['auth']
});
</script>