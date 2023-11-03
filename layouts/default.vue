<template>
  <div class="overflow-hidden min-h-screen" :data-page-name="pageDataAttr">

    <METemplate 
      ref="templateRef" 
      :logo="{ src: logo }"
      :sidebar-items="sidebarItems"
      v-bind="{
        avatarName,
        sidebarSubitems
      }"
    >
      <slot />
    </METemplate>

    <PwaInstallPrompt />
  </div>
</template>

<script setup>
import { METemplate } from '@melhorenvio/unbox';
import logo from '/logo.svg';

const route = useRoute();
const avatarName = computed(() => 'Renata leal');

const sidebarItems = [
  {
    to: {
      name: 'index',
    },
    label: 'index',
    icon: '',
  },
  {
    to: {
      name: 'product',
    },
    label: 'produtos',
    icon: '',
  },
]

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
      }
      ]
    : []
});

</script>