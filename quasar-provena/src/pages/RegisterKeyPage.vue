<!-- eslint-disable no-unused-vars -->
<template>
  <div class="rk-page">
    <div class="rk-wrap">

      <!-- Header -->
      <div class="rk-header">
        <div class="badge-chip">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Identity
        </div>
        <h1 class="rk-title">Register Your <span class="hi">Public Key</span></h1>
        <p class="rk-sub">Link your cryptographic public key to Provena for tamper-proof document notarization.</p>
      </div>

      <div v-if="walletState !== 'connected'" class="wallet-banner">
        <div class="wb-left">
          <div class="wb-icon-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <div class="wb-title">Wallet Required</div>
            <div class="wb-sub">Connect your Paytaca wallet to prove ownership before registering.</div>
          </div>
        </div>
        <div class="wb-warning" style="color: #fbbf24; font-size: 0.8rem; font-weight: 500;">Please connect your wallet using the navigation bar above.</div>
      </div>

      <!-- Wallet: connected -->
      <div v-else class="wallet-connected">
        <div class="wc-indicator"></div>
        <span class="wc-text">Connected via <strong>{{ walletName || 'Paytaca' }}</strong></span>
        <button class="btn btn-ghost btn-xs" style="margin-left:auto" @click="disconnectWallet">Disconnect</button>
      </div>

      <!-- Main card -->
      <div class="rk-card">

        <!-- Section 01: Key Selection -->
        <div class="card-section">
          <div class="section-header">
            <div class="section-num">01</div>
            <div class="section-meta">
              <div class="section-title">Select Public Key</div>
              <div class="section-desc">Choose which wallet key to register with Provena</div>
            </div>
          </div>

          <!-- Wallet not connected -->
          <div v-if="walletState !== 'connected'" class="key-connect-prompt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Connect your Paytaca wallet above to load available keys</span>
          </div>

          <!-- Keys loading -->
          <div v-else-if="walletState === 'connected' && availablePubkeys.length === 0" class="key-loading">
            <svg class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <span>Loading wallet keys…</span>
          </div>

          <!-- Key selector -->
          <div v-else class="key-selector">
            <div
              v-for="(key, i) in availablePubkeys"
              :key="i"
              :class="['key-option', selectedPubkeyIndex === i ? 'selected' : '']"
              @click="selectPubkey(i)"
            >
              <div class="key-option-left">
                <div class="key-option-radio">
                  <div v-if="selectedPubkeyIndex === i" class="key-option-radio-dot"></div>
                </div>
                <div class="key-option-info">
                  <div class="key-option-name">
                    {{ key.name }}
                    <span v-if="i === 0" class="key-default-tag">Default</span>
                  </div>
                  <div class="key-option-path" v-if="key.path">{{ key.path }}</div>
                  <div class="key-option-hex">{{ key.pubkeyHex.slice(0, 20) }}…{{ key.pubkeyHex.slice(-12) }}</div>
                </div>
              </div>
              <div v-if="selectedPubkeyIndex === i" class="key-option-check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
          </div>

          <div v-if="keyError" class="field-error" style="margin-top:12px">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ keyError }}
          </div>
        </div>

        <div class="card-divider"></div>

        <!-- Section 02: Label -->
        <div class="card-section">
          <div class="section-header">
            <div class="section-num">02</div>
            <div class="section-meta">
              <div class="section-title">Label <span class="required-tag" style="font-family: var(--fd); font-size: .6rem; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 100px; padding: 2px 8px; margin-left: 8px;">Required</span></div>
              <div class="section-desc">A human-readable name to identify this key</div>
            </div>
          </div>
          <input
            v-model="label"
            class="text-input"
            placeholder="e.g. Work Laptop Key, Hardware Security Module…"
            maxlength="80"
          >
        </div>

        <div class="card-divider"></div>

        <!-- Section 03: Submit -->
        <div class="card-section">
          <div class="section-header">
            <div class="section-num">03</div>
            <div class="section-meta">
              <div class="section-title">Register Wallet Key</div>
              <div class="section-desc">Save the selected wallet public key to the Provena backend</div>
            </div>
          </div>

          <!-- Public key ready -->
          <div v-if="publicKey" class="sig-box">
            <div class="sig-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="sig-body">
              <div class="sig-label">Wallet public key selected</div>
              <div class="sig-val">{{ publicKey.slice(0, 52) }}…{{ publicKey.slice(-16) }}</div>
            </div>
          </div>

          <div v-if="signError" class="field-error" style="margin-top:0;margin-bottom:14px">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ signError }}
          </div>

          <!-- Info note -->
          <div class="info-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>The public key is read from your connected Paytaca wallet and saved to the Provena backend.</span>
          </div>

          <!-- Action buttons -->
          <div class="step-actions">
            <button
              class="btn btn-primary btn-full"
              @click="submitKey"
              :disabled="submitting || walletState !== 'connected' || !publicKey"
            >
              <svg v-if="!submitting" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <svg v-else class="spin-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {{ submitting ? 'Registering…' : 'Register Key' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Registered keys list -->
      <div class="rk-list" v-if="Array.isArray(savedKeys) && savedKeys.length">
        <div class="list-header">
          <span class="list-title">Registered Keys</span>
          <span class="list-count">{{ savedKeys.length }}</span>
        </div>
        <div v-for="(k, i) in savedKeys" :key="i" class="key-row">
          <div class="key-row-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
          </div>
          <div class="key-row-info">
            <div class="key-row-label">{{ k.label || 'Unnamed Key' }}</div>
            <div class="key-row-fp">Pubkey: {{ k.publicKey ? k.publicKey.substring(0, 44) + '…' : '—' }}</div>
            <div class="key-row-meta" style="word-break: break-all;">Signature: {{ k.signature ? k.signature.substring(0, 44) + '…' : '—' }}</div>
            <div class="key-row-meta">Registered: {{ k.registeredAt ? new Date(k.registeredAt).toLocaleString() : '—' }}</div>
          </div>
          <button class="key-row-del" @click="deleteKey(i)" title="Remove key">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

    </div>

    <!-- WizardConnect QR Dialog -->
