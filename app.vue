<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <METoast
      v-if="!isOnline"
      class="fixed bottom-0 w-[210px]"
      title="Você esta offline no momento."
      message="Observe sua conexão!"
      variant="danger"
    />
  </div>
</template>


<script setup>
import { METoast } from '@melhorenvio/unbox';
import { useNetwork } from '@vueuse/core';

const { isOnline, effectiveType} = useNetwork();

console.log(effectiveType);

</script>