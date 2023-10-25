<template>
   <div>
      <div class="bg-sky-500">
         <h1> Home Page </h1>
      </div>
   </div>

</template>

<script setup>
import { MEButton } from '@melhorenvio/unbox';

definePageMeta({
   middleware: ['auth']
});
</script>