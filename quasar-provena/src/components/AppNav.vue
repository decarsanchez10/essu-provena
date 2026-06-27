<template>
  <nav :class="{ up: scrolled }">
    <router-link to="/" class="logo">PR<span class="coin">₿</span>VENA</router-link>

    <!-- Desktop links -->
    <ul class="nav-links">
      <li><a v-if="isHome" href="#how" @click.prevent="scrollTo('how')">How It Works</a><router-link v-else to="/">Home</router-link></li>
      <li><router-link to="/notarize">Notarize</router-link></li>
      <li>
        <router-link to="/verify" class="nav-verify-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          Verify Proof
        </router-link>
      </li>
      <li>
        <router-link to="/register-key" class="nav-key-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Register Key
        </router-link>
      </li>
      <li><router-link to="/about">About</router-link></li>
    </ul>

    <div class="nav-right">
      <!-- Theme toggle -->
      <button class="theme-btn" @click="toggle" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <svg v-if="!isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <div
  v-if="walletState === 'connected'"
  class="nav-wallet-connected"
>
  <div
    class="wallet-info"
    @click="showWalletDropdown = !showWalletDropdown"
  >
    <div class="nav-wallet-dot"></div>
    <span class="nav-wallet-name">{{ walletName || 'Paytaca Wallet' }}</span>

    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>

  <button
    class="wallet-disconnect-mini"
    @click.stop="disconnectWallet"
    :disabled="isNotarizing"
    :title="isNotarizing ? 'Cannot disconnect during notarization' : 'Disconnect Wallet'"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  </button>
</div>
      

      <!-- Connecting / reconnecting state — click to cancel -->
      <button v-else-if="walletState === 'connecting' || walletState === 'reconnecting'"
        class="nav-wallet-btn connecting"
        @click="cancelConnect"
      >
        <svg class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Connecting… <span class="cancel-hint">(cancel)</span>
      </button>

      <!-- Disconnected / idle state -->
      <button v-else class="nav-wallet-btn" @click="connectWallet">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Connect Wallet
      </button>

      <!-- Hamburger -->
      <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <transition name="drawer">
      <div v-if="menuOpen" class="mobile-drawer">
        <ul class="mobile-links">
          <li>
            <a v-if="isHome" href="#how" @click.prevent="mobileScrollTo('how')">How It Works</a>
            <router-link v-else to="/" @click="menuOpen = false">Home</router-link>
          </li>
          <li>
            <router-link to="/notarize" @click="menuOpen = false">Notarize</router-link>
          </li>
          <li>
            <router-link to="/verify" class="mobile-verify-link" @click="menuOpen = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              Verify Proof
            </router-link>
          </li>
          <li>
            <router-link to="/register-key" class="mobile-key-link" @click="menuOpen = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Register Key
            </router-link>
          </li>
          <li><router-link to="/about" @click="menuOpen = false">About</router-link></li>
          <!-- Mobile wallet -->
          <li>
            <div v-if="walletState === 'connected'" class="mobile-wallet-connected">
              <div class="nav-wallet-dot"></div>
              <span>{{ walletName || 'Wallet Connected' }}</span>
              <button class="mobile-disconnect-btn" @click="disconnectWallet">Disconnect</button>
            </div>
            <button v-else class="mobile-wallet-btn" @click="mobileConnect">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Connect Wallet
            </button>
          </li>
        </ul>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="menuOpen" class="backdrop" @click="menuOpen = false" />
    </transition>

    <Transition name="dropdown-fade">
      <div v-if="showWalletDropdown && walletState === 'connected'" class="wallet-dropdown" ref="dropdownRef">
        <div class="wd-header">
          <div class="wd-indicator"></div>
          <div class="wd-info">
            <div class="wd-name">{{ walletName || 'Wallet' }}</div>
            <div class="wd-provider">Paytaca · WizardConnect</div>
          </div>
        </div>
        <div class="wd-divider"></div>
        <button class="wd-item wd-disconnect" @click="disconnectWallet">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Disconnect
        </button>
      </div>
    </Transition>
  </nav>

  <!-- WizardConnect QR Dialog -->
