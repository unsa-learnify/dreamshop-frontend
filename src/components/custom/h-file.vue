<template>
  <div>
    <label 
      v-if="label"
      class="tw-block" 
      :class="[$input?.hasError ? ' tw-text-error' : 'tw-text-primary']"
      @click="$input?.focus()"
    >
      {{ label }}
    </label>
    <q-file 
      ref="$input"
      dense
      outlined 
      bottom-slots 
      hide-bottom-space
      :counter="counter"
      :multiple="multiple"
      :max-files="maxFiles"
      v-model="modelValue" 
      :label="placeholder" 
      :rules="rules" 
      no-error-icon
      display-value
    >
      <template v-slot:file="{ file }">
        <q-chip dense removable @remove="remove(file)" size="13px">
          <div class="tw-truncate"> {{ file.name }}</div>
        </q-chip>
      </template>
    </q-file>
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
import usePropAsModel from 'composables/usePropAsModel'

const props = defineProps({
  modelValue: Object,
  label: String,
  placeholder: String,
  rules: Array,
  multiple: Boolean,
  counter: Boolean,
  maxFiles: Number,
})

const emit = defineEmits(['update:modelValue'])

const $input = ref(null)
const modelValue = usePropAsModel(props, emit)

const remove = (f) => {
  if (props.multiple) {
    modelValue.value = modelValue.value.filter(file => file.__key !== f.__key)
  }
  else{
    modelValue.value = null
  }
}
</script>

<style>
.q-field__bottom{
  @apply tw-px-0;
  @apply tw-py-1;
}
</style>