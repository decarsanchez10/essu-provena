<template>
  <div>
    <!-- CTA with video background — always dark overlay so video is always visible -->
    <section id="cta">
      <!-- HLS video background -->
      <video ref="videoEl" class="cta-video" autoplay muted loop playsinline crossorigin="anonymous"></video>
      <div class="cta-overlay"></div>
      <!-- Content -->
      <div class="cta-content" ref="ctaEl">
        <div class="sl2" style="justify-content:center;color:#86EFAC">Get Started</div>
        <h2 class="ctah">Your Document.<br><span class="out">Immortalized.</span></h2>
        <p>Notarize your first document in under 60 seconds.</p>
        <router-link to="/notarize" class="btn-p">Start Notarizing</router-link>
      </div>
    </section>

    <footer>
      <router-link to="/" class="logo">PR<span class="coin">₿</span>VENA</router-link>
      <ul class="fl">
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/notarize">Notarize</router-link></li>
        <li><router-link to="/verify">Verify</router-link></li>
        <li><router-link to="/terms">Terms</router-link></li>
      </ul>
      <div class="fc">© 2026 Provena · Blockchain Document Notary</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollAnimate } from '../composables/useScrollAnimate.js'

const ctaEl = ref(null)
const videoEl = ref(null)
const HLS_SRC = 'https://stream.mux.com/Kec29dVyJgiPdtWaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8'

useScrollAnimate(() => ctaEl.value, 'zoomOut', { duration: 900, infinite: true })

onMounted(async () => {
  const video = videoEl.value
  if (!video) return

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = HLS_SRC
    video.play().catch(() => {})
    return
  }

  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.12/hls.min.js'
  script.onload = () => {
    if (window.Hls?.isSupported()) {
      const hls = new window.Hls()
      hls.loadSource(HLS_SRC)
      hls.attachMedia(video)
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}))
    }
  }
  document.head.appendChild(script)
})
</script>

<style scoped>
/* CTA — video fills entire section, always shown regardless of theme */
#cta {
  position: relative;
  padding: 140px 64px;
  text-align: center;
  overflow: hidden;
  isolation: isolate;
}

/* Video fills the CTA section */
.cta-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
  /* mix-blend-mode: screen removes black from video */
  mix-blend-mode: screen;
}

/* Semi-dark overlay — keeps text legible, doesn't block video */
.cta-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.52);
}

/* All content sits above video + overlay */
.cta-content {
  position: relative;
  z-index: 2;
}

.ctah {
  font-family: var(--fd); font-size: clamp(2.2rem,5vw,4.4rem); font-weight: 800;
  letter-spacing: -2px; line-height: 1; margin-bottom: 22px; color: #FFFFFF;
}
.ctah .out { -webkit-text-stroke: 1.5px #22C55E; color: transparent; }
#cta p {
  font-size: 1rem; font-weight: 400; color: #C8DCC9;
  max-width: 380px; margin: 18px auto 34px; line-height: 1.7; font-family: var(--fd);
}

/* Footer — theme-aware */
footer {
  padding: 56px 64px;
  border-top: 1px solid var(--gb);
  background: var(--bg);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 22px;
  transition: background .35s, border-color .3s;
}
.logo {
  font-family: var(--fd); font-size: 1.25rem; font-weight: 800; letter-spacing: -.4px;
  color: var(--tx); text-decoration: none; display: flex; align-items: center; transition: color .3s;
}
.fl { display: flex; gap: 26px; list-style: none; }
.fl a { font-size: .82rem; color: var(--footer-link); text-decoration: none; font-family: var(--fd); font-weight: 500; transition: color .2s; }
.fl a:hover { color: var(--g); }
.fc { font-size: .74rem; color: var(--footer-copy); letter-spacing: .05em; font-family: var(--fd); transition: color .3s; }

@media(max-width:960px) {
  #cta { padding: 100px 22px; }
  footer { padding: 38px 22px; flex-direction: column; }
}
</style>