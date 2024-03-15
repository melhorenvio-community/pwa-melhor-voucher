<template>
  <div class="page-settings max-w-2xl">
    <div class="flex flex-col h-full">
      <div
        class="grid grid-cols-1 gap-5 justify-center max-w-[336px] mt-0 m-auto items-center md:grid-cols-4 md:justify-start md:ml-0 md:mb-12">
        <MEAvatar class="user-avatar text-xl m-auto md:col-start-1 md:col-end-2" name="renata leal" hide-chevron />

        <dl class="m-auto text-center md:text-left md:col-start-2 md:col-end-4 w-full md:w-auto">
          <dt class="font-bold font-lato mb-2 text-base truncate w-full m-auto md:ml-0 max-w-full">{{ userName }}</dt>
           <dd class="font-lato text-base truncate w-full m-auto md:ml-0 max-w-full">{{ userEmail}}</dd>
        </dl>

        <MEButton  class="m-auto md:ml-0 md:col-start-2 md:col-end-4" alt>
          Editar perfil
        </MEButton>
      </div>

      <hr class="my-9 text-neutral-light md:hidden" />

      <div class="grid gap-5 mb-5 md:grid md:grid-cols-2 md:mb-12">

        <MEClickable to="/settings/credentials"
          class="flex grow py-6 px-5 justify-between md:flex-row md:py-4 text-neutral-dark bg-white border-[1px] rounded border-neutral-light">

          <MEInfoBlock class="info-block pr-5" title="Cadastrar biometria"
            text="Cadastre sua digital e torne seu login mais" />

          <div class="self-center">
            <iconFingerPrint class="text-lg text-primary" />
          </div>
        </MEClickable>

      </div>
    </div>
  </div>
</template>
<script setup>
import { MEButton, MEAvatar, MEInfoBlock, MEClickable } from '@melhorenvio/unbox';
import iconFingerPrint from '~icons/ion/finger-print';
import ionChevronRight from '~icons/ion/chevron-right';

const {
  $state,
} = useUserStore();

const userName =  computed(() => {
  return $state.user?.name;
});

const userEmail =  computed(() => {
  return $state.user?.email;
});

definePageMeta({
  middleware: ['auth']
});


</script>