<WizardConnectQRDialog
  v-if="state === 'connecting' && showQR && wcQrUri"
  :show="true"
  :uri="wcUri"
  :qr-uri="wcQrUri"
  title="Connect Paytaca Wallet"
  subtitle="Scan with your Paytaca app to connect"
  :on-close="() => showQR = false"
/>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme.js'
import { useWalletConnect } from '../composables/useWalletConnect.js'
import { useNotarizationState } from '../composables/useNotarizationState.js'
// isNotarizing references the notarization processing state for UI guards
const { isProcessing: isNotarizing } = useNotarizationState()
import { WizardConnectQRDialog } from '@paytaca/wizardconnect-vue'

const { isDark, toggle } = useTheme()
const scrolled = ref(false)
const menuOpen = ref(false)
const showWalletDropdown = ref(false)
const showQR = ref(false)
const dropdownRef = ref(null)
const route = useRoute()
const isHome = computed(() => route.path === '/')

// ── Wallet ──
const wc = useWalletConnect()

const state       = wc.state
const walletState = computed(() => wc.state.value)
const wcUri       = computed(() => wc.uri.value || '')
const wcQrUri     = computed(() => wc.qrUri.value || '')
const walletName  = computed(() => wc.walletName.value)

function connectWallet() {
  wc.connect()
  showQR.value = true
}

function cancelConnect() {
  showQR.value = false
  wc.disconnect()
}

function disconnectWallet() {
  wc.disconnect()
  showWalletDropdown.value = false
  menuOpen.value = false
  showQR.value = false
}

function mobileConnect () {
  menuOpen.value = false
  connectWallet()
}

watch(walletState, (val) => {
  if (val === 'connected') {
    showQR.value = false
  }
  if (val === 'reconnecting') {
    // Show QR so user can re-scan if needed, but do NOT auto-cancel —
    // cancelling calls disconnect() and wipes the session.
    // The library handles reconnect internally; we just surface the UI.
    showQR.value = true
  }
  if (val === 'idle' || val === 'disconnected') {
    showQR.value = false
  }
})

// ── Nav ──
function handleOutsideClick (e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showWalletDropdown.value = false
  }
}

function onScroll () { scrolled.value = window.scrollY > 30 }

function scrollTo(id) {
  const element = document.getElementById(id)
  if (!element) return

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}


function mobileScrollTo (id) {
  menuOpen.value = false
  setTimeout(() => scrollTo(id), 300)
}

watch(() => route.path, () => { menuOpen.value = false })
watch(menuOpen, (val) => { document.body.style.overflow = val ? 'hidden' : '' })

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', handleOutsideClick)
  document.body.style.overflow = ''
})


</script>

<style scoped>
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 64px; border-bottom: 1px solid transparent; transition: all .4s;
}
nav.up { background: var(--nav-bg); backdrop-filter: blur(24px); border-color: var(--gb); }

.logo {
  font-family: var(--fd); font-size: 1.55rem; font-weight: 800;
  letter-spacing: -.4px; color: var(--tx); text-decoration: none;
  display: flex; align-items: center; transition: color .3s;
  position: relative; z-index: 201;
}

