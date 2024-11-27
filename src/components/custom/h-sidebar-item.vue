<template>
  <q-item 
    class="tw-p-2 tw-rounded tw-flex tw-items-center"
    :class="[ routeName === route.name ? 'tw-bg-white' : 'tw-bg-primary' ]"
    clickable 
    @click="router.push({ name: routeName })"
    dense
  >
    <component :is="iconComponent" 
      class="tw-w-6 tw-h-6 tw-mr-4"
      :class="[ routeName === route.name ? 'tw-fill-primary' : 'tw-fill-white' ]"
    />
    <span 
      class="tw-font-roboto-condensed tw-flex-1"
      :class="[ routeName === route.name ? 'tw-text-primary' : 'tw-text-white' ]"
    >
      {{ label }}
    </span>
  </q-item>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  routeName: String,
  label: String,
  iconComponent: Object,
})

const route = useRoute()
const router = useRouter()
</script>