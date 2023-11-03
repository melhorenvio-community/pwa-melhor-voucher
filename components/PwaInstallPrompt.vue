<template>
  <div
    v-if="isInstalled"
   class="fixed bottom-0 right-0 p-4 m-3 border-[1px] rounded-[20px] gap-1 border-neutral-light bg-white"
  >
    <div class="flex items-center mt-2">
      <div class="text-blue-600 text-2xl mr-2">
        <Download/>
      </div>
      <div class="text-subtitle ml-1 mt-3">Instale o Melhor Voucher!</div>
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
          @click="cancelInstall()"
        >
          Cancelar
        </MEButton>
      </div>
  </div>

</template>
<script setup>
import { MEButton } from '@melhorenvio/unbox';
import Download from '~icons/ion/md-download';

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
</script>
