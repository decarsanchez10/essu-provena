<template>
  <div class="notarize-page">
    <div class="page-header gsap-header">
      <div class="header-content">
        <h1>Document Notarization</h1>
        <p>Securely anchor your documents to the Bitcoin Cash blockchain.</p>
      </div>
    </div>
    
    <div class="dashboard-layout">
      <div class="main-column gsap-card">
        <div class="bch-notarize" id ="bch-notarize">
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

      <div v-if="walletState === 'connected'" class="wallet-pill connected">
        <span class="wpill-dot"></span>
        Connected · <strong>{{ walletName || 'Paytaca' }}</strong> – {{ walletAddress }}
      </div>
      <div v-else class="wallet-pill disconnected">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Please connect your wallet using the navigation bar above.
      </div>

      <div class="upload-option">
        <label class="checkbox-label">
          <input type="checkbox" v-model="uploadToServer" />
          <span class="checkbox-text">Store file on server (Optional)</span>
        </label>
        <div v-if="uploadToServer" class="upload-warning">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Warning: Unencrypted File. The document will be stored exactly as uploaded without additional encryption.
        </div>
      </div>

      <div class="email-option">
        <label class="input-label">Email notification (optional)</label>
        <div class="email-input-wrap">
          <div class="email-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <input
            v-model="notifyEmail"
            type="email"
            placeholder="you@example.com"
            class="email-input"
          />
        </div>
        <p class="email-hint">Receive a confirmation email with your notarization details and blockchain proof.</p>
      </div>

      <div class="terms-option">
        <label class="checkbox-label">
          <input type="checkbox" v-model="termsAccepted" />
          <span class="checkbox-text">
            I agree to the
            <router-link to="/terms" target="_blank">Terms and Conditions</router-link>
          </span>
        </label>
      </div>

      <div class="card-actions">
        <button class="ghost-btn" @click="copyToClipboard(documentHash)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          {{ copyButtonLabel }}
        </button>
        <button class="primary-btn"
          @click="proceedToSign"
          :disabled="walletState !== 'connected' || !termsAccepted"
          :title="walletState !== 'connected' ? 'Connect your Paytaca wallet first' : !termsAccepted ? 'Please accept the Terms and Conditions' : ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Notarize to Blockchain
        </button>
      </div>
    </div>

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
            <a :href="getExplorerTxUrl(notarizationRecord?.txid)" target="_blank" class="icon-btn"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>
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

      <div v-if="successGeneratedLink" class="success-link-box">
        <div class="slink-header">Temporary Verification Link</div>
        <p class="slink-desc">Share this link to let others verify your document. It will expire after one use or 24 hours.</p>
        <div class="slink-row">
          <input type="text" readonly :value="successGeneratedLink" class="slink-input" />
          <button class="primary-btn slink-copy" @click="copyToClipboard(successGeneratedLink)">Copy</button>
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
</div>
      <div class="side-column gsap-card">
        <NotarizationHistory ref="historyTable" @toast="(msg) => emit('toast', msg)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'
import NotarizationHistory from '../components/NotarizationHistory.vue'
import { hashDocument } from '../services/hashDocument'
import { buildNotaryTransaction } from '../services/buildNotaryTransaction'
import { signWithWizardConnect } from '../services/signWithWizardConnect'
import { broadcastTransaction } from '../services/broadcastTransaction'

import { saveNotarizationRecord } from '../services/saveNotarizationRecord'
import { useWalletConnect } from '../composables/useWalletConnect'
import Watchtower from 'watchtower-cash-js'
import { API_BASE_URL, API_ENDPOINTS, EXPLORER_TX_URL } from '../config'

const emit = defineEmits(['toast'])

const historyTable = ref(null)

async function refreshHistory() {
  await nextTick()
  historyTable.value?.refreshRecords()
}

onMounted(() => {
  gsap.from('.gsap-header', {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  })

  gsap.from('.gsap-card', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.2
  })
})

