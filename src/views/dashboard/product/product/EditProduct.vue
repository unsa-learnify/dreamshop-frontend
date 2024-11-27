<template>
  <q-dialog v-model="isOpened" persistent>
    <div class="tw-p-6 tw-shadow-md tw-bg-white tw-gap-4 tw-w-[36rem]">
      <q-form 
        data-test="create-form"
        class="tw-flex tw-flex-col tw-gap-6" 
        ref="$form" 
        @submit="onSubmit"
      >
        <h2 class="tw-text-2xl tw-text-secondary">Editar concepto de descuento</h2>
        <div class="tw-grid sm:tw-grid-cols-2 tw-gap-4 tw-mb-8">
          <h-input 
            data-test="name-input"
            class="tw-col-span-full"
            v-model="nameField.value"
            :label="nameField.label"
            :rules="nameField.rules"
          />
          <h-input 
            data-test="description-input"
            class="tw-col-span-full"
            v-model="descriptionField.value"
            :label="descriptionField.label"
            :rules="descriptionField.rules"
          />
          <!--Concepto de Deuda (desde debtConcept) -->
          <h-select  
            data-test="debt-concept-select"
            class="tw-col-span-full"
            v-model="debtConceptField.value"
            :label="debtConceptField.label"
            :options="debtConceptField.options"
            :rules=  "debtConceptField.rules"
            clearable
          />

          <!--Tipo (porcentaje/ Fijo) -->
          <h-select
            data-test="type-select"
            v-model= "typeField.value"
            :label=  "typeField.label"
            :options="typeField.options"
            clearable
          />
          <!-- Valor (if(porcentaje): porcentaje; else monto    )-->
          <h-input
            data-test="value-select"
            v-model= "valueField.value"
            :label=  "valueField.label"
            :rules=  "valueField.rules"
          />
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
            :loading="submitButton.isLoading" 
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

import DebtConceptService from "services/payment/debt-category.service"
import DiscountConceptService from "services/payment/discount-category.service"

const props = defineProps({
  data: Object,
  opened: Boolean,
})

const emit = defineEmits(['update:opened', 'created'])

const $q = useQuasar()
const isOpened = usePropAsModel(props, emit, 'opened')

const $form = ref(null)

const nameField = reactive({ 
  label: 'Nombre*',
  value: null,
  rules: [ v => v !== null && v !== '' || 'Nombre necesario' ],
})
const descriptionField = reactive({ 
  label: 'Descripcion *',
  value: null,
  rules: [ v => v !== null && v !== '' || 'Descripcion necesaria' ],
})

const debtConceptField = reactive({ 
  label: 'Concepto de deuda *',
  options: [],
  value: null,
  rules: [ v => v !== null || 'Tipo necesario' ],

})
const typeField = reactive({ 
  label: 'Tipo',
  options: [
    { label: 'Porcentual', value: true, },
    { label: 'Fijo', value: false, },

  ],
  value: null,
})
const valueField = reactive({ 
  label: 'Valor',
  value: null,
  rules: [ v => v !== null && v !== '' || 'Valor necesario' ],
})

const submitButton = reactive({ isLoading: false })

const onOpen = async () => {
  const [ debtConcept ] = await Promise.all([DebtConceptService.list()])
  if (debtConcept.status) {
    debtConceptField.options =debtConcept.data.results.map(item => ({
      value: item.id,
      label: item.nombre,
    }))
  }
  const { status, data } = await DiscountConceptService.retrive(props.data.id)
  if (status) {
    nameField.value = data.nombre
    descriptionField.value = data.descripcion
    debtConceptField.value = data.tipo_deuda
    typeField.value = data.is_porcentaje
    if(typeField.value){ //Si is_porcentaje = true
      valueField.value = data.porcentaje
    }
    else{
      valueField.value = data.monto
    }
  }
  submitButton.isDisable = false


}
const onClose = () => {
  nameField.value = null
  descriptionField.value = null
  debtConceptField.value= null
  typeField.value= null
  valueField.value= null
  
}

const onSubmit = async () => {
  let isValid = await $form.value.validate()
  if (!isValid) 
    return
  submitButton.isLoading = true
  const formData = new FormData()
  formData.append("nombre", nameField.value ?? '')
  formData.append("descripcion", descriptionField.value ?? '')
  formData.append("tipo_deuda", debtConceptField.value)
  formData.append("is_porcentaje", typeField.value ?? '')

  if(typeField.value){ //Si is_porcentaje = true
    formData.append("porcentaje", valueField.value ?? '')
  }
  else{
    formData.append("monto", valueField.value ?? '')
  }


  const { status, data } = await DiscountConceptService.update(props.data.id,formData)
  submitButton.isLoading = false

  if (status){
    $q.notify({ 
      type: 'my-successful', 
      message: 'Cambios en concepto de descuento registrados'
    })
    emit('updated')
    isOpened.value = false
  }
  else{
    $q.notify({ 
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