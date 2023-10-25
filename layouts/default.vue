<template>
  <div class="overflow-hidden min-h-screen" :data-page-name="pageDataAttr">

    <METemplate ref="templateRef" v-bind="{
      avatarName,
      sidebarSubitems
    }">
      <slot />
    </METemplate>
  </div>
</template>

<script setup>
import { METemplate } from '@melhorenvio/unbox';

const route = useRoute();
const avatarName = computed(() => 'Renata leal');

const pageDataAttr = computed(() => {
  return `page-${route.name}`
});

const authUser = useFirebaseUser();

const logOut = async () => {
  await signOutUser();
  return navigateTo('/login')
}

const sidebarSubitems = computed(() => {
  return authUser
    ? [
        {
        label: 'Sair',
        click: logOut
      }]
    : []
});

</script>