const watchtower = new Watchtower(false) 

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
const uploadToServer     = ref(false)
const notifyEmail        = ref('')
const termsAccepted      = ref(false)
const stages             = ref({ uploading: false, building: false, signing: false, broadcasting: false })
const fileInput          = ref(null)
const successGeneratedLink = ref(null)
const selectedFile       = ref(null)

const {
  state:   walletState,
  walletName,
  manager,
  address: walletAddress,
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

async function findFundedAddress (mgr) {
  console.log('findFundedAddress: Starting scan...')
  const { hash160, encodeCashAddress, binToHex } = await import('@bitauth/libauth')

  for (let pathIndex = 0; pathIndex < 3; pathIndex++) {
    for (let addrIndex = 0; addrIndex < 10; addrIndex++) {
      try {
        const pubkeyBytes = mgr.getPubkey?.(pathIndex, addrIndex)
        if (!pubkeyBytes) continue

        const pkh    = hash160(pubkeyBytes)
        const result = encodeCashAddress({ prefix: 'bitcoincash', type: 'p2pkh', payload: pkh })
        const addr   = typeof result === 'string' ? result : result.address

        console.log(`findFundedAddress: Checking address ${addr} (pathIndex=${pathIndex}, addrIndex=${addrIndex})`)
        const utxoResult = await watchtower.BCH.getBchUtxos(addr, 0.00001)
        console.log(`findFundedAddress: UTXOs for ${addr}:`, utxoResult?.utxos?.length || 0)
        
        if (utxoResult?.utxos?.length > 0) {
          const pathName = resolvePathName(mgr, pathIndex)
          
          // CRITICAL FIX: Explicitly translate Watchtower API payload fields (tx_hash, tx_pos, value)
          // into standard transaction structures (txid, vout, satoshis) expected down-stream.
          const utxos = utxoResult.utxos.map(u => ({
            txid: u.txid || u.tx_hash,
            vout: u.vout !== undefined && u.vout !== null ? u.vout : u.tx_pos,
            satoshis: u.satoshis || u.value,
            address: addr,
            pathName,
            addressIndex: addrIndex,
          }))
          
          console.log(`findFundedAddress: Found funded address ${addr} with ${utxos.length} normalized UTXOs`)
          return {
            address: addr,
            utxos,
            path: { pathIndex, pathName, addressIndex: addrIndex },
            pubkey: binToHex(pubkeyBytes),
          }
        }
      } catch (e) {
        console.warn('Wallet address scan failed:', e)
      }
    }
  }
  console.log('findFundedAddress: No funded address found')
  return null
}

async function handleDrop (e) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length > 0) await handleFileSelect({ target: { files } })
}

async function handleFileSelect (e) {
  const files = e.target.files
  if (!files || files.length === 0) return

  const file = files[0]
  selectedFile.value = file
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
    const computedHash = await hashDocument(file)

    // Early exit if document already exists on backend or locally
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RECORDS_CHECK(computedHash)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.exists) {
          emit('toast', 'ERR:This document has already been notarized!')
          if (fileInput.value) fileInput.value.value = ''
          return
        }
      }
    } catch (err) {
      console.warn('Could not verify if hash exists on backend:', err)
    }

    const allRecords = JSON.parse(localStorage.getItem('pv') || '[]')
    if (allRecords.find(r => r.hash === computedHash)) {
      emit('toast', 'ERR:This document has already been notarized!')
      if (fileInput.value) fileInput.value.value = ''
      return
    }

    documentHash.value = computedHash
    fileName.value     = file.name
    fileSize.value     = `${(file.size / 1024).toFixed(1)} KB`
    currentStep.value  = 'hash-verify'
    emit('toast', 'Hash generated!')
  } catch (error) {
    emit('toast', `ERR:Failed to hash document: ${error.message}`)
  }
}

