<template>
  <div class="tw-flex tw-flex-col tw-gap-3">
    <div class="tw-flex tw-justify-between">
      <h3 class="tw-font-roboto-condensed tw-text-secondary tw-font-bold tw-text-base">{{ title }}</h3>
      <h-checkbox
        :model-value="all"
        @click="toggleAll"
      />
    </div>
    <h-checkbox
      v-for="option in options"
      :key="option.value"
      :model-value="modelValue.includes(option.value)"
      :label="option.label"
      @update:model-value="(checked) => updateOption(option.value, checked)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import usePropAsModel from 'composables/usePropAsModel'

import HCheckbox from 'components/custom/h-checkbox.vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { 
    type: Array, 
    required: true,
    default: () => []
  },
  label: String,
  title: String,
})

const emit = defineEmits(['update:modelValue'])

const modelValue = usePropAsModel(props, emit)

const all = computed({
  get() {
    if (modelValue.value.length === props.options.length) {
      return true; // Todas las opciones están seleccionadas
    } else if (modelValue.value.length === 0) {
      return false; // Ninguna opción está seleccionada
    } else {
      return null; // Algunas opciones están seleccionadas
    }
  },
  set(value) {
    modelValue.value = value === true ? props.options.map(option => option.value) : [];
  }
});

// Función para alternar la selección de todos los checkboxes
const toggleAll = () => {
  all.value = all.value !== true;
}

// Función para actualizar un checkbox específico
const updateOption = (value, checked) => {
  const newValue = checked
    ? [...modelValue.value, value]
    : modelValue.value.filter(item => item !== value);
  emit('update:modelValue', newValue);
}
</script>
