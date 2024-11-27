<template>
  <div class="tw-h-screen tw-w-screen tw-flex tw-items-center tw-bg-decoration">
    <div class="tw-container">
      <q-form
        class="tw-shadow-md tw-bg-white tw-max-w-80 tw-mx-auto tw-p-8"
        ref="$form"
        @submit="onSubmit"
      >
        <div class="tw-grid tw-gap-4 tw-mb-8">
          <div class="tw-flex tw-items-center tw-space-x-4">
            <div class="tw-w-12 tw-h-12 tw-bg-primary tw-rounded-full tw-flex tw-items-center tw-justify-center tw-shadow-lg">
              <span class="tw-text-white tw-font-bold tw-text-xl">DS</span>
            </div>
            <h1 class="tw-text-4xl tw-font-roboto tw-text-primary tw-font-bold">
              Dream<span class="tw-text-secondary">Shop</span>
            </h1>
          </div>
          <h-input
            :label="fields.username.label"
            v-model="fields.username.value"
            :rules="fields.username.rules"
          />
          <h-input
            :label="fields.password.label"
            v-model="fields.password.value"
            :rules="fields.password.rules"
            :type="fields.password.isVisible ? 'text' : 'password'"
          >
            <template v-slot:append>
              <q-icon
                class="tw-cursor-pointer"
                :name="fields.password.isVisible ? 'visibility_off' : 'visibility'"
                @click="fields.password.isVisible = !fields.password.isVisible"
              />
            </template>
          </h-input>
        </div>
        <q-btn
          class="tw-bg-primary tw-text-white tw-w-full"
          :loading="form.isSubmitting"
          label="Ingresar"
          type="submit"
        />
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'

import HInput from 'components/custom/h-input.vue'

import AuthService from "services/auth/auth.service";

const quasar = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  ref: null,
  isLoading: false,
  isSubmitting: false,
})

const fields = reactive({
  username: {
    label: 'Nombre de usuario',
    value: '',
    rules: [ value => !!value || 'El nombre de usuario es requerido' ]
  },
  password: {
    label: 'Contraseña',
    value: '',
    isVisible: false,
    rules: [ value => !!value || 'La contraseña es requerida' ]
  }
})

const onSubmit = async () => {
  form.isLoading = true;
  const responseAuth = await AuthService.login({
    username: fields.username.value,
    password: fields.password.value,
  });
  console.log(responseAuth);
  if (responseAuth.status) {
    const {
      access_token,
      expires_in,
      refresh_token,
      refresh_expires_in,
    } = responseAuth.data
    authStore.setAccessToken({
      value: access_token, 
      expires: expires_in
    });
    authStore.setRefreshToken({
      value: refresh_token, 
      expires: refresh_expires_in
    });
    quasar.notify({
      type: "my-successful",
      message: "Bienvenido",
    });
    router.push({ name: 'inventory-dashboard' })
  }
  else {
    console.log({ error: responseAuth.data });
    quasar.notify({
      type: "my-error",
      message: "Hubo un error",
    });
  }
  form.isLoading = false;
};
</script>