function resetFlow () {
  currentStep.value        = 'upload'
  documentHash.value       = ''
  fileName.value           = ''
  fileSize.value           = ''
  errorMessage.value       = ''
  errorTitle.value         = ''
  uploadToServer.value     = false
  notifyEmail.value        = ''
  termsAccepted.value      = false
  notarizationRecord.value = null
  successGeneratedLink.value = null
  selectedFile.value       = null
  stages.value             = { uploading: false, building: false, signing: false, broadcasting: false }
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

  // Early exit if document already exists on backend or locally to enforce one‑time upload
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RECORDS_CHECK(documentHash.value)}`)
    if (res.ok) {
      const data = await res.json()
      if (data.exists) {
        emit('toast', 'ERR:Document is already notarized on the blockchain!')
        // Reset UI state to allow user to choose another file
        currentStep.value = 'upload'
        return
      }
    }
  } catch (err) {
    console.warn('Could not verify if hash exists on backend:', err)
  }
  // Also check local storage cache
  const allRecords = JSON.parse(localStorage.getItem('pv') || '[]')
  if (allRecords.find(r => r.hash === documentHash.value)) {
    emit('toast', 'ERR:Document is already notarized on the blockchain!')
    currentStep.value = 'upload'
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

    console.log('Calling findFundedAddress...')
    const funded = await findFundedAddress(mgr)
    console.log('findFundedAddress result:', funded)
    if (!funded) {
      throw new Error('Insufficient Balance: No funded address found. Send BCH to your Paytaca wallet.')
    }

    const walletAddress = funded.address

    emit('toast', 'Building BCH transaction...')
    // Provenance is now established purely by the native SIGHASH_ALL
    // transaction signature over a UTXO strictly owned by the registered
    // address — no message signature is wrapped/extracted, and no
    // signature/publicKey are embedded in the OP_RETURN.
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

    const signResult = await signWithWizardConnect(mgr, signRequest)
    const signedHex = typeof signResult === 'string' ? signResult : signResult.signedHex
    stages.value.signing = false

    // ── Step 3: Broadcast via Watchtower (Paytaca's backend) ─────────
    stages.value.broadcasting = true
    emit('toast', 'Broadcasting transaction via Watchtower...')

    let txid = null
    try {
      const res = await broadcastTransaction(signedHex)
      txid = res.txid
      console.log('Broadcast successful, txid:', txid)
    } catch (bErr) {
      console.error('Broadcast failed:', bErr)
      emit('toast', `ERR:Broadcast failed – ${bErr.message}`)
      // Abort further processing to avoid storing a record without a chain proof
      stages.value.broadcasting = false
      isProcessing.value = false
      currentStep.value = 'upload'
      return
    }
    stages.value.broadcasting = false

    // ── Step 4: Sync with backend ─────────────────────
    let recordId = null
    let uploaded = false

    stages.value.uploading = true
    emit('toast', 'Syncing with server...')
    try {
      const formData = new FormData()
      formData.append('document_hash', documentHash.value)
      formData.append('txid', txid)
      if (funded.pubkey) formData.append('public_key', funded.pubkey)
      if (uploadToServer.value && selectedFile.value) {
        formData.append('file', selectedFile.value)
      }

      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RECORDS}`, {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Server sync failed')
      const data = await res.json()
      recordId = data.record_id
      uploaded = uploadToServer.value
      if (uploaded) emit('toast', 'Upload complete.')

      try {
        const linkRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RECORDS_GENERATE_LINK(recordId)}`, { method: 'POST' })
        if (linkRes.ok) {
          const linkData = await linkRes.json()
          successGeneratedLink.value = `${window.location.origin}/#/verify/${linkData.token}`
        }
      } catch (linkErr) {
        console.error('Failed to auto-generate link:', linkErr)
      }
    } catch (err) {
      console.error('Server sync error:', err)
      emit('toast', 'ERR:Notarized on-chain, but server sync failed.')
    }
    stages.value.uploading = false

    notarizationRecord.value = {
      hash:      documentHash.value,
      txid,
      address:   walletAddress,
      timestamp: new Date().toISOString(),
      status:    'confirmed',
      record_id: recordId,
      uploaded:  uploaded,
    }
    saveNotarizationRecord(notarizationRecord.value)
    refreshHistory()
    emit('toast', 'Document successfully notarized!')
    currentStep.value = 'success'

    // Send email notification if provided
    if (notifyEmail.value) {
      try {
        emit('toast', 'Sending confirmation email...')
        const emailRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RECORDS_SEND_EMAIL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: notifyEmail.value,
            txid,
            document_hash: documentHash.value,
          })
        })
        if (emailRes.ok) {
          emit('toast', `Confirmation sent to ${notifyEmail.value}`)
        } else {
          emit('toast', 'ERR:Failed to send confirmation email.')
        }
      } catch (emailErr) {
        console.error('Email send error:', emailErr)
        emit('toast', 'ERR:Failed to send confirmation email.')
      }
    }

  } catch (error) {
    stages.value       = { uploading: false, building: false, signing: false, broadcasting: false }
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

function getExplorerTxUrl (txid) {
  return EXPLORER_TX_URL(txid)
}

function formatTimestamp (ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString()
}

function viewHistory () {
  const element = historyTable.value?.$el || document.querySelector('.side-column')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}


</script>

<style scoped>

.notarize-page {
  padding-top: 40px;
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 80px;
}

.page-header {
  padding: 40px 24px;
  text-align: center;
  border-bottom: 1px solid var(--gb);
  background: var(--bgc);
  margin-bottom: 32px;
}

.header-content h1 {
  font-family: var(--fd);
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--tx);
  margin: 0 0 12px;
  letter-spacing: -1px;
}

