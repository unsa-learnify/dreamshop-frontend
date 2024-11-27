<template>
  <svg
    :class="props.class"
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5.9895 9.70181L11.9999 15.7122L18.0103 9.70181L16.5961 8.2876L11.9999 12.8838L7.40372 8.2876L5.9895 9.70181Z"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  class: String
})
</script>