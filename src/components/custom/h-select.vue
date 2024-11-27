<template>
  <div>
    <label 
      v-if="label"
      class="tw-block" 
      :class="[$input?.hasError ? ' tw-text-error' : 'tw-text-primary']"
      @click="$input?.focus()"
    >{{ label }}
    </label>
    <q-select
      ref="$input"
      bg-color="white"
      v-model="modelValue"
      :label="placeholder"
      :rules="rules"
      :options="options"
      :clearable="clearable"
      :disable="disable"
      :multiple="multiple"
      clear-icon="close"
      :use-input="useInput"
      :use-chips="useChips"
      input-debounce="300"
      @filter="filter"
      options-dense
      hide-bottom-space
      no-error-icon
      :emit-value="!valueFull"
      map-options
      outlined
      dense
    >
      <template #selected-item="scope" v-if="useChips">
        <q-chip
          class="tw-max-w-44 sm:tw-max-w-60 md:tw-max-w-80 lg:tw-max-w-96"
          :removable="scope.opt.removable"
          dense
          @remove="scope.removeAtIndex(scope.index)"
          :tabindex="scope.tabindex"
        >
          <q-avatar 
            v-if="scope.opt.icon"
            class="tw-bg-primary"
          >
            <img :src="scope.opt.icon">
          </q-avatar>
          <span class="tw-truncate">{{ scope.opt.label }}</span>
        </q-chip>
      </template>
      <template #no-option>
        <q-item>
          <q-item-section>
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
import usePropAsModel from 'composables/usePropAsModel'

const props = defineProps({
  modelValue: [ Object, Boolean, Number, String ],
  options: Array,
  label: String,
  placeholder: String,
  rules: Array,
  clearable: Boolean,
  disable: Boolean,
  multiple: Boolean,
  valueFull: Boolean,
  useInput: Boolean,
  useChips: Boolean,
  filter: Function,
})

const emit = defineEmits(['update:modelValue'])

const $input = ref(null)
const modelValue = usePropAsModel(props, emit)

</script>

<style>
.q-field__bottom{
  @apply tw-px-0;
}
</style>