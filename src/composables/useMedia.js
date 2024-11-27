import { onBeforeUnmount, onMounted, ref } from "vue"

export default query => {
  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)
  const handler = e => matches.value = e.matches
  onMounted(() => mediaQuery.addEventListener('change', handler))
  onBeforeUnmount(() => mediaQuery.removeEventListener('change', handler))
  return matches
}