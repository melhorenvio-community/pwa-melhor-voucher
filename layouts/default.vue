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
import logo from '/icons/logo.svg';
import iconLogoutOutlineIcon from '~icons/ion/log-out-outline';
import iconSettings from '~icons/ion/ios-settings';
import iconHome from '~icons/ion/home-outline';
import iconTicket from '~icons/ion/ticket';
import iosSettingsStrongIcon from '~icons/ion/ios-settings-strong';

const { $state, clearAll } = useUserStore();

const route = useRoute();

const avatarName = computed(() => {
  return $state.user?.name;
});

const sidebarItems = [
  {
    to: {
      name: 'index',
    },
    label: 'Página inicial',
    icon: iconHome,
  },
  {
    to: {
      name: 'rescue',
    },
    label: 'Cupons',
    icon: iconTicket,
  },
  {
    to: {
      name: 'settings',
    },
    label: 'Configurações',
    icon: iosSettingsStrongIcon,
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
        click: logOut,
        icon: iconLogoutOutlineIcon
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