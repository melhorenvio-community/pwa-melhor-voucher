<template>
  <div 
    class="rounded-lg p-4 px-5 shadow bg-neutral cursor-pointer hover:border"
    @click="comprar"
  >
    <div class="flex justify-between items-center">
      <div class="flex">
        <img 
          class="w-[100px] lg:w-[120px]"
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

          <p class="font-bold text-xs">
            R$: {{ price }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-8">
        <img 
          class="cursor-pointer" 
          src="~/assets/icons/audio.svg" 
          alt="audio" 
          @click="play(title, description, price)"
        />
      </div>
    </div>
  </div>

  <MEDialog
    :open="openModal"
    @close="closeBuyModal"
  >
    <template #body>
      <h3 class="text-xl font-bold mb-7">
        Você acaba de adquirir nosso voucher!
      </h3>

      <p class="text-base text-primary ont-bold mb-5">
        código do voucher: <span class="text-black">{{ voucher }}</span>
      </p>
    </template>

    <template #footer>
     <div class="flex justify-center gap-4">
      <MECopyToClipboard
        class="block"
        :content="voucher"
        alt
      />

      <MEButton class="block" @click="shared">
        <template #icon>
          <img 
            src='~/assets/icons/share.svg'
            alt="titsharedle" 
          />
        </template>
        shared
      </MEButton>
     </div>
    </template>
  </MEDialog>
</template>

<script setup>
import { meDialog, MEButton, MEDialog, MECopyToClipboard } from '@melhorenvio/unbox';
import { useSpeechSynthesis } from '@vueuse/core';

defineProps({
  image: String,
  title: String,
  price: Number,
  description: String,
})

const voucher = ref('12345ME')

const voice = ref(undefined);
const text = ref('');
const openModal = ref(false);

const speech = useSpeechSynthesis(text, {
  lang: 'pt-BR',
  pitch: 1,
  rate: 1,
  volume: 1,
  voice,
});

function play(title, description, price) {
  text.value = title + description + ', valor' +  price + 'reais';

  speech.speak();
}

function shared() {
  if(navigator.share) {
    navigator.share({
      title: 'Adquirindo este voucher',
      text: voucher.valeu,
      url: "https://melhorenvio.com.br/login"
    });
  } else {
    navigator.clipboard.writeText(voucher.valeu);
  }
}

async function comprar() {
 const { confirmed } = await meDialog.fire({
      icon: '',
      iconClasses: '',
      title: 'Adquirir voucher',
      body: ' você deseja efetuar a compra do voucher?',
      confirmButtonText: 'Comprar',
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (confirmed) {
      openBuyModal();
    }
}

function closeBuyModal() {
  openModal.value = false;
}

function openBuyModal() {
  openModal.value = true;
}
</script>