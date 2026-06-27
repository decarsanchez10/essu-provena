<template>
  <div>
    <div id="cur" :style="curStyle"></div>
    <div id="cur2" :style="cur2Style"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mx = ref(0), my = ref(0), rx = ref(0), ry = ref(0)

const curStyle = ref({ left: '0px', top: '0px' })
const cur2Style = ref({ left: '0px', top: '0px' })

let rafId

function onMouseMove(e) {
  mx.value = e.clientX
  my.value = e.clientY
  curStyle.value = { left: mx.value + 'px', top: my.value + 'px' }
}

function animate() {
  rx.value += (mx.value - rx.value) * 0.1
  ry.value += (my.value - ry.value) * 0.1
  cur2Style.value = { left: rx.value + 'px', top: ry.value + 'px' }
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  animate()
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
#cur {
  position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
  width: 12px; height: 12px; background: var(--g); border-radius: 50%;
  transform: translate(-50%, -50%); mix-blend-mode: screen;
}
#cur2 {
  position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998;
  width: 38px; height: 38px; border: 1px solid rgba(34,197,94,.4); border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>