/* ── Desktop Links ── */
.nav-links { display: flex; gap: 34px; list-style: none; align-items: center; }
.nav-links a, .nav-links :deep(a) {
  font-size: .9rem; font-weight: 500; color: var(--nav-link); text-decoration: none;
  position: relative; transition: color .2s;
}
.nav-links a::after, .nav-links :deep(a)::after {
  content: ''; position: absolute; bottom: -3px; left: 0; right: 100%;
  height: 1px; background: var(--g); transition: right .3s;
}
.nav-links a:hover, .nav-links :deep(a):hover,
.nav-links :deep(a.router-link-active) { color: var(--tx); }
.nav-links a:hover::after, .nav-links :deep(a):hover::after,
.nav-links :deep(a.router-link-active)::after { right: 0; }
.nav-key-link { display: flex; align-items: center; gap: 6px; color: var(--g) !important; font-weight: 600 !important; }
.nav-verify-link { display: flex; align-items: center; gap: 6px; color: var(--nav-link) !important; font-weight: 500 !important; }

/* ── Nav Right ── */
.nav-right { display: flex; align-items: center; gap: 10px; position: relative; z-index: 201; }

.theme-btn {
  width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--gb);
  background: var(--bgc); color: var(--g); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .25s; flex-shrink: 0;
}
.theme-btn:hover { border-color: var(--g); background: var(--gf); transform: rotate(20deg); }

