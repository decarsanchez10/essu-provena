<template>
  <section class="sec" id="how">
    <div class="hs" ref="headingEl">
      <div class="sl2">Process</div>
      <h2 class="sh2">Four Steps to<br>Permanent Proof</h2>
      <p class="sp">Your file never leaves your device. Provena creates a cryptographic fingerprint and embeds it forever in the blockchain.</p>
    </div>
    <div v-if="hydrated">
      <div v-for="(step, i) in steps" :key="i" class="step" ref="stepEls">
        <div class="sn">{{ String(i+1).padStart(2,'0') }}</div>
        <div class="sb">
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollAnimate } from '../composables/useScrollAnimate.js'

const steps = [
  { title: 'Select Your Document', desc: 'Drag any file or click to browse. Everything is processed locally — nothing is ever uploaded to our servers.' },
  { title: 'Generate a Hash', desc: 'A SHA-256 cryptographic fingerprint is instantly generated. This unique hash is your document\'s permanent digital identity.' },
  { title: 'Anchor to Blockchain', desc: 'Send a micro-transaction to embed your hash. The timestamp becomes your irrefutable, immutable proof of existence.' },
  { title: 'Verify Anytime, Forever', desc: 'Share your hash with anyone. They can independently verify authenticity using any block explorer — no trust in Provena needed.' },
]

const headingEl = ref(null)
const stepEls = ref([])

const hydrated = ref(false)
onMounted(() => {
  hydrated.value = true
  useScrollAnimate(() => headingEl.value, 'fadeLeft', { duration: 800, infinite: true })
  useScrollAnimate(() => stepEls.value, 'slideUp', { duration: 700, stagger: 120, infinite: true })
})
</script>

<style scoped>
section { display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;background:var(--bg);transition:background .35s }
.hs { position:sticky;top:130px }
.step { display:flex;gap:22px;padding:30px 0;border-bottom:1px solid var(--gb);transition:border-color .3s }
.sn { font-family:var(--fd);font-size:.72rem;font-weight:700;letter-spacing:.1em;color:var(--g);width:28px;padding-top:3px;flex-shrink:0 }
.sb h3 { font-family:var(--fd);font-size:1.1rem;font-weight:700;letter-spacing:-.2px;margin-bottom:7px;color:var(--step-h3);transition:color .3s }
.sb p { font-size:.9rem;color:var(--step-p);line-height:1.65;transition:color .3s }
@media(max-width:960px){section{grid-template-columns:1fr;gap:40px}.hs{position:static}}
</style>