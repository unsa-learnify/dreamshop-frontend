<template>
  <svg :class="props.class" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M19 3H1V16.5H19V3ZM17.2 14.7V7.4577L10 13.782L2.8 7.45051V14.7H17.2ZM10 11.3862L17.2 5.06191V4.8H2.8V5.05291L10 11.3862Z"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  class: String
})
</script>
  