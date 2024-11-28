<template>
  <q-toolbar class="tw-bg-white tw-text-primary tw-px-4 tw-py-2 tw-flex tw-justify-between tw-gap-2">
    <div class="tw-flex tw-items-center">
      <q-btn 
        outline
        dense
        icon="menu"
        aria-label="Menu"
        @click="$emit('changeDrawerState')"
      />
    </div>
    <div class="tw-flex tw-items-center tw-gap-2 tw-mr-auto md:tw-ml-2">
      <h1 class="tw-text-2xl tw-font-roboto tw-text-primary tw-font-bold">
        Dream<span class="tw-text-secondary">Shop</span>
      </h1>
    </div>
    <q-btn 
      class="tw-bg-primary tw-py-3 tw-rounded tw-text-white tw-text-xs"
      label="Cerrar sesión"
      @click="logout"
    />
  </q-toolbar>
</template>

<script setup>
import { useQuasar } from 'quasar'  
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/authStore'

//import AuthService from 'services/auth/auth.service' //TODO

const emit = defineEmits(['changeDrawerState'])

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  /* const responseAuth = await AuthService.logout(authStore.refreshToken.value)
  if(responseAuth.status){
    $q.notify({ 
      type: 'my-successful', 
      message: "Sesión ha finalizado" 
    })
  }
  else {
    $q.notify({ 
      type: 'my-error', 
      message: "Hubo un error"
    })
  } */
  $q.notify({ 
    type: 'my-successful', 
    message: "Sesión ha finalizado" 
  })
  authStore.removeTokens()
  router.push({ name: 'login-screen' })
}
</script>