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
import logo from '~/public/icons/logo.svg';

const { $state, clearAll } = useUserStore();

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

const logOut = async () => {
  await clearAll();
  await signOutUser();
  return navigateTo('/login');
}

</script>