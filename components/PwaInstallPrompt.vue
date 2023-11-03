<template>
  <div
    v-if="isInstalled"
    class="fixed bottom-4 right-4 p-4 mt-3 border-[1px] rounded-[20px] gap-1 border-neutral-light"
  >
    <div class="flex items-center mt-2">
      <div class="text-blue-600 text-2xl mr-2">
        <IonMdDownload/>
      </div>
      <div class="text-subtitle ml-1 mt-1">Instale o Melhor Voucher!</div>
    </div>
    <div class="text-small text-neutral-medium mt-2 px-4 py-4">Adicione o Melhor Voucher à sua tela inicial para acessá-lo mais facilmente.</div>
     <div class="leading-normal mt-6 text-center">
       <MEButton
          compact
          :disabled="false"
          @click="installApp"
        >
          Instalar
        </MEButton>

        <MEButton
          compact
          minimal
          :disabled="false"
           class="danger"
        >
          Cancelar
        </MEButton>
      </div>
  </div>

</template>
<script setup>
import { MEInfoBlock, MEButton } from '@melhorenvio/unbox';

const { $pwa } = useNuxtApp()

function installApp() {
  return $pwa.install();
}

function cancelInstall() {
  return $pwa.cancelInstall()
}

const isInstalled = computed(() => {
  return $pwa?.showInstallPrompt && !$pwa?.needRefresh;
});

console.log('isInstalled', isInstalled)
</script>