.header-content p {
  font-family: var(--fd);
  font-size: 1.1rem;
  color: var(--step-p);
  margin: 0;
}

.dashboard-layout {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: stretch;
}

.main-column, .side-column {
  width: 100%;
}

.bch-notarize { width: 100%; }

/* ── Upload Option ── */
.upload-option {
  margin-bottom: 16px;
  background: var(--bgc);
  border: 1px solid var(--gb);
  border-radius: 10px;
  padding: 12px 14px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.checkbox-label input[type="checkbox"] {
  accent-color: var(--g);
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.checkbox-text {
  font-family: var(--fd);
  font-size: .85rem;
  font-weight: 600;
  color: var(--tx);
}
.upload-option { margin-bottom: 20px; }
.upload-warning {
  margin-top: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fbbf24;
  font-size: .8rem;
  line-height: 1.5;
}
.upload-warning svg {
  flex-shrink: 0;
  margin-top: 2px;
}

/* ── Terms Option ── */
.terms-option {
  margin-bottom: 24px;
  background: var(--bgc);
  border: 1px solid var(--gb);
  border-radius: 10px;
  padding: 14px 16px;
}
.terms-option .checkbox-text a {
  color: var(--g);
  text-decoration: none;
  font-weight: 700;
}
.terms-option .checkbox-text a:hover {
  text-decoration: underline;
}

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
  font-family: var(--fd); font-size: 2rem; font-weight: 800;
  letter-spacing: -.03em; color: var(--tx);
  margin-bottom: 6px; transition: color .3s;
}

.pane-desc {
  font-size: .82rem; color: var(--dm, var(--step-p));
  line-height: 1.6; max-width: 460px;
  margin-bottom: 20px; transition: color .3s;
}

.dz {
  border: 1.5px dashed rgba(34,197,94,.3);
  border-radius: 16px;
  padding: 32px 24px;
  cursor: pointer;
  transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(34,197,94,.03);
  display: flex;
  justify-content: center;
}
.dz:hover, .dz.dv {
  border-color: rgba(34,197,94,.6);
  background: rgba(34,197,94,.08);
  transform: translateY(-2px);
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
  background: rgba(10, 21, 16, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 16px;
  padding: 32px;
  transition: background .35s, border-color .3s, transform .3s, box-shadow .3s;
  animation: slideUp .25s ease forwards;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.step-card:hover {
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
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
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; margin-bottom: 20px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
}
.hash-label {
  font-family: var(--fd); font-size: .65rem; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase;
  color: var(--g); flex-shrink: 0;
  background: rgba(34,197,94,0.1); padding: 4px 8px; border-radius: 6px;
}
.hash-val {
  font-family: 'Courier New', monospace; font-size: .9rem;
  color: #fff; word-break: break-all; letter-spacing: .02em;
  line-height: 1.5;
}

/* ── Success Link Box ── */
.success-link-box {
  margin: 24px 0;
  padding: 16px;
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
}
.slink-header {
  font-family: var(--fd);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--g);
  margin-bottom: 4px;
}
.slink-desc {
  font-size: 0.75rem;
  color: var(--step-p);
  margin-bottom: 12px;
}
.slink-row {
  display: flex;
  gap: 8px;
}
.slink-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--gb);
  border-radius: 8px;
  background: var(--bg);
  color: var(--tx);
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
}
.slink-copy {
  width: auto;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 0.8rem;
}

/* ── Wallet pill ── */
.wallet-pill {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 20px; border-radius: 12px;
  font-family: var(--fd); font-size: .85rem; font-weight: 600;
  margin-bottom: 24px; transition: all .3s; width: 100%; box-sizing: border-box;
}
.wallet-pill.connected {
  background: rgba(34,197,94,0.05); border: 1px solid rgba(34,197,94,.3); color: var(--g);
}
.wallet-pill.connected strong { font-weight: 700; color: #fff; }
.wpill-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--g); flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite; box-shadow: 0 0 10px var(--g);
}
.wallet-pill.scanning {
  background: rgba(251,191,36,.07); border: 1px solid rgba(251,191,36,.3); color: #fbbf24;
}
.wallet-pill.disconnected {
  background: rgba(251, 191, 36, 0.08); border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}
.wallet-pill.disconnected svg { flex-shrink: 0; color: #fbbf24; }

/* ── Email Option ── */
.email-option { margin-bottom: 28px; }
.input-label { display: block; font-size: .85rem; font-weight: 700; color: var(--tx); margin-bottom: 12px; }
.email-input-wrap { display: flex; position: relative; align-items: center; }
.email-icon { position: absolute; left: 16px; color: var(--step-p); display: flex; align-items: center; }
.email-input {
  width: 100%; padding: 14px 16px 14px 44px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.25);
  color: #fff; font-family: 'Courier New', monospace; font-size: 1rem;
  outline: none; transition: all 0.3s;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
}
.email-input::placeholder { color: var(--step-p); opacity: 0.6; font-family: var(--fd); font-size: 0.9rem; }
.email-input:focus { border-color: rgba(34, 197, 94, 0.5); background: rgba(0,0,0,0.4); box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1), inset 0 2px 5px rgba(0,0,0,0.2); }
.email-hint { margin: 10px 0 0; font-size: .8rem; color: var(--step-p); opacity: 0.8; }
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
  color: var(--dm, var(--step-p)); cursor: pointer; transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex; align-items: center; gap: 6px;
}
.ghost-btn:hover { 
  border-color: var(--g); 
  color: var(--g); 
  background: rgba(34,197,94,.1);
  transform: translateY(-2px);
}
.ghost-btn:disabled { opacity: .4; cursor: not-allowed; }

.primary-btn {
  font-family: var(--fd); font-size: .68rem; font-weight: 700;
  letter-spacing: .07em; text-transform: uppercase;
  padding: 8px 18px; border-radius: 100px;
  background: var(--g); color: #fff; border: none;
  cursor: pointer; transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex; align-items: center; gap: 6px;
}
.primary-btn:hover:not(:disabled) { 
  box-shadow: 0 8px 24px rgba(34,197,94,.4); 
  transform: translateY(-2px);
  background: #2ced6b;
}
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
