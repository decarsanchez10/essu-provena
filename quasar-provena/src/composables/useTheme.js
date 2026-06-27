import { ref, watch } from 'vue'

const isDark = ref(true)

watch(isDark, (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}, { immediate: true })

export function useTheme() {
  function toggle() { isDark.value = !isDark.value }
  return { isDark, toggle }
}