<template>
  <q-checkbox 
    class="tw-text-primary"
    v-model="modelValue" 
    :val="val"
    size="44px" 
    dense 
  >
    <span class="tw-text-sm">{{ label }}</span>
  </q-checkbox>
</template>
  
<script setup>
import usePropAsModel from 'composables/usePropAsModel'

const props = defineProps({
  modelValue: [ 
    Array, 
    Boolean 
  ],
  label: String,
  val: String,
})

const emit = defineEmits(['update:modelValue'])

const modelValue = usePropAsModel(props, emit)
</script>

<style>
.q-checkbox__bg{
  background-color: white;
}
</style>