<WizardConnectQRDialog
  :show="state === 'connecting' && showQR"
  :uri="wcUri"
  :qr-uri="wcQrUri"
  title="Connect Paytaca Wallet"
  subtitle="Scan with your Paytaca app to connect"
  :on-close="() => showQR = false"
/>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, inject } from 'vue'
import { gsap } from 'gsap'
import { WizardConnectQRDialog } from '@paytaca/wizardconnect-vue'
import { resetWalletSession } from '../composables/useWalletConnect.js'
import { binToHex } from '@bitauth/libauth'

// Use relative /api paths so the Vite dev proxy handles routing.
const API_BASE_URL = 'http://localhost:8000'

let vantaEffect = null
let reconnectTimeout = null

function loadScript (src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}

// ── Wallet from App.vue inject (global singleton) ─────
const wallet     = inject('wallet')
const state      = wallet.state
const manager    = wallet.manager
const walletName = wallet.walletName

// ── Computed aliases used in template ─────────────────
const walletState = computed(() => state.value || 'idle')
const wcUri       = computed(() => wallet.uri.value || '')
const wcQrUri     = computed(() => wallet.qrUri.value || '')

// ── Local state ───────────────────────────────────────
const walletReady         = ref(false)
const showQR              = ref(false)
const availablePubkeys    = ref([])
const selectedPubkeyIndex = ref(null)
const publicKey           = ref('')
const label               = ref('')
const keyError            = ref('')
const submitting          = ref(false)
const signError           = ref('')
const savedKeys           = ref([])

