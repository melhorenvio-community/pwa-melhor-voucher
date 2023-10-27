<template>
  <div 
    class="shadow-primary rounded-lg p-4 px-5"
    :class="available ? 'bg-neutral border' : 'bg-neutral-light'"
  >
    <div class="flex justify-between items-center">
      <div class="flex">
        <img 
          src='~/assets/icons/selo-azul.svg'
          :alt="title" 
        />
      
        <div class="pl-4">
          <p class="font-bold capitalize">
            {{ title }}
          </p>

          <p class="font-normal text-xs">
            Para alcançar esses premiso vc precisa ter: 
          </p>

          <p class="font-bold text-xs">
            {{ point }} pontos.
          </p>
        </div>
      </div>

      <div>
        <img 
          class="cursor-pointer"
          :class="rotateChevron" 
          src="~/assets/icons/chevron.svg" 
          alt="chevron" 
          @click="openDecription" 
        />
      </div>
    </div>

    <p v-if="showDescription" class="pl-10 pt-5 text-sm">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image?: string,
  title: string,
  point: number,
  description: string,
  available: boolean,
}>()

const showDescription = ref(false);



const rotateChevron = computed(() => {
  if (showDescription.value) return 'rotate-90'; 

  return 'rotate-0';
});

function openDecription() {
  showDescription.value = !showDescription.value
}
</script>