.nav-wallet-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 100px;
  font-family: var(--fd); font-size: .72rem; font-weight: 700;
  letter-spacing: .06em; text-transform: uppercase;
  border: 1px solid var(--g); background: transparent;
  color: var(--g); cursor: pointer; transition: all .2s; white-space: nowrap;
}
.nav-wallet-btn:hover { background: var(--gf); box-shadow: 0 0 16px rgba(34,197,94,.2); }
.nav-wallet-btn.connecting { border-color: #fbbf24; color: #fbbf24; }
.nav-wallet-btn.connecting:hover { background: rgba(239,68,68,.07); border-color: #ef4444; color: #ef4444; }
.cancel-hint { font-size: .65rem; opacity: .7; font-weight: 500; text-transform: none; letter-spacing: 0; }

/* ── Connected state ── */
.nav-wallet-connected {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 14px; border-radius: 100px;
  border: 1px solid rgba(34,197,94,.4);
  background: var(--gf); cursor: pointer; transition: all .2s; position: relative;
}
.nav-wallet-connected:hover { border-color: var(--g); box-shadow: 0 0 16px rgba(34,197,94,.15); }
.nav-wallet-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--g); flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}
.nav-wallet-name {
  font-family: var(--fd); font-size: .72rem; font-weight: 700;
  color: var(--g); letter-spacing: .04em; max-width: 100px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.nav-wallet-connected svg { color: var(--g); }

.wallet-dropdown {
  position: absolute; top: calc(100% + 12px); right: 64px;
  background: rgba(10, 21, 16, 0.85); backdrop-filter: blur(24px); border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 20px; min-width: 220px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
  overflow: hidden; z-index: 300; transition: background .35s;
}
.wd-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; }
.wd-indicator {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--g); flex-shrink: 0;
  box-shadow: 0 0 6px var(--g); animation: pulse 2s ease-in-out infinite;
}
.wd-info { flex: 1; min-width: 0; }
.wd-name { font-family: var(--fd); font-size: .82rem; font-weight: 700; color: var(--tx); transition: color .3s; }
.wd-provider { font-size: .7rem; color: var(--step-p); transition: color .3s; }
.wd-divider { height: 1px; background: var(--gb); }
.wd-item {
  display: flex; align-items: center; gap: 9px;
  width: 100%; padding: 11px 16px;
  background: transparent; border: none;
  font-family: var(--fd); font-size: .78rem; font-weight: 600;
  color: var(--step-p); cursor: pointer; transition: all .2s; text-align: left;
}
.wd-item:hover { background: var(--gf); color: var(--g); }
.wd-item:hover svg { color: var(--g); }
.wd-item svg { color: var(--step-p); transition: color .2s; }
.wd-disconnect:hover { background: rgba(239,68,68,.06); color: #ef4444; }
.wd-disconnect:hover svg { color: #ef4444; }

/* ── Hamburger ── */
.hamburger {
  display: none; flex-direction: column; justify-content: center;
  gap: 5px; width: 38px; height: 38px; border-radius: 10px;
  border: 1px solid var(--gb); background: var(--bgc);
  cursor: pointer; padding: 9px; transition: all .25s; flex-shrink: 0;
}
.hamburger span { display: block; height: 1.5px; background: var(--tx); border-radius: 2px; transition: all .3s; transform-origin: center; }
.hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

.mobile-drawer {
  position: fixed; top: 0; left: 0; right: 0;
  padding: 90px 28px 36px;
  background: rgba(4, 8, 6, 0.85); backdrop-filter: blur(28px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); z-index: 199;
}
.mobile-links { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.mobile-links li a, .mobile-links li :deep(a) {
  display: block; padding: 14px 16px; font-size: 1rem; font-weight: 500;
  color: var(--nav-link); text-decoration: none; border-radius: 12px; transition: all .2s;
}
.mobile-links li a:hover, .mobile-links li :deep(a):hover,
.mobile-links li :deep(a.router-link-active) { color: var(--tx); background: var(--gf); }
.mobile-key-link { display: flex !important; align-items: center; gap: 8px; color: var(--g) !important; font-weight: 600 !important; }
.mobile-verify-link { display: flex !important; align-items: center; gap: 8px; }

.mobile-wallet-btn {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 14px 16px; border-radius: 12px;
  font-family: var(--fd); font-size: .82rem; font-weight: 700;
  letter-spacing: .06em; text-transform: uppercase;
  border: 1px solid var(--g); background: var(--gf);
  color: var(--g); cursor: pointer; transition: all .2s;
}
.mobile-wallet-connected {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 16px; border-radius: 12px;
  background: var(--gf); border: 1px solid rgba(34,197,94,.3);
  font-size: .82rem; color: var(--g);
}
.mobile-disconnect-btn {
  margin-left: auto; padding: 4px 10px; border-radius: 100px;
  background: transparent; border: 1px solid rgba(239,68,68,.3);
  color: #ef4444; font-size: .65rem; font-weight: 700;
  letter-spacing: .06em; text-transform: uppercase; cursor: pointer; transition: all .2s;
}
.mobile-disconnect-btn:hover { background: rgba(239,68,68,.1); }

/* ── Backdrop ── */
.backdrop { position: fixed; inset: 0; z-index: 198; background: rgba(0,0,0,.5); backdrop-filter: blur(2px); }

/* ── Transitions ── */
.drawer-enter-active, .drawer-leave-active { transition: transform .3s ease, opacity .3s ease; }
.drawer-enter-from, .drawer-leave-to { transform: translateY(-12px); opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity .2s ease, transform .2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── Animations ── */
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
@keyframes spin-anim { to { transform: rotate(360deg); } }
.spin { animation: spin-anim .8s linear infinite; }

/* ── Responsive ── */
@media (max-width: 960px) {
  nav { padding: 18px 22px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .nav-wallet-btn, .nav-wallet-connected { display: none; }
}

/* Connected wallet container */
.nav-wallet-connected {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;
  border-radius: 999px;
  border: 1px solid rgba(34, 197, 94, 0.3);
  background: linear-gradient(
    180deg,
    rgba(34, 197, 94, 0.08),
    rgba(34, 197, 94, 0.04)
  );
  backdrop-filter: blur(14px);
  transition: all .25s ease;
}

.nav-wallet-connected:hover {
  border-color: rgba(34, 197, 94, 0.6);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.12);
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 2px 10px;
  cursor: pointer;
}

/* Mini disconnect button */
.wallet-disconnect-mini {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--step-p);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .22s ease;
}

.wallet-disconnect-mini:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  transform: scale(1.05);
}

.wallet-disconnect-mini:active {
  transform: scale(0.96);
}

.wallet-disconnect-mini svg {
  transition: transform .2s ease;
}

.wallet-disconnect-mini:hover svg {
  transform: translateX(1px);
}
</style>