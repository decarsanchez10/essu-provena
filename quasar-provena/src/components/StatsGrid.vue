<template>
  <div id="sg">
    <div v-for="(stat, i) in stats" :key="i" class="st" ref="statEls">
      <div class="stn" :data-to="stat.to" :data-sf="stat.sf || ''">{{ stat.display || '0' }}</div>
      <div class="stl">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollAnimate } from '../composables/useScrollAnimate.js'

const stats = [
  { to: 0, label: 'Documents Notarized' },
  { to: 99, sf: '%', label: 'Uptime' },
  { display: '~3s', label: 'Avg. Confirmation' },
  { display: '0', label: 'Files Uploaded — Ever' },
]

const statEls = ref([])
useScrollAnimate(() => statEls.value, 'zoomIn', { duration: 600, stagger: 100, infinite: true })

onMounted(() => {
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target.querySelector('[data-to]')
        if (el && !el._counted) {
          el._counted = true
          const t = +el.dataset.to, sf = el.dataset.sf || ''
          let s = 0; const sp = t / 55
          const iv = setInterval(() => { s = Math.min(s+sp,t); el.textContent = Math.floor(s).toLocaleString()+sf; if(s>=t)clearInterval(iv) }, 16)
        }
      }
    })
  }, { threshold: 0.5 })
  statEls.value.forEach(el => co.observe(el))
})
</script>

<style scoped>
#sg { display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--gb) }
.st { background:var(--bg);padding:56px 44px;text-align:center;transition:background .35s }
.stn { font-family:var(--fd);font-size:clamp(2rem,4vw,3.4rem);font-weight:800;color:var(--g);line-height:1;letter-spacing:-2px;margin-bottom:8px }
.stl { font-family:var(--fd);font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--stat-label);transition:color .3s }
@media(max-width:960px){#sg{grid-template-columns:repeat(2,1fr)}}
</style>