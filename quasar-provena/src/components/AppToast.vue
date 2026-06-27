<template>
  <div :class="['toast', visible ? 'on' : '', typeClass]">
    <div class="toast-icon" v-html="iconSvg"></div>
    <div class="toast-content">
      <span>{{ displayMessage }}</span>
    </div>
    <button class="toast-close" @click="visible = false">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({ message: String, trigger: Number })
const visible = ref(false)
let timer

const toastType = computed(() => {
  if (!props.message) return 'success'
  if (props.message.startsWith('ERR:')) return 'destructive'
  if (props.message.startsWith('WARN:')) return 'warning'
  if (props.message.startsWith('INFO:')) return 'info'
  if (props.message.startsWith('PRI:')) return 'primary'
  return 'success'
})

const displayMessage = computed(() => {
  if (!props.message) return ''
  return props.message.replace(/^(ERR|WARN|INFO|PRI):/, '')
})

const typeClass = computed(() => `toast-${toastType.value}`)

const iconSvg = computed(() => {
  switch (toastType.value) {
    case 'primary': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>'
    case 'destructive': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'
    case 'warning': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11H8v-2h8v2z"/></svg>'
    case 'info': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'
    default: return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
  }
})

watch(() => props.trigger, () => {
  visible.value = true
  clearTimeout(timer)
  timer = setTimeout(() => visible.value = false, 4000)
})
</script>

<style scoped>
.toast {
  position: fixed; bottom: 30px; right: 30px; z-index: 2000;
  padding: 16px 20px;
  border-radius: 12px; font-family: var(--fd);
  font-size: 1rem; font-weight: 500;
  box-shadow: 0 10px 30px rgba(0,0,0,.35);
  transform: translateX(140%);
  transition: transform .4s cubic-bezier(.34,1.56,.64,1);
  display: flex; align-items: center; gap: 14px;
  min-width: 320px;
  max-width: 450px;
}
.toast.on { transform: translateX(0); }

.toast-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.toast-content { flex: 1; display: flex; align-items: center; }

.toast-close {
  background: transparent; border: none; color: inherit;
  opacity: 0.7; cursor: pointer; display: flex; align-items: center; justify-content: center;
  padding: 4px; border-radius: 4px; transition: opacity 0.2s; flex-shrink: 0;
}
.toast-close:hover { opacity: 1; background: rgba(0,0,0,0.1); }

/* Types based on reference image */
.toast-primary { background: #f3f4f6; color: #111827; }
.toast-primary .toast-close:hover { background: rgba(0,0,0,0.05); }

.toast-success { background: #10b981; color: #ffffff; }
.toast-destructive { background: #ef4444; color: #ffffff; }
.toast-info { background: #8b5cf6; color: #ffffff; }
.toast-warning { background: #f59e0b; color: #ffffff; }
</style>