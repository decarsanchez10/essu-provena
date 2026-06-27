<template>
  <div class="bch-notarize" id ="bch-notarize">
    <!-- Step 1: Upload -->
    <div v-if="currentStep === 'upload'" class="upload-pane">
      <div class="pane-label">Core Tool</div>
      <h2 class="pane-title">Notarize Document</h2>
      <p class="pane-desc">Generate a cryptographic fingerprint and anchor it permanently to the Bitcoin Cash blockchain.</p>

      <div :class="['dz', isDragging ? 'dv' : '']"
        @click="$refs.fileInput.click()"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop">

        <div class="dz-inner">
          <div class="dz-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <div class="dz-text">
            <span class="dz-main">Drop file or <em>browse</em></span>
            <span class="dz-sub">PDF · DOCX · JPG · PNG &nbsp;·&nbsp; Never uploaded</span>
          </div>
          <div class="dz-btn">Choose File</div>
        </div>

        <input type="file" ref="fileInput" style="display:none"
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          @change="handleFileSelect">
      </div>
    </div>

    <!-- Step 2: Hash verify -->
    <div v-if="currentStep === 'hash-verify'" class="step-card">
      <div class="card-header">
        <div class="card-status done">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="card-title-group">
          <div class="card-title">Hash Generated</div>
          <div class="card-sub">{{ fileName }} · {{ fileSize }}</div>
        </div>
        <button class="ghost-btn" @click="resetFlow">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.32"/></svg>
          Reset
        </button>
      </div>

      <div class="hash-box">
        <span class="hash-label">SHA-256</span>
        <span class="hash-val">{{ documentHash }}</span>
      </div>

      <!-- Wallet bar -->
      <div v-if="walletState === 'connected'" class="wallet-pill connected">
        <span class="wpill-dot"></span>
        Connected · <strong>{{ walletName || 'Paytaca' }}</strong>
      </div>
      <div v-else-if="walletState === 'connecting'" class="wallet-pill scanning">
        <svg class="spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Connecting wallet…
      </div>
      <div v-else class="wallet-pill disconnected">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Connect Paytaca to anchor on-chain
        <button class="pill-action" @click="connectWallet">Connect</button>
      </div>

      <div class="card-actions">
        <button class="ghost-btn" @click="copyToClipboard(documentHash)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          {{ copyButtonLabel }}
        </button>
        <button class="primary-btn"
          @click="proceedToSign"
          :disabled="walletState !== 'connected'"
          :title="walletState !== 'connected' ? 'Connect your Paytaca wallet first' : ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Anchor to Blockchain
        </button>
      </div>
    </div>

    <!-- Step 3: Signing -->
    <div v-if="currentStep === 'signing'" class="step-card">
      <div class="card-header">
        <div class="card-status spinning">
          <svg class="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </div>
        <div class="card-title-group">
          <div class="card-title">Creating Blockchain Transaction</div>
          <div class="card-sub">Building BCH transaction with OP_RETURN</div>
        </div>
      </div>

      <div class="stages">
        <div v-for="(s, key) in stages" :key="key" :class="['stage-item', s ? 'active' : '']">
          <div :class="['sdot', s ? 'live' : '']"></div>
          <span>{{ key.charAt(0).toUpperCase() + key.slice(1) }}</span>
        </div>
      </div>

      <div v-if="errorMessage" class="error-box">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <div class="err-title">{{ errorTitle }}</div>
          <div class="err-msg">{{ errorMessage }}</div>
        </div>
      </div>

      <div class="card-actions">
        <button class="ghost-btn" @click="resetFlow" :disabled="isProcessing">Cancel</button>
        <button v-if="errorMessage" class="primary-btn" @click="retrySign" :disabled="isProcessing">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.32"/></svg>
          Retry
        </button>
      </div>
    </div>

    <!-- Step 4: Success -->
    <div v-if="currentStep === 'success'" class="step-card success-card">
      <div class="card-header">
        <div class="success-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        </div>
        <div class="card-title-group">
          <div class="card-title">Document Notarized</div>
          <div class="card-sub">{{ formatTimestamp(notarizationRecord?.timestamp) }}</div>
        </div>
        <span class="badge-confirmed">
          <span class="badge-dot"></span>Confirmed
        </span>
      </div>

      <div class="info-table">
        <div class="irow">
          <span class="ikey">Document Hash</span>
          <div class="ival-row">
            <span class="ival mono">{{ truncateHash(documentHash) }}</span>
            <button class="icon-btn" @click="copyToClipboard(documentHash)"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
          </div>
        </div>
        <div class="irow">
          <span class="ikey">Transaction ID</span>
          <div class="ival-row">
            <span class="ival mono">{{ truncateHash(notarizationRecord?.txid) }}</span>
            <button class="icon-btn" @click="copyToClipboard(notarizationRecord?.txid)"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
            <a :href="`https://explorer.bitcoincash.org/tx/${notarizationRecord?.txid}`" target="_blank" class="icon-btn"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>
          </div>
        </div>
        <div class="irow">
          <span class="ikey">BCH Address</span>
          <div class="ival-row">
            <span class="ival mono">{{ truncateHash(notarizationRecord?.address) }}</span>
            <button class="icon-btn" @click="copyToClipboard(notarizationRecord?.address)"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
          </div>
        </div>
        <div class="irow">
          <span class="ikey">Timestamp</span>
          <span class="ival">{{ formatTimestamp(notarizationRecord?.timestamp) }}</span>
        </div>
      </div>

      <div class="anchored-notice">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        Permanently anchored to the Bitcoin Cash blockchain.
      </div>

      <div class="card-actions">
        <button class="ghost-btn" @click="resetFlow">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.32"/></svg>
          New Document
        </button>
        <button class="primary-btn" @click="viewHistory">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          View Proof
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { hashDocument } from '../services/hashDocument'
import { buildNotaryTransaction } from '../services/buildNotaryTransaction'
import { signWithWizardConnect } from '../services/signWithWizardConnect'
import { broadcastTransaction } from '../services/broadcastTransaction'
import { saveNotarizationRecord } from '../services/saveNotarizationRecord'
import { useWalletConnect } from '../composables/useWalletConnect'
import Watchtower from 'watchtower-cash-js'

