<template>
  <div class="mw">
    <div class="mt2">
      <template v-for="i in 4" :key="i">
        <div v-for="word in words" :key="word+i" class="mi">
          <div class="d"></div>{{ word }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const words = [
  'Blockchain Notary','SHA-256 Hashing','Zero Upload Policy','Immutable Proof',
  'BCH Protocol','Instant Anchoring','Privacy First','Open Verification',
  'Cryptographic Truth','No Trust Required'
]
</script>

<style scoped>
.mw { overflow:hidden;padding:18px 0;border-top:1px solid var(--gb);border-bottom:1px solid var(--gb);background:var(--bgm);transition:background .35s,border-color .3s }
.mt2 { display:flex;width:max-content;animation:mq 24s linear infinite }
.mi { display:flex;align-items:center;gap:18px;padding:0 38px;font-family:var(--fd);font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--marquee-text);white-space:nowrap;transition:color .3s }
.d { width:4px;height:4px;background:var(--g);border-radius:50%;flex-shrink:0 }
</style>