// ── Lifecycle ─────────────────────────────────────────
onMounted(async () => {
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
    await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js')
    if (window.VANTA) {
      vantaEffect = window.VANTA.NET({
        el: document.body,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x16ff55,
        backgroundColor: 0x040004,
        points: 9,
        maxDistance: 22,
        spacing: 18,
      })
    }
  } catch (e) {
    console.warn('Vanta failed to load:', e)
  }

  if (walletState.value === 'connected') {
    loadPubkeys()
  }
  loadSavedKeys()

  // GSAP Animations
  gsap.from('.rk-header', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' })
  gsap.from('.wallet-banner', { y: 20, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' })
  gsap.from('.rk-card', { y: 40, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' })
  gsap.from('.rk-list', { y: 40, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' })
})

onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy()
  clearTimeout(reconnectTimeout)
})

// ── Watch state + manager ─────────────────────────────
watch([state, manager], ([newState, newManager], [oldState, oldManager]) => {
  if (newManager && !oldManager) {
    newManager.addListener('walletready', () => {
      walletReady.value = true
      showQR.value = false
      loadPubkeys()
    })
    newManager.addListener('disconnect', () => {
      walletReady.value = false
      availablePubkeys.value = []
      selectedPubkeyIndex.value = null
      publicKey.value = ''
    })
  }

  if (newState === 'connected') {
    showQR.value = false
    setTimeout(() => {
      if (!walletReady.value) {
        walletReady.value = true
        loadPubkeys()
      }
    }, 500)
  }

  // Only clear keys on a real transition away from connected —
  // ignore the initial idle/disconnected state on page load.
  const wasConnected = oldState === 'connected'
  if (wasConnected && (newState === 'disconnected' || newState === 'idle')) {
    walletReady.value = false
    availablePubkeys.value = []
    selectedPubkeyIndex.value = null
    publicKey.value = ''
  }
})



function disconnectWallet () {
  if (typeof wallet.disconnect === 'function') wallet.disconnect()
  resetWalletSession()
  walletReady.value = false
  availablePubkeys.value = []
  selectedPubkeyIndex.value = null
  publicKey.value = ''
}

function loadPubkeys () {
  const mgr = manager.value
  if (!mgr) {
    return
  }

  const paths = mgr.getSessionPaths?.() || []
  const keys = []

  paths.forEach((path, index) => {
    try {
      const pubkeyBytes = mgr.getPubkey(index, 0)

      if (pubkeyBytes) {
        keys.push({
          index,
          name: `Option ${index + 1}`,
          path: path.xpub || '',
          pubkeyHex: binToHex(pubkeyBytes),
        })
      }
    } catch (e) {
      console.warn(`Could not get pubkey ${index}:`, e)
    }
  })

  availablePubkeys.value = keys

  if (keys.length > 0 && selectedPubkeyIndex.value === null) {
    selectedPubkeyIndex.value = 0
    publicKey.value = keys[0].pubkeyHex
  }
}
function selectPubkey (index) {
  selectedPubkeyIndex.value = index
  publicKey.value = availablePubkeys.value[index]?.pubkeyHex || ''
  keyError.value = ''
}

function normalizeSavedKey (record) {
  return {
    id: record.id,
    label: record.label || '',
    publicKey: record.public_key || record.publicKey || '',
    registeredAt: record.created_at || record.registeredAt || new Date().toISOString(),
    signature: record.signature || '',
  }
}

async function loadSavedKeys () {
  try {
    const res = await fetch(`${API_BASE_URL}/api/publickeys/public-keys/`)
    if (!res.ok) throw new Error(`Server error ${res.status}`)
    const data = await res.json()
    savedKeys.value = Array.isArray(data) ? data.map(normalizeSavedKey) : []
  } catch (e) {
    console.warn('Could not load registered public keys:', e)
  }
}

// ── Submit key to backend ─────────────────────────────
async function submitKey () {
  if (!publicKey.value) return

  if (!label.value || !label.value.trim()) {
    signError.value = 'Label is required.'
    return
  }

  submitting.value = true
  signError.value = ''

  try {
    // ── NEW: Sign with Paytaca first ──
    const { sig, msg } = await signWithWallet()

    const selected = availablePubkeys.value[selectedPubkeyIndex.value]
    const payload = {
      public_key: publicKey.value,
      label:      label.value || selected?.name || '',
      message:    msg,
      signature:  sig,  // ← signature now included
    }

    const res = await fetch(`${API_BASE_URL}/api/publickeys/register-public-key/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || err.message || `Server error ${res.status}`)
    }

    const saved = normalizeSavedKey(await res.json())
    savedKeys.value.unshift(saved)

    label.value               = ''
    selectedPubkeyIndex.value = null
    publicKey.value           = ''

  } catch (e) {
    signError.value = e.message || 'Registration failed.'
  } finally {
    submitting.value = false
  }
}

async function deleteKey (i) {
  const key = savedKeys.value[i]
  if (!key?.publicKey) return

  try {
    const res = await fetch(`${API_BASE_URL}/api/publickeys/delete-public-key/`, {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ public_key: key.publicKey }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || err.message || `Server error ${res.status}`)
    }

    savedKeys.value.splice(i, 1)
  } catch (e) {
    signError.value = e.message || 'Failed to delete key.'
  }
}

async function signWithWallet () {
  const mgr = manager.value
  if (!mgr) throw new Error('Wallet manager not ready. Please reconnect your wallet.')

  const selected = availablePubkeys.value[selectedPubkeyIndex.value]
  if (!selected) throw new Error('No public key selected.')

  const msg = `Provena Key Registration\nPublic Key: ${publicKey.value}\nTimestamp: ${new Date().toISOString()}\n\nI confirm I own this key and authorize its registration on Provena.`

  const msgBytes = new TextEncoder().encode(msg.slice(0, 220))

  function varInt (n) {
    if (n < 0xfd) return n.toString(16).padStart(2, '0')
    if (n <= 0xffff) return 'fd' + n.toString(16).padStart(4, '0').match(/../g).reverse().join('')
    return 'fe' + n.toString(16).padStart(8, '0').match(/../g).reverse().join('')
  }
  const dataHex = Array.from(msgBytes).map(b => b.toString(16).padStart(2, '0')).join('')
  const scriptBody = `6a${varInt(msgBytes.length)}${dataHex}`
  const scriptLen = varInt(scriptBody.length / 2)
  const txHex = '02000000' + '00' + '01' + '0000000000000000' + scriptLen + scriptBody + '00000000'

  const signRequest = {
    action: 'sign_transaction_request',
    transaction: {
      transaction: txHex,
      sourceOutputs: [],
      userPrompt: `Provena: Prove ownership of your public key\n\n${msg.slice(0, 300)}`,
      broadcast: false,
    },
    inputPaths: [],
  }

  const response = await mgr.signTransaction(signRequest)
  
  const signedHex =
    response?.transaction?.transaction       ??
    response?.transaction?.signedTransaction ??
    response?.signedTransaction              ??
    response?.transaction_hex                ??
    response?.transactionHex                 ??
    response?.signed_transaction             ??
    (typeof response?.transaction === 'string' ? response.transaction : null) ??
    response?.signature                      ??
    response?.sig                            ??
    null

  if (!signedHex || signedHex.length === 0) {
    throw new Error('No signature returned from wallet.')
  }

  return { sig: signedHex, msg }
}

</script>

<style>
body { background: #040004 !important; margin: 0 }
body > canvas { position: fixed !important; top: 0; left: 0; z-index: 0 !important; pointer-events: none; }
#app { position: relative; z-index: 10; }
</style>

<style scoped>
.rk-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 110px 40px 80px;
  background: transparent;
  color: var(--tx);
}
.rk-wrap {
  position: relative;
  z-index: 2;
  max-width: 680px;
  margin: 0 auto;
}
.rk-header { margin-bottom: 36px }
.badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 10px;
  border-radius: 100px;
  border: 1px solid rgba(22, 163, 74, 0.5);
  background: rgba(22, 255, 85, 0.07);
  color: #16ff55;
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
  font-family: var(--fd);
  margin-bottom: 20px;
}
.rk-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  letter-spacing: -.03em;
  line-height: 1.1;
  color: #fff;
  margin: 0 0 14px;
}
.hi { color: #16A34A }
.rk-sub {
  font-size: .9rem;
  color: rgba(255,255,255,.48);
  line-height: 1.6;
  max-width: 480px;
  margin: 0;
}

/* ── Wallet banner ── */
.wallet-banner {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  background: #000000;
  border: 1px solid rgba(251, 191, 36, .3);
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.wb-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0 }
.wb-icon-wrap {
  width: 40px; height: 40px; flex-shrink: 0;
  border-radius: 12px;
  background: rgba(251,191,36,.1);
  border: 1px solid rgba(251,191,36,.2);
  display: flex; align-items: center; justify-content: center;
  color: #fbbf24;
}
.wb-title { font-family: var(--fd); font-size: .82rem; font-weight: 700; color: #fbbf24; margin-bottom: 3px }
.wb-sub { font-size: .76rem; color: rgba(255,255,255,.45); line-height: 1.4 }

/* ── Wallet connected ── */
.wallet-connected {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 16px;
  border-radius: 100px;
  border: 1px solid rgba(34, 197, 94, 0.3);
  background: #000000;
  font-size: .78rem;
  color: rgba(255,255,255,.55);
  margin-bottom: 20px;
}
.wc-indicator {
  width: 7px; height: 7px; border-radius: 50%;
  background: #16A34A;
  flex-shrink: 0;
  box-shadow: 0 0 8px #16A34A;
  animation: pulse 2s ease-in-out infinite;
}
.wc-text strong { color: #16A34A }

/* ── Main card ── */
.rk-card {
  position: relative;
  z-index: 10;
  background: #000000;
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 24px;
}
.card-section { padding: 28px 32px }
.card-divider { height: 1px; background: rgba(255,255,255,.07); margin: 0 }
.section-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px }
.section-num {
  font-family: var(--fd);
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .12em;
  color: #16A34A;
  background: rgba(22,255,85,.1);
  border: 1px solid rgba(22, 163, 74, 0.4);
  border-radius: 7px;
  padding: 5px 8px;
  flex-shrink: 0;
  margin-top: 2px;
}
.section-title {
  font-family: var(--fd);
  font-size: .92rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-desc { font-size: .78rem; color: rgba(255,255,255,.4); line-height: 1.5 }
.optional-tag {
  font-family: var(--fd);
  font-size: .6rem;
  font-weight: 600;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: rgba(255,255,255,.35);
  border: 1px solid rgba(22, 163, 74, 0.3);
  border-radius: 100px;
  padding: 2px 8px;
}

/* ── Key connect prompt / loading ── */
.key-connect-prompt,
.key-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(0,0,0,.4);
  border: 1px dashed rgba(22,163,74,.25);
  font-size: .82rem;
  color: rgba(255,255,255,.4);
  font-family: var(--fd);
}
.key-connect-prompt svg { color: rgba(255,255,255,.3); flex-shrink: 0; }
.key-loading svg { color: #16A34A; flex-shrink: 0; }

/* ── Key selector ── */
.key-selector { display: flex; flex-direction: column; gap: 10px; }

.key-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(0,0,0,.25);
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: all .2s;
}
.key-option:hover {
  border-color: rgba(22,163,74,.5);
  background: rgba(22,163,74,.05);
}
.key-option.selected {
  border-color: rgba(22,255,85,.5);
  background: rgba(22,163,74,.1);
}
.key-option-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}
.key-option-radio {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(22,163,74,.4);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: border-color .2s;
}
.key-option.selected .key-option-radio { border-color: #16ff55; }
.key-option-radio-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #16ff55;
}
.key-option-info { min-width: 0; flex: 1; }
.key-option-name {
  font-family: var(--fd);
  font-size: .86rem;
  font-weight: 700;
  color: rgba(255,255,255,.9);
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: capitalize;
}
.key-default-tag {
  font-size: .58rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #16A34A;
  background: rgba(22,163,74,.15);
  border: 1px solid rgba(22,163,74,.3);
  border-radius: 100px;
  padding: 2px 7px;
}
.key-option-path {
  font-size: .7rem;
  color: rgba(255,255,255,.3);
  font-family: 'Courier New', monospace;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.key-option-hex {
  font-family: 'Courier New', monospace;
  font-size: .72rem;
  color: rgba(22,255,85,.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

}
.key-option-check {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: rgba(22,255,85,.15);
  border: 1px solid rgba(22,255,85,.3);
  display: flex; align-items: center; justify-content: center;
  color: #16ff55;
  flex-shrink: 0;
}

/* ── Label input ── */
.text-input {
  position: relative;
  z-index: 10;
  width: 100%;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: rgba(255,255,255,.9);
  font-family: var(--fd);
  font-size: .86rem;
  outline: none;
  transition: border-color .2s, background .2s, box-shadow .2s;
  box-sizing: border-box;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
}
.text-input:focus { border-color: rgba(22,255,85,.5); background: rgba(22,255,85,.03) }
.text-input::placeholder { color: rgba(255,255,255,.2) }

/* ── Field error ── */
.field-error {
  display: flex; align-items: center; gap: 6px;
  margin-top: 10px;
  font-size: .76rem; color: #f87171;
  font-family: var(--fd);
}

/* ── Signature box ── */
.sig-box {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 16px 20px;
  background: rgba(10, 21, 16, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 14px;
  margin-bottom: 20px;
}
.sig-icon {
  width: 28px; height: 28px; flex-shrink: 0;
  border-radius: 8px;
  background: rgba(22,255,85,.15);
  display: flex; align-items: center; justify-content: center;
  color: #16ff55;
  margin-top: 1px;
}
.sig-label {
  font-family: var(--fd);
  font-size: .65rem; font-weight: 700; letter-spacing: .09em;
  text-transform: uppercase; color: #16ff55; margin-bottom: 5px;
}
.sig-val {
  font-family: 'Courier New', monospace;
  font-size: .71rem; color: rgba(255,255,255,.6);
  word-break: break-all; line-height: 1.5;
}

/* ── Info note ── */
.info-note {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 14px 18px;
  background: rgba(0,0,0,.3);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 14px;
  margin-bottom: 24px;
  font-size: .8rem; color: rgba(255,255,255,.45); line-height: 1.5;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
}
.info-note svg { color: rgba(22,255,85,.7); flex-shrink: 0; margin-top: 2px }
.info-note strong { color: rgba(255,255,255,.75); font-weight: 600 }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  font-family: var(--fd);
  font-size: .72rem; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase;
  padding: 10px 20px; border-radius: 100px;
  cursor: pointer; transition: all .2s;
  white-space: nowrap; border: none; outline: none;
}
.btn:disabled { opacity: .4; cursor: not-allowed }
.btn-primary { background: #16A34A; color: #fff; transition: all .3s cubic-bezier(0.4, 0, 0.2, 1); }
.btn-primary:hover:not(:disabled) { background: #2ced6b; box-shadow: 0 8px 24px rgba(22,163,74,.45); transform: translateY(-2px); }
.btn-ghost { background: transparent; border: 1px solid rgba(22, 163, 74, 0.4); color: #16A34A; transition: all .3s cubic-bezier(0.4, 0, 0.2, 1); }
.btn-ghost:hover:not(:disabled) { background: rgba(22, 163, 74, 0.1); border-color: #16ff55; color: #16ff55; transform: translateY(-2px); }
.btn-ghost.scanning { color: rgba(255,255,255,.45) }
.btn-xs { padding: 6px 13px; font-size: .62rem }
.btn-full { flex: 1 }
.step-actions { display: flex; gap: 10px }

/* ── Keys list ── */
.rk-list {
  position: relative; z-index: 10;
  background: rgba(10, 21, 16, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 24px; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05);
}
.list-header {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 28px 16px;
  border-bottom: 1px solid rgba(255,255,255,.07);
}
.list-title {
  font-family: var(--fd);
  font-size: .7rem; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: rgba(255,255,255,.5);
}
.list-count {
  font-family: var(--fd);
  font-size: .62rem; font-weight: 700;
  color: #16ff55;
  background: rgba(22,255,85,.1);
  border: 1px solid rgba(22,255,85,.2);
  border-radius: 100px; padding: 2px 8px;
}
.key-row {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 28px;
  border-bottom: 1px solid rgba(255,255,255,.05);
  transition: background .15s;
}
.key-row:last-child { border-bottom: none }
.key-row:hover { background: rgba(255,255,255,.03) }
.key-row-icon {
  width: 36px; height: 36px; flex-shrink: 0;
  border-radius: 10px;
  background: rgba(22,255,85,.08);
  border: 1px solid rgba(22,255,85,.15);
  display: flex; align-items: center; justify-content: center;
  color: #16ff55;
}
.key-row-info { flex: 1; min-width: 0 }
.key-row-label {
  font-family: var(--fd); font-size: .86rem; font-weight: 700;
  color: rgba(255,255,255,.9); margin-bottom: 3px;
}
.key-row-fp {
  font-family: 'Courier New', monospace; font-size: .68rem;
  color: rgba(22,255,85,.7);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px;
}
.key-row-meta { font-size: .7rem; color: rgba(255,255,255,.3) }
.key-row-del {
  background: transparent;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 8px; padding: 7px;
  color: rgba(255,255,255,.3);
  cursor: pointer; transition: all .2s;
  display: flex; align-items: center; flex-shrink: 0;
}
.key-row-del:hover { border-color: rgba(248,113,113,.5); color: #f87171; background: rgba(248,113,113,.07) }

/* ── Animations ── */
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px #16ff55 }
  50% { opacity: .5; box-shadow: 0 0 3px #16ff55 }
}
@keyframes spin-anim { to { transform: rotate(360deg) } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) } }
.spin-icon { animation: spin-anim .8s linear infinite }

/* ── Responsive ── */
@media (max-width: 720px) {
  .rk-page { padding: 90px 18px 60px }
  .card-section { padding: 22px 20px }
  .key-row { padding: 14px 20px }
  .list-header { padding: 16px 20px 14px }
  .wallet-banner { gap: 12px }
  .step-actions { flex-direction: column }
  .btn-full { width: 100% }
}
</style>