const emit = defineEmits(['toast', 'view-history', 'notarized'])

const watchtower = new Watchtower(false) // mainnet

const currentStep        = ref('upload')
const documentHash       = ref('')
const fileName           = ref('')
const fileSize           = ref('')
const isDragging         = ref(false)
const isProcessing       = ref(false)
const errorMessage       = ref('')
const errorTitle         = ref('')
const copyButtonLabel    = ref('Copy Hash')
const notarizationRecord = ref(null)
const stages             = ref({ building: false, signing: false, broadcasting: false })
const fileInput          = ref(null)

const {
  state:   walletState,
  walletName,
  manager,
  connect: connectWallet,
} = useWalletConnect()

function resolvePathName (mgr, pathIndex) {
  const fallback = pathIndex === 1 ? 'change' : 'receive'
  const sessionPaths = mgr.getSessionPaths?.()
  const path = Array.isArray(sessionPaths) ? sessionPaths[pathIndex] : null

  if (typeof path === 'string') return path
  if (path?.name) return path.name
  if (path?.pathName) return path.pathName
  if (path?.label) return path.label

  return fallback
}

// ── Find funded address by scanning all derivation paths
async function findFundedAddress (mgr) {
  const { hash160, encodeCashAddress } = await import('@bitauth/libauth')

  for (let pathIndex = 0; pathIndex < 3; pathIndex++) {
    for (let addrIndex = 0; addrIndex < 10; addrIndex++) {
      try {
        const pubkeyBytes = mgr.getPubkey?.(pathIndex, addrIndex)
        if (!pubkeyBytes) continue

        const pkh    = hash160(pubkeyBytes)
        const result = encodeCashAddress({ prefix: 'bitcoincash', type: 'p2pkh', payload: pkh })
        const addr   = typeof result === 'string' ? result : result.address

        const utxoResult = await watchtower.BCH.getBchUtxos(addr, 0.00001)
        if (utxoResult?.utxos?.length > 0) {
          const pathName = resolvePathName(mgr, pathIndex)
          const utxos = utxoResult.utxos.map(u => ({
            ...u,
            address: addr,
            pathName,
            addressIndex: addrIndex,
          }))
          return {
            address: addr,
            utxos,
            path: { pathName, addressIndex: addrIndex },
          }
        }
      } catch (e) {
        console.warn('Wallet address scan failed:', e)
      }
    }
  }
  return null
}

// ── File handling ─────────────────────────────────────
async function handleDrop (e) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length > 0) await handleFileSelect({ target: { files } })
}

async function handleFileSelect (e) {
  const files = e.target.files
  if (!files || files.length === 0) return

  const file = files[0]
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ]
  const isValidType = allowedTypes.includes(file.type)
  const isValidExt  = ['.pdf', '.docx', '.jpg', '.jpeg', '.png'].some(ext =>
    file.name.toLowerCase().endsWith(ext)
  )

  if (!isValidType && !isValidExt) {
    emit('toast', 'ERR:Only PDF, DOCX, JPG and PNG files are allowed')
    return
  }

  try {
    emit('toast', 'Computing document hash...')
    documentHash.value = await hashDocument(file)
    fileName.value     = file.name
    fileSize.value     = `${(file.size / 1024).toFixed(1)} KB`
    currentStep.value  = 'hash-verify'
    emit('toast', 'Hash generated!')
  } catch (error) {
    emit('toast', `ERR:Failed to hash document: ${error.message}`)
  }
}

// ── Flow ──────────────────────────────────────────────
function resetFlow () {
  currentStep.value        = 'upload'
  documentHash.value       = ''
  fileName.value           = ''
  fileSize.value           = ''
  errorMessage.value       = ''
  errorTitle.value         = ''
  notarizationRecord.value = null
  stages.value             = { building: false, signing: false, broadcasting: false }
  if (fileInput.value) fileInput.value.value = ''
}

async function proceedToSign () {
  console.log('wallet state:', walletState.value)
  console.log('manager:', manager.value)
  console.log('isWalletDiscovered:', manager.value?.isWalletDiscovered())
  console.log('getPubkey(0,0):', manager.value?.getPubkey(0, 0))
  console.log('getPubkey(0,1):', manager.value?.getPubkey(0, 1))
  console.log('sessionPaths:', manager.value?.getSessionPaths())

  if (!documentHash.value) {
    emit('toast', 'ERR:No document hash available')
    return
  }

  const mgr = manager.value
  if (!mgr) {
    emit('toast', 'ERR:Wallet not connected. Please reconnect.')
    return
  }

  currentStep.value  = 'signing'
  errorMessage.value = ''
  isProcessing.value = true

  try {
    // ── Step 1: Build ─────────────────────────────────
    stages.value.building = true
    emit('toast', 'Scanning wallet for funds...')

    const funded = await findFundedAddress(mgr)
    if (!funded) {
      throw new Error('Insufficient Balance: No funded address found. Send BCH to your Paytaca wallet.')
    }

    const walletAddress = funded.address

    emit('toast', 'Building BCH transaction...')
    const signRequest = buildNotaryTransaction({
      funderUtxos:  funded.utxos,
      documentHash: documentHash.value,
      walletAddress,
      walletPath:   funded.path,
    })
    stages.value.building = false

    // ── Step 2: Sign ──────────────────────────────────
    stages.value.signing = true
    emit('toast', 'Awaiting wallet signature...')

    const signedTxHex = await signWithWizardConnect(mgr, signRequest)
    stages.value.signing = false

    // ── Step 3: Broadcast ─────────────────────────────
    stages.value.broadcasting = true
    emit('toast', 'Broadcasting transaction...')

    const { txid } = await broadcastTransaction(signedTxHex)
    stages.value.broadcasting = false

    // ── Step 4: Save ──────────────────────────────────
    notarizationRecord.value = {
      hash:      documentHash.value,
      txid,
      address:   walletAddress,
      timestamp: new Date().toISOString(),
      status:    'confirmed',
    }
    await saveNotarizationRecord(notarizationRecord.value)
    emit('notarized', notarizationRecord.value)
    emit('toast', 'Document successfully notarized!')
    currentStep.value = 'success'

  } catch (error) {
    stages.value       = { building: false, signing: false, broadcasting: false }
    errorTitle.value   = 'Transaction Failed'
    const rawMessage = error.message || 'Unable to complete notarization.'
    errorMessage.value = rawMessage

    if (rawMessage.includes('cancelled')) {
      errorTitle.value = 'Wallet Rejected'
      errorMessage.value = 'Transaction signing was cancelled.'
    } else if (rawMessage.includes('Insufficient')) {
      errorTitle.value = 'Insufficient Balance'
      errorMessage.value = 'Insufficient BCH balance to complete notarization.'
    } else if (rawMessage.includes('broadcast')) {
      errorTitle.value = 'Broadcast Failed'
      errorMessage.value = 'Transaction broadcast failed. Please try again.'
    } else if (rawMessage.includes('Connection')) {
      errorTitle.value = 'Connection Failure'
      errorMessage.value = 'Unable to communicate with wallet. Reconnect and try again.'
    }

    emit('toast', `ERR:${errorMessage.value}`)
  } finally {
    isProcessing.value = false
  }
}
async function retrySign () {
  errorMessage.value = ''
  await proceedToSign()
}

// ── Utilities ─────────────────────────────────────────
function copyToClipboard (text) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    copyButtonLabel.value = 'Copied!'
    emit('toast', 'Copied to clipboard!')
    setTimeout(() => { copyButtonLabel.value = 'Copy Hash' }, 2000)
  })
}

function truncateHash (hash) {
  if (!hash) return ''
  return hash.length > 32 ? hash.slice(0, 14) + '…' + hash.slice(-14) : hash
}

function formatTimestamp (ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString()
}

function viewHistory () {
  emit('view-history')
}

</script>

<style scoped>

.bch-notarize { width: 100%; }

/* ── Upload pane ── */
.upload-pane { margin-bottom: 4px; }

.pane-label {
  font-size: .68rem; font-weight: 700; letter-spacing: .14em;
  text-transform: uppercase; color: var(--g);
  display: flex; align-items: center; gap: 7px; margin-bottom: 8px;
}
.pane-label::before {
  content: ''; display: inline-block;
  width: 16px; height: 1.5px;
  background: var(--g); border-radius: 2px;
}

.pane-title {
  font-family: var(--fd); font-size: 1.55rem; font-weight: 800;
  letter-spacing: -.03em; color: var(--tx);
  margin-bottom: 6px; transition: color .3s;
}

.pane-desc {
  font-size: .82rem; color: var(--dm, var(--step-p));
  line-height: 1.6; max-width: 460px;
  margin-bottom: 20px; transition: color .3s;
}

.dz {
  border: 1.5px dashed var(--gb);
  border-radius: 14px;
  padding: 18px 22px;
  cursor: pointer;
  transition: all .25s;
  background: var(--bg, var(--bgc));
}
.dz:hover, .dz.dv {
  border-color: var(--g);
  background: var(--gf);
}

.dz-inner {
  display: flex; align-items: center; gap: 16px;
}

.dz-icon {
  width: 40px; height: 40px; flex-shrink: 0;
  border-radius: 10px;
  border: 1.5px solid var(--gb);
  background: var(--bgc);
  display: flex; align-items: center; justify-content: center;
  color: var(--g); transition: all .25s;
}
.dz:hover .dz-icon { border-color: var(--g); background: var(--gf); }

.dz-text {
  flex: 1; display: flex; flex-direction: column; gap: 2px;
}
.dz-main {
  font-family: var(--fd); font-size: .88rem; font-weight: 600;
  color: var(--tx); transition: color .3s;
}
.dz-main em { font-style: normal; color: var(--g); }
.dz-sub {
  font-size: .72rem; color: var(--dm, var(--step-p));
  letter-spacing: .02em; transition: color .3s;
}

.dz-btn {
  flex-shrink: 0;
  font-family: var(--fd); font-size: .7rem; font-weight: 700;
  letter-spacing: .07em; text-transform: uppercase;
  padding: 8px 18px; border-radius: 100px;
  background: var(--g); color: #fff;
  transition: all .2s;
}
.dz:hover .dz-btn { box-shadow: 0 4px 14px rgba(34,197,94,.3); }

/* ── Step card ── */
.step-card {
  background: var(--bgc);
  border: 1px solid var(--gb);
  border-radius: 16px;
  padding: 22px 24px;
  transition: background .35s, border-color .3s;
  animation: slideUp .25s ease forwards;
}

.success-card { border-color: rgba(34,197,94,.35); }

/* ── Card header ── */
.card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }

.card-status {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--gb); color: var(--dm);
}
.card-status.done { background: var(--g); border-color: var(--g); color: #fff; }
.card-status.spinning { border-color: var(--g); color: var(--g); }

.card-title-group { flex: 1; min-width: 0; }
.card-title {
  font-family: var(--fd); font-size: .88rem; font-weight: 700;
  color: var(--tx); margin-bottom: 1px; transition: color .3s;
}
.card-sub { font-size: .74rem; color: var(--dm, var(--step-p)); }

.success-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--g); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; color: #fff;
}

/* ── Hash box ── */
.hash-box {
  display: flex; align-items: baseline; gap: 10px;
  padding: 10px 14px;
  background: var(--bg, var(--bgc));
  border: 1px solid var(--gb);
  border-radius: 10px; margin-bottom: 12px;
  transition: background .35s, border-color .35s;
}
.hash-label {
  font-family: var(--fd); font-size: .58rem; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase;
  color: var(--g); flex-shrink: 0;
}
.hash-val {
  font-family: 'Courier New', monospace; font-size: .72rem;
  color: var(--tx); word-break: break-all; letter-spacing: .02em;
  line-height: 1.5; opacity: .85;
}

/* ── Wallet pill ── */
.wallet-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 14px; border-radius: 100px;
  font-family: var(--fd); font-size: .72rem; font-weight: 600;
  margin-bottom: 14px; transition: all .3s; width: 100%; box-sizing: border-box;
}
.wallet-pill.connected {
  background: var(--gf); border: 1px solid rgba(34,197,94,.35); color: var(--g);
}
.wallet-pill.connected strong { font-weight: 700; }
.wpill-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--g); flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}
.wallet-pill.scanning {
  background: rgba(251,191,36,.07); border: 1px solid rgba(251,191,36,.3); color: #fbbf24;
}
.wallet-pill.disconnected {
  background: var(--bgc); border: 1px solid var(--gb);
  color: var(--dm, var(--step-p));
}
.wallet-pill.disconnected svg { flex-shrink: 0; color: var(--dm, var(--step-p)); }
.pill-action {
  margin-left: auto; padding: 4px 12px; border-radius: 100px;
  font-family: var(--fd); font-size: .65rem; font-weight: 700;
  letter-spacing: .06em; text-transform: uppercase;
  background: var(--g); color: #fff; border: none; cursor: pointer; transition: all .2s;
}
.pill-action:hover { box-shadow: 0 4px 12px rgba(34,197,94,.3); }

/* ── Stages ── */
.stages {
  display: flex; align-items: center;
  gap: 0; padding: 14px 18px;
  background: var(--bg, var(--bgc));
  border: 1px solid var(--gb); border-radius: 10px;
  margin-bottom: 14px; transition: background .35s;
}
.stage-item {
  display: flex; align-items: center; gap: 8px; flex: 1;
  opacity: .3; transition: opacity .3s;
}
.stage-item.active { opacity: 1; }
.stage-item:not(:last-child)::after {
  content: ''; flex: 1; height: 1px;
  background: var(--gb); margin: 0 8px;
}
.sdot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--gb); flex-shrink: 0; transition: all .3s;
}
.sdot.live { background: var(--g); animation: pulse 1s ease-in-out infinite; }
.stage-item span {
  font-family: var(--fd); font-size: .65rem; font-weight: 700;
  letter-spacing: .07em; text-transform: uppercase;
  color: var(--dm, var(--step-p)); white-space: nowrap;
}

/* ── Buttons ── */
.card-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }

.ghost-btn {
  font-family: var(--fd); font-size: .68rem; font-weight: 700;
  letter-spacing: .07em; text-transform: uppercase;
  padding: 8px 16px; border-radius: 100px;
  border: 1px solid var(--gb); background: transparent;
  color: var(--dm, var(--step-p)); cursor: pointer; transition: all .2s;
  display: inline-flex; align-items: center; gap: 6px;
}
.ghost-btn:hover { border-color: var(--g); color: var(--g); }
.ghost-btn:disabled { opacity: .4; cursor: not-allowed; }

.primary-btn {
  font-family: var(--fd); font-size: .68rem; font-weight: 700;
  letter-spacing: .07em; text-transform: uppercase;
  padding: 8px 18px; border-radius: 100px;
  background: var(--g); color: #fff; border: none;
  cursor: pointer; transition: all .2s;
  display: inline-flex; align-items: center; gap: 6px;
}
.primary-btn:hover:not(:disabled) { box-shadow: 0 5px 16px rgba(34,197,94,.35); }
.primary-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── Badge ── */
.badge-confirmed {
  margin-left: auto; flex-shrink: 0;
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 100px;
  font-family: var(--fd); font-size: .6rem; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.3); color: var(--g);
}
.badge-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--g); animation: pulse 2s ease-in-out infinite;
}

/* ── Info table ── */
.info-table { margin-bottom: 14px; }
.irow {
  display: grid; grid-template-columns: 120px 1fr;
  gap: 8px; padding: 9px 0;
  border-bottom: 1px solid var(--gb);
  align-items: center; transition: border-color .35s;
}
.irow:last-child { border-bottom: none; }
.ikey {
  font-family: var(--fd); font-size: .6rem; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase;
  color: var(--dm, var(--step-p));
}
.ival { font-size: .78rem; color: var(--tx); transition: color .3s; }
.ival.mono {
  font-family: 'Courier New', monospace;
  font-size: .68rem; color: var(--g);
}
.ival-row { display: flex; align-items: center; gap: 6px; min-width: 0; }

.icon-btn {
  background: transparent; border: 1px solid var(--gb);
  border-radius: 6px; padding: 4px;
  color: var(--dm, var(--step-p)); cursor: pointer;
  display: flex; align-items: center;
  transition: all .2s; flex-shrink: 0; text-decoration: none;
}
.icon-btn:hover { border-color: var(--g); color: var(--g); }

/* ── Error box ── */
.error-box {
  display: flex; gap: 10px; padding: 11px 14px;
  background: rgba(239,68,68,.05); border: 1px solid rgba(239,68,68,.2);
  border-radius: 10px; margin-bottom: 4px; align-items: flex-start;
}
.error-box svg { color: #ef4444; flex-shrink: 0; margin-top: 1px; }
.err-title { font-family: var(--fd); font-size: .74rem; font-weight: 700; color: #dc2626; margin-bottom: 2px; }
.err-msg { font-size: .74rem; color: #ef4444; }

/* ── Anchored notice ── */
.anchored-notice {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 8px;
  background: var(--gf); border: 1px solid rgba(34,197,94,.2);
  font-size: .76rem; color: var(--g); margin-bottom: 14px;
}
.anchored-notice svg { flex-shrink: 0; }

/* ── Animations ── */
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin-anim { to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
.spin { animation: spin-anim .8s linear infinite; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .dz-inner { flex-direction: column; align-items: flex-start; gap: 12px; }
  .dz-btn { align-self: stretch; text-align: center; }
  .pane-title { font-size: 1.3rem; }
  .step-card { padding: 18px; }
  .irow { grid-template-columns: 1fr; gap: 3px; }
  .card-actions { flex-direction: column; }
  .card-actions .ghost-btn,
  .card-actions .primary-btn { width: 100%; justify-content: center; }
  .stages { flex-wrap: wrap; gap: 8px; }
  .stage-item:not(:last-child)::after { display: none; }
}
</style>
