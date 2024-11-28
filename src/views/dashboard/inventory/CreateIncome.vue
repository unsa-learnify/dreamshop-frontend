<template>
  <q-dialog v-model="isOpened" persistent>
    <div class="tw-p-6 tw-shadow-md tw-bg-white tw-gap-4" style="width: 400px; max-width: 90vw;">
      <q-form 
        data-test="edit-form"
        class="tw-flex tw-flex-col tw-gap-6" 
        ref="$form" 
        @submit="onSubmit"
      >
        <h2 class="tw-text-xl tw-text-primary">Ingresar Productos</h2> <!-- NOTE: replaceable -->
        <div class="tw-grid tw-gap-4 tw-mb-4">
          <!-- NOTE: replaceable zone -->
          <h-select
            v-model="productField.value"
            :label="productField.label"
            :options="productField.options"
            :rules="productField.rules"
            readonly
          />
          <h-input
            v-model="quantityField.value"
            :label="quantityField.label"
            :rules="quantityField.rules"
            type="number"
            min="1"
            step="1"
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
import { exportFile, useQuasar } from 'quasar'
import { reactive, ref, watch } from 'vue'

import usePropAsModel from 'composables/usePropAsModel'

import HInput from 'components/custom/h-input.vue'
import HSelect from 'components/custom/h-select.vue'

import ProductService from "services/product/product.service";
import { format } from 'date-fns'

const props = defineProps({
  data: Object,
  opened: Boolean,
})

const emit = defineEmits(['update:opened', 'created'])

const quasar = useQuasar()
const isOpened = usePropAsModel(props, emit, 'opened')

const $form = ref(null)

/* NOTE: replaceable zone */
const productField = reactive({
  label: 'Producto *',
  value: null,
  rules: [
    value => value !== null || 'Producto necesario' 
  ],
});
const quantityField = reactive({
  label: 'Cantidad *',
  value: null,
  rules: [
    value => value !== null && value !== ''  || 'Cantidad necesario',
    value => value >= 0  || 'Cantidad debe ser mayor o igual que 0',
  ],
});
/* NOTE: replaceable zone*/

const submitButton = reactive({ 
  loading: false, 
  diable: false 
})

const onOpen = async () => {
  const [ productResponse ] = await Promise.all([ ProductService.retrieve(props.data.id) ])
  if (productResponse.status) {
    productField.options = [{ label: productResponse.data.name, value: productResponse.data.id }]
    productField.value = productResponse.data.id
  }
}

const onClose = () => {
  /* NOTE: replaceable zone */
  productField.value = null
  quantityField.value = null
  /* NOTE: replaceable zone */
}

const generarNotaIngreso = ({
    producto,
    cantidad,
    formatoFecha = 'yyyy-MM-dd HH:mm:ss',
    opcionesFecha = {}
}) =>  {
  console.log(producto);
    return `
**NOTA DE INGRESO - INVENTARIO**

------------------------------------------------------------
**Nombre del Producto:** ${producto.name}
**Descripción:** ${producto.description}
**Código:** ${producto.code}
**Precio Unitario:** ${producto.unitPrice.toFixed(2)} ${producto.currency}
**Cantidad Ingresada:** ${cantidad} unidades

------------------------------------------------------------
**Categorías Asociadas:**
${producto.categories
.map(
    (cat, index) =>
        `${index + 1}. ${cat.name}\n   - Descripción: ${cat.description}`
)
.join('\n\n')}

------------------------------------------------------------
**Fecha de Creación:** ${format(new Date(producto.createdAt), formatoFecha, opcionesFecha)}
**Última Actualización:** ${format(new Date(producto.updatedAt), formatoFecha, opcionesFecha)}`.trim();
}

const onSubmit = async () => {
  let isValid = await $form.value.validate()
  if (!isValid) 
    return

  submitButton.loading = true
  const formData = new FormData()
  /* NOTE: replaceable zone */
  formData.append('quantity', Number(props.data.quantity) + Number(quantityField.value));
  /* NOTE: replaceable zone */
  const { status, data } = await ProductService.update(props.data.id, Object.fromEntries(formData)) /* NOTE: replaceable */
  submitButton.loading = false

  if (status){
   
    const filename = `Nota de ingreso ${format(new Date(), 'yyyy-MM-dd')}.txt`; 
    const content = generarNotaIngreso({ 
      producto: props.data, 
      cantidad: quantityField.value,
      formatoFecha: 'dd/MM/yyyy HH:mm'
    })
    exportFile(filename, content);
    quasar.notify({ 
      type: 'my-successful', 
      message: 'Cambios registrados'
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