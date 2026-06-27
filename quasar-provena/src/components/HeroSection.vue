<template>
  <section id="hero">
    <video id="hv"
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_094440_a3592600-bd1e-49e5-9bce-a73662061d83.mp4"
      autoplay muted loop playsinline preload="auto" ref="vid">
    </video>
    <div class="ov1"></div>
    <div class="ov2"></div>
    <div class="ov3"></div>
    <div class="hc">
      <h1 class="hh1">Prove What<br><span class="out">You Own</span>,<br><span class="hi">Forever.</span></h1>
      <p class="hp">Anonymously notarize any document on the blockchain. Immutable, cryptographic proof — no intermediaries.</p>
      <div class="hbtns">
        <a href="#notarize" class="btn-p" @click.prevent="scrollTo('notarize')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          Notarize a Document
        </a>
        <a href="#how" class="btn-o-hero" @click.prevent="scrollTo('how')">How It Works</a>
      </div>
    </div>
    
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const vid = ref(null)

function scrollTo(id) { 
  // If on home page, scroll to section
  if (router.currentRoute.value.path === '/') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    // Otherwise navigate home and scroll after navigation
    router.push('/').then(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    })
  }
}

onMounted(() => {
  if (vid.value) {
    vid.value.muted = true
    const pr = vid.value.play()
    if (pr instanceof Promise) pr.catch(() => document.addEventListener('click', () => vid.value?.play(), { once: true }))
  }
})
</script>

<style scoped>
#hero { position:relative;height:100vh;min-height:680px;display:flex;align-items:center;justify-content:center;overflow:hidden }
#hv { position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:0 }
/* Hero overlays are ALWAYS dark — video background means text must always be white */
.ov1 { position:absolute;inset:0;z-index:1;background:rgba(0,0,0,.45) }
.ov2 { position:absolute;inset:0;z-index:2;background:linear-gradient(to bottom,rgba(0,0,0,.1) 0%,transparent 35%,rgba(0,0,0,.55) 75%,rgba(0,0,0,.85) 100%) }
.ov3 { position:absolute;inset:0;z-index:3;background:radial-gradient(ellipse 80% 55% at 50% 38%,rgba(34,197,94,.07),transparent) }
.hc { position:relative;z-index:10;text-align:center;padding:0 20px }
.htag {
  display:inline-flex;align-items:center;gap:8px;font-family:var(--fd);
  font-size:.75rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:#86EFAC;border:1px solid rgba(134,239,172,.35);padding:6px 16px;border-radius:100px;
  margin-bottom:30px;background:rgba(34,197,94,.15);backdrop-filter:blur(8px);
  opacity:0;animation:up .8s .15s forwards;
}
.d { width:6px;height:6px;background:#22C55E;border-radius:50%;animation:blink 1.4s infinite }
@keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
/* Hero text is always white — it sits on a dark video overlay in both modes */
.hh1 {
  font-family:var(--fd);font-size:clamp(3rem,8.5vw,7.2rem);font-weight:900;
  line-height:.9;letter-spacing:-3px;color:#FFFFFF;margin-bottom:30px;
  opacity:0;animation:up .9s .35s forwards;
  text-shadow:0 2px 24px rgba(0,0,0,.5);
}
.hh1 .hi { color:#4ade80 }
.hh1 .out { -webkit-text-stroke:2px #FFFFFF;color:transparent }
.hp {
  font-size:1.05rem;font-weight:400;color:rgba(255,255,255,.88);max-width:500px;
  margin:0 auto 44px;line-height:1.7;opacity:0;animation:up .9s .55s forwards;
  text-shadow:0 1px 8px rgba(0,0,0,.4);
}
.hbtns { display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;opacity:0;animation:up .9s .72s forwards }
/* "How It Works" outline button — always on dark video so always white bordered */
.btn-o-hero {
  font-family:var(--fd);font-size:.85rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  padding:14px 36px;background:rgba(255,255,255,.12);color:#FFFFFF;
  border:1px solid rgba(255,255,255,.5);border-radius:100px;cursor:pointer;text-decoration:none;
  backdrop-filter:blur(6px);transition:border-color .2s,background .2s;
}
.btn-o-hero:hover { border-color:#FFFFFF;background:rgba(255,255,255,.22) }
.sh {
  position:absolute;bottom:38px;left:50%;transform:translateX(-50%);z-index:10;
  display:flex;flex-direction:column;align-items:center;gap:7px;
  opacity:0;animation:fi 1s 1.4s forwards;
}
.sh span { font-family:var(--fd);font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.55) }
.sl { width:1px;height:46px;background:linear-gradient(to bottom,#22C55E,transparent);animation:drop 1.9s ease-in-out infinite }
@keyframes drop{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
</style>