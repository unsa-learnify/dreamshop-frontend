<template>
  <q-expansion-item
    header-class="tw-p-0 tw-rounded"
    :default-opened="isOpened"
    hide-expand-icon
    dense
    active-class="tw-font-bold"
  >
    <template #header="{ expanded }">
      <div 
        class="tw-w-full tw-flex tw-items-center tw-p-2 tw-rounded tw-gap-4"
        :class="expanded ? 'tw-bg-primary-light' : 'tw-bg-primary'"
      >
        <component :is="iconComponent" class="tw-w-6 tw-fill-white"/>
        <span class="tw-font-roboto-condensed tw-flex-1">{{ label }}</span>
        <Icon.DownArrowIcon
          class="tw-w-6 tw-fill-white tw-transition-all" 
          :class="[expanded ? 'tw-rotate-180' : 'tw-rotate-0']"
        />
      </div>
    </template>

    <template #default>
      <div class="tw-flex tw-flex-col tw-gap-1 tw-mt-1 tw-border-l-[1px] tw-ml-[19.5px] tw-pl-[19.5px]">
        <slot></slot>
      </div>
    </template>
  </q-expansion-item>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'

import * as Icon from 'components/icons'

const props = defineProps({
  routeNames: Array,
  iconComponent: Object,
  label: String,
})

const route = useRoute()

const isOpened = computed(() => props.routeNames.includes(route.name))
</script>