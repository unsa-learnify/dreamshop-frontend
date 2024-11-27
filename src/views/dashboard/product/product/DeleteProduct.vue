<template>
  <q-dialog v-model="isOpened" persistent>
    <div class="tw-p-6 tw-shadow-md tw-bg-white tw-gap-4 tw-w-[28rem]">
      <q-form 
        data-test="remove-form"
        class="tw-flex tw-flex-col tw-gap-6" 
        ref="$form" 
        @submit="onSubmit"
      >
        <h2 class="tw-text-2xl tw-text-primary">Eliminar Categoría de Producto</h2> <!-- NOTE: replaceable -->
        <p class="tw-mb-4">
          ¿Está seguro de que desea eliminar la categoría <b>{{ data.name }}</b>? <br>
          Esta acción no se puede deshacer y podría afectar a los productos registrados bajo esta categoría. 
        </p>  
        <!-- NOTE: replaceable -->
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
            :loading="submitButton.isLoading" 
            label="Confirmar" 
            type="submit" 
          />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { reactive, watch } from 'vue'

import usePropAsModel from 'composables/usePropAsModel'

import ProductCategoryService from "services/product/product-category.service"; /* NOTE: replaceable */

const props = defineProps({
  data: Object,
  opened: Boolean,
})

const emit = defineEmits(['update:opened', 'deleted'])

const quasar = useQuasar()

const isOpened = usePropAsModel(props, emit, 'opened')
const submitButton = reactive({ isLoading: false })

const onOpen = async () => {}

const onClose = () => {}

const onSubmit = async () => {
  submitButton.isLoading = true
  const { status, data } = await ProductCategoryService.delete(props.data.id) /* NOTE: replaceable */
  submitButton.isLoading = false
  if (status){
    quasar.notify({ 
      type: 'my-successful', 
      message: 'Eliminación exitosa'
    })
    emit('deleted')
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