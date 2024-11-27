<template>
  <q-dialog v-model="isOpened" persistent>
    <div class="tw-p-6 tw-shadow-md tw-bg-white tw-gap-4" style="width: 500px; max-width: 90vw;">
      <q-form 
        data-test="edit-form"
        class="tw-flex tw-flex-col tw-gap-6" 
        ref="$form" 
        @submit="onSubmit"
      >
        <h2 class="tw-text-xl tw-text-primary">Crear Categoría de Producto</h2> <!-- NOTE: replaceable -->
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-4">
          <!-- NOTE: replaceable zone -->
          <h-input
            class="tw-col-span-full"
            data-test="reference-input"
            v-model="nameField.value"
            :label="nameField.label"
            :rules="nameField.rules"
            :maxlength="255"
            filled
          />
          <h-input
            class="tw-col-span-full"
            data-test="reference-input"
            type="textarea"
            v-model="descriptionField.value"
            :label="descriptionField.label"
            :rules="descriptionField.rules"
            :maxlength="500"
            filled
          />
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

import ProductCategoryService from "services/product/product-category.service";

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
const descriptionField = reactive({
  label: 'Descripción',
  value: null,
  rules: [],
});
/* NOTE: replaceable zone*/

const submitButton = reactive({ 
  loading: false, 
  diable: false 
})

const onOpen = async () => {}

const onClose = () => {
  /* NOTE: replaceable zone */
  nameField.value = null;
  descriptionField.value = null;
  /* NOTE: replaceable zone */
}

const onSubmit = async () => {
  let isValid = await $form.value.validate()
  if (!isValid) 
    return

  submitButton.loading = true
  const formData = new FormData()
  /* NOTE: replaceable zone */
  formData.append('name', nameField.value);
  formData.append('description', descriptionField.value);
  /* NOTE: replaceable zone */
  const { status, data } = await ProductCategoryService.create(Object.fromEntries(formData)) /* NOTE: replaceable */
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
      message: (typeof(data) === "string") 
        ? data 
        : Object.values(data).flatMap(values => values).join(" ")
    })
  }
}

watch(
  () => isOpened.value, 
  isOpened => isOpened ? onOpen() : onClose()
)
</script>