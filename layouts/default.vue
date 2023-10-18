<script setup>
import { METemplate } from '@melhorenvio/unbox';

const route = useRoute();
const avatarName = computed(() => 'Renata leal');

const pageDataAttr = computed(() => {
  return `page-${route.name}`
});

</script>
<template>
  <div class="overflow-hidden min-h-screen" :data-page-name="pageDataAttr">

    <METemplate ref="templateRef" v-bind="{
      avatarName
    }">
      <slot />
    </METemplate>
  </div>
</template>