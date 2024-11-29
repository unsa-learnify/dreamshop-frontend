<template>
  <q-dialog v-model="isOpened" persistent>
    <div class="tw-p-6 tw-shadow-md tw-bg-white tw-gap-4" style="width: 600px; max-width: 90vw;">
      <q-form 
        data-test="edit-form"
        class="tw-flex tw-flex-col tw-gap-6" 
        ref="$form" 
        @submit="onSubmit"
      >
        <h2 class="tw-text-xl tw-text-primary">Crear Usuario</h2> <!-- NOTE: replaceable -->
        <div class="tw-grid md:tw-grid-cols-2 tw-gap-4 tw-mb-4">
          <!-- NOTE: replaceable zone -->
          <h-input
            v-model="nameField.value"
            :label="nameField.label"
            :rules="nameField.rules"
            :maxlength="255"
          />
          <h-input
            v-model="lastnameField.value"
            :label="lastnameField.label"
            :rules="lastnameField.rules"
            :maxlength="255"
          />
          <h-input
            class="tw-col-span-full"
            v-model="usernameField.value"
            :label="usernameField.label"
            :rules="usernameField.rules"
            :maxlength="255"
          />
          <h-input
            v-model="emailField.value"
            :label="emailField.label"
            :rules="emailField.rules"
            :maxlength="255"
          />
          <h-input
            :label="passwordField.label"
            v-model="passwordField.value"
            :rules="passwordField.rules"
            :type="passwordField.isVisible ? 'text' : 'password'"
          >
            <template v-slot:append>
              <q-icon
                class="tw-cursor-pointer"
                :name="passwordField.isVisible ? 'visibility_off' : 'visibility'"
                @click="passwordField.isVisible = !passwordField.isVisible"
              />
            </template>
          </h-input>
          <!-- NOTE: replaceable zone -->
        </div>

        <div class="tw-flex tw-justify-end tw-gap-4">
          <q-btn 
            data-test="cancel-btn"
            class="tw-bg-decoration tw-text-primary tw-flex-1 tw-max-w-32"
            label="Cancelar"
            @click="isOpened = false"
          />
          <q-btn 
            data-test="submit-btn"
            class="tw-bg-primary tw-text-white tw-flex-1 tw-max-w-32"
            :loading="submitButton.loading" 
            :disable="submitButton.diable" 
            label="Crear" 
            type="submit" 
          />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { reactive, ref, watch } from 'vue'

import usePropAsModel from 'composables/usePropAsModel'

import HInput from 'components/custom/h-input.vue'

import UserService from "services/user/user.service";

const props = defineProps({
  data: Object,
  opened: Boolean,
})

const emit = defineEmits(['update:opened', 'created'])

const quasar = useQuasar()
const isOpened = usePropAsModel(props, emit, 'opened')

const $form = ref(null)

/* NOTE: replaceable zone */
const nameField = reactive({
  label: 'Nombre *',
  value: null,
  rules: [
    value => value !== null && value !== '' || 'Nombre necesario' 
  ],
});
const lastnameField = reactive({
  label: 'Apellido *',
  value: null,
  rules: [
    value => value !== null && value !== '' || 'Apellido necesario' 
  ],
});
const usernameField = reactive({
  label: 'Nombre de usuario *',
  value: null,
  rules: [
    value => value !== null && value !== '' || 'Nombre de usuario necesario' 
  ],
});
const emailField = reactive({
  label: 'Correo Electrónico *',
  value: null,
  rules: [
    value => value !== null && value !== '' || 'Correo Electrónico necesario',
    value => /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(value) || 'Correo electrónico inválido'
  ],
});
const passwordField = reactive({
  label: 'Contraseña',
  value: '',
  isVisible: false,
  rules: [ value => !!value || 'La contraseña es requerida' ]
})
/* NOTE: replaceable zone*/

const submitButton = reactive({ 
  loading: false, 
  diable: false 
})

const onOpen = async () => {}

const onClose = () => {
  /* NOTE: replaceable zone */
  nameField.value = null
  lastnameField.value = null
  usernameField.value = null
  emailField.value = null
  /* NOTE: replaceable zone */
}

const onSubmit = async () => {
  let isValid = await $form.value.validate()
  if (!isValid) 
    return

  submitButton.loading = true
  const formData = new FormData()
  /* NOTE: replaceable zone */
  formData.append('firstname', nameField.value);
  formData.append('lastname', lastnameField.value);
  formData.append('username', usernameField.value);
  formData.append('email', emailField.value);
  formData.append('password', passwordField.value);
  /* NOTE: replaceable zone */
  const { status, data } = await UserService.create(Object.fromEntries(formData)) /* NOTE: replaceable */
  submitButton.loading = false

  if (status){
    quasar.notify({ 
      type: 'my-successful', 
      message: 'Registro exitoso'
    })
    emit('created')
    isOpened.value = false
  }
  else{
    quasar.notify({ 
      type: 'my-error', 
      message: (typeof(data) === "string") ? data : data.message
    })
  }
}

watch(
  () => isOpened.value, 
  isOpened => isOpened ? onOpen() : onClose()
)
</script>