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
import { useUserStore } from '~/stores/user';
import logo from '/logo.svg';

const { $state } = useUserStore();

const route = useRoute();
const avatarName = computed(() => $state.user?.name);

const sidebarItems = [
  {
    to: {
      name: 'index',
    },
    label: 'Página inicial',
    icon: '',
  },
  {
    to: {
      name: 'product',
    },
    label: 'Produtos',
    icon: '',
  },
  {
    to: {
      name: 'rescue',
    },
    label: 'Resgate',
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