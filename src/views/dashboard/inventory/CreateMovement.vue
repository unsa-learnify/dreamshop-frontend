<template>
  <q-dialog v-model="isOpened" persistent>
    <div class="tw-p-6 tw-shadow-md tw-bg-white tw-gap-4" style="width: 500px; max-width: 90vw;">
      <q-form 
        data-test="edit-form"
        class="tw-flex tw-flex-col tw-gap-6" 
        ref="$form" 
        @submit="onSubmit"
      >
        <h2 class="tw-text-xl tw-text-primary">Editar Producto</h2> <!-- NOTE: replaceable -->
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-4">
          <!-- NOTE: replaceable zone -->
          <h-input
            class="tw-col-span-full"
            v-model="nameField.value"
            :label="nameField.label"
            :rules="nameField.rules"
            :maxlength="255"
          />
          <h-select
            class="tw-col-span-full"
            v-model="productCategoryField.value"
            :label="productCategoryField.label"
            :options="productCategoryField.options"
            :rules="productCategoryField.rules"
            multiple
            use-chips
          />
          <h-select
            v-model="currencyField.value"
            :label="currencyField.label"
            :options="currencyField.options"
            :rules="currencyField.rules"
          />
          <h-input
            v-model="priceField.value"
            :label="priceField.label"
            :rules="priceField.rules"
            type="number"
            min="0"
            step="0.01"
          />
          <h-input
            class="tw-col-span-full"
            type="textarea"
            v-model="descriptionField.value"
            :label="descriptionField.label"
            :rules="descriptionField.rules"
            :maxlength="500"
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
            label="Guardar" 
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
import HSelect from 'components/custom/h-select.vue'

import ProductService from "services/product/product.service";
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
const codeField = reactive({
  label: 'Código *',
  value: null,
  rules: [
    value => value !== null && value !== '' || 'Código necesario' 
  ],
});
const productCategoryField = reactive({
  label: 'Categoría de Producto *',
  value: null,
  rules: [
    value => value.length > 0 || 'Categoría de Producto necesaria' 
  ],
});
const currencyField = reactive({
  label: 'Tipo de Moneda *',
  value: null,
  options: [
    { value: 'PEN', label: 'Nuevos Soles', disable: true },
    { value: 'EUR', label: 'Euros', disable: true },
    { value: 'USD', label: 'Dólares' },
  ],
  rules: [
    value => value !== null || 'Tipo de Moneda necesario' 
  ],
});
const priceField = reactive({
  label: 'Precio Unitario *',
  value: null,
  rules: [
    value => value !== null && value !== ''  || 'Precio Unitario necesario',
    value => value >= 0  || 'Precio Unitario debe ser mayor o igual que 0',
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

const onOpen = async () => {
  const [ productResponse, productCategoryResponse ] = await Promise.all([ ProductService.retrieve(props.data.id), ProductCategoryService.list({ page: 0, items: 100 }) ])
  if (productResponse.status) {
    nameField.value = productResponse.data.name
    codeField.value = productResponse.data.code
    productCategoryField.value = productResponse.data.categories.map(item => item.id)
    currencyField.value = productResponse.data.currency
    priceField.value = String(productResponse.data.unitPrice)  
    descriptionField.value = productResponse.data.description
  }
  if (productCategoryResponse.status) {
    productCategoryField.options = productCategoryResponse.data.items.map(item => ({ label: item.name, value: item.id }))
  }
}

const onClose = () => {
  /* NOTE: replaceable zone */
  nameField.value = null
  codeField.value = null
  productCategoryField.value = []
  currencyField.value = null
  priceField.value = null
  descriptionField.value = null
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
  formData.append('code', codeField.value);
  formData.append('currency', currencyField.value);
  formData.append('unitPrice', priceField.value);
  formData.append('description', descriptionField.value);
  /* NOTE: replaceable zone */
  const { status, data } = await ProductService.update(props.data.id, Object.fromEntries(formData)) /* NOTE: replaceable */
  submitButton.loading = false

  if (status){
    const response = await ProductService.assign(props.data.id, {
      "categoryIds": productCategoryField.value
    })
    if (response.status) {
      quasar.notify({ 
        type: 'my-successful', 
        message: 'Cambios registrados'
      })
      emit('created')
    }
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