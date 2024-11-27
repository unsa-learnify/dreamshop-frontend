<template>
  <div>
    <label 
      v-if="label"
      class="tw-block" 
      :class="[$input?.hasError ? ' tw-text-error' : 'tw-text-primary']"
      @click="$input?.focus()"
    >{{ label }} 
    </label>
    <q-input 
      ref="$input"
      bg-color="white"
      v-model.trim="modelValue"
      :label="placeholder"
      :rules="rules"
      :min="min"
      :max="max"
      :type="type"
      :step="step"
      :clearable="clearable"
      hide-bottom-space
      no-error-icon
      clear-icon="close"
      dense
      outlined
      :maxlength="maxlength"
      :counter="!!maxlength"
      :debounce="debounce ? 300 : 0"
    >
      <template v-slot:append>
        <slot name="append">
        </slot>
      </template>
    </q-input>
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
import usePropAsModel from 'composables/usePropAsModel'

const props = defineProps({
  modelValue: String,
  label: String,
  type: String,
  step: String,
  min: String,
  max: String,
  placeholder: String,
  rules: Array,
  clearable: Boolean,
  debounce: Boolean,
  maxlength: Number,
})

const emit = defineEmits(['update:modelValue'])

const $input = ref(null)
const modelValue = usePropAsModel(props, emit)

</script>

<style>
.q-field__bottom{
  @apply tw-px-0;
  @apply tw-py-1;
}
</style>