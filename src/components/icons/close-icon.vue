<template>
  <svg :class="props.class" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.071 15.3033L4.69666 2.92896L2.92889 4.69672L15.3033 17.0711L17.071 15.3033Z"/>
    <path d="M15.3033 2.92898L2.92896 15.3033L4.69672 17.0711L17.0711 4.69674L15.3033 2.92898Z"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  class: String
})
</script>
  