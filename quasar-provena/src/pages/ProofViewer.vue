<template>
  <div class="verify-page">
    <!-- PAGE HEADER -->
    <div class="page-header gsap-header">
      <div class="header-content">
        <h1>Verify Notarization</h1>
        <p>Document anchored to the Bitcoin Cash blockchain.</p>
      </div>
    </div>
    
    
    <div class="main-column gsap-card">
      
      
      <div v-if="showInputForm" class="step-card input-card">
        <div class="card-header">
          <div class="verify-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          </div>
          <div class="card-title-group">
            <div class="card-title">Verify a Proof</div>
          </div>
        </div>

        
        <div class="upload-section">
          <label class="input-label">Upload Document to Verify</label>
          <p class="upload-privacy-note">
          </p>

          
          <div
            class="doc-dropzone"
            :class="{
              'doc-dropzone--dragging':  docIsDragging,
              'doc-dropzone--has-file':  docFile && !docResult && !docIsHashing,
              'doc-dropzone--verified':  docFile && docResult && docResult.found,
              'doc-dropzone--not-found': docFile && docResult && !docResult.found
            }"
            @dragover.prevent="docIsDragging = true"
            @dragleave.prevent="docIsDragging = false"
            @drop.prevent="onDocDrop"
            @click="onDocDropzoneClick"
          >
            <input ref="docFileInput" type="file" class="doc-file-input" @change="onDocFileChange" />

            
            <template v-if="!docFile && !docIsHashing">
              <svg class="dz-upload-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              <span class="dz-primary">Upload your document</span>
            </template>

            
            <template v-else-if="docIsHashing">
              <svg class="spin dz-upload-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </template>

            
            <template v-else-if="docIsLookingUp">
              <svg class="spin dz-upload-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <span class="dz-primary">Searching blockchain records…</span>
              <span class="dz-secondary">{{ docFile.name }}</span>
            </template>

            
            <template v-else-if="docFile && !docResult">
              <div class="dz-file-row">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dz-file-icon"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                <div>
                  <span class="dz-primary">{{ docFile.name }}</span>
                  <span class="dz-secondary">{{ docFormatSize(docFile.size) }}</span>
                </div>
              </div>
              <div class="dz-hash-pill">
                <span class="dz-hash-label">SHA-256</span>
                <span class="dz-hash-val mono">{{ docComputedHash }}</span>
              </div>
            </template>

            
            <template v-else-if="docFile && docResult && docResult.found">
              <div class="dz-status-icon dz-status-icon--ok">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              </div>
              <span class="dz-primary dz-primary--ok">Verified</span>
              <span class="dz-secondary">{{ docFile.name }}</span>
            </template>

            
            <template v-else-if="docFile && docResult && !docResult.found">
              <div class="dz-status-icon dz-status-icon--fail">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <span class="dz-primary dz-primary--fail">Not Verified</span>
              <span class="dz-secondary">This file has not been notarized or has been modified.</span>
            </template>
          </div>

          <!-- UPDATED: doc anchor result now uses irow card style to match the success card -->
          <div v-if="docFile && docResult && docResult.found" class="doc-anchor-table">
            <div class="doc-anchor-header">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Blockchain Anchor Verified
            </div>
            <div class="irow">
              <span class="ikey">Block Date</span>
              <div class="ival-row"><span class="ival">{{ docResult.blockDate }}</span></div>
            </div>
            <div class="irow">
              <span class="ikey">Block Height</span>
              <div class="ival-row"><span class="ival mono">#{{ docResult.blockHeight }}</span></div>
            </div>
            <div class="irow">
              <span class="ikey">Transaction ID</span>
              <div class="ival-row">
                <span class="ival mono">{{ docResult.txId }}</span>
                <a :href="docResult.txUrl" target="_blank" rel="noopener" class="icon-btn" title="View on Explorer">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>
          </div>

          
          <div v-if="docFile && docResult && !docResult.found" class="doc-result-block doc-result-block--fail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>No matching anchor was found. The document may not have been notarized yet, or its cryptographic hash has changed due to modifications.</span>
          </div>

          
          <div v-if="docFile && !docIsHashing && !docIsLookingUp" class="doc-action-row">
            <button class="secondary-btn" @click="docClear">
              Clear
            </button>
            <button v-if="!docResult" class="primary-btn doc-lookup-btn" @click.stop="docLookUpHash">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Look Up Timestamp
            </button>
          </div>
        </div>

        
        <div v-if="!docFile" class="token-section">
          <div class="or-divider">
            <span class="or-line" />
            <span class="or-label">OR</span>
            <span class="or-line" />
          </div>

          <div class="input-group">
            <label class="input-label">Verification Link or Token</label>
            <div class="input-row">
              <input
                v-model="tokenInput"
                type="text"
                class="token-input"
                placeholder="Paste your verification link or token UUID..."
                @keyup.enter="submitToken"
              />
            </div>
            <p class="input-hint">
              Example: <span class="mono">https://provena.app/verify/a1b2c3d4-...</span> or just the token UUID
            </p>
          </div>

          <button class="primary-btn" @click="submitToken" :disabled="!tokenInput.trim()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            Verify Proof
          </button>
          
          <p v-if="inputError" class="input-error">{{ inputError }}</p>
        </div>
      </div>

      
      <div v-else-if="loading" class="status-box">
        <svg class="spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <p>Verifying link...</p>
      </div>

      
      <div v-else-if="error" class="status-box error">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <h2>{{ error }}</h2>
        <p>This link may have already been used, expired, or is invalid.</p>
        <div class="error-actions">
          <button class="primary-btn mt-4" @click="resetToInput">Try Another Token</button>
          <button class="secondary-btn mt-4" @click="$router.push('/')">Go Home</button>
        </div>
      </div>

      
      <div v-else class="step-card success-card">
        <div class="card-header">
          <div class="success-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          </div>
          <div class="card-title-group">
            <div class="card-title">Valid Proof</div>
            <div class="card-sub">{{ record.created_at ? new Date(record.created_at).toLocaleString() : '' }}</div>
          </div>
        </div>


        <div class="info-table">
          <div class="irow">
            <span class="ikey">Document Hash</span>
            <div class="ival-row">
              <span class="ival mono">{{ record.document_hash }}</span>
            </div>
          </div>
          <div class="irow">
            <span class="ikey">Transaction ID</span>
            <div class="ival-row">
              <span class="ival mono">{{ record.txid }}</span>
              <a :href="`https://bchexplorer.info/tx/${record.txid}`" target="_blank" class="icon-btn" title="View on Explorer">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </div>

        
        <div v-if="record.preview_url" class="file-action">
          <h3>Original Document</h3>
          
          <div v-if="isImage" class="file-preview-box">
            <img :src="record.preview_url" class="img-preview" alt="Document Preview" />
          </div>
          <div v-else-if="isPdf" class="file-preview-box">
            <iframe :src="record.preview_url" class="pdf-preview" title="Document Preview"></iframe>
          </div>
          <div v-else class="file-preview-box no-preview">
            Preview not available for this file type ({{ record.file_name }}). Please download to view.
          </div>

          <div class="expiration-warning">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <strong>Security Notice:</strong> For your privacy, this download link is valid for <strong>one-time use only</strong> and will expire in <strong>24 hours</strong>.
          </div>

          <a :href="record.file_url" target="_blank" class="primary-btn download-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Document
          </a>
          <p class="file-link">Link: <a :href="record.file_url" target="_blank">{{ record.file_url }}</a></p>
        </div>

        
        <div v-else class="file-action no-doc">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="13 2 13 9 20 9"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          <h3>Document Not Hosted</h3>
          <p>The creator of this proof chose not to store the original document on our servers. The blockchain proof above is still fully valid and can be verified independently if you have the original file.</p>
        </div>

        
        <div class="verify-another">
          <button class="secondary-btn" @click="resetToInput">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            Verify Another Proof
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { gsap } from 'gsap'
import { useRoute, useRouter } from 'vue-router'

const route  = useRoute()
const router = useRouter()
const loading       = ref(false)
const error         = ref(null)
const record        = ref(null)
const showInputForm = ref(true)
const tokenInput    = ref('')
const inputError    = ref('')

const docFileInput    = ref(null)
const docFile         = ref(null)
const docIsDragging   = ref(false)
const docIsHashing    = ref(false)
const docIsLookingUp  = ref(false)
const docComputedHash = ref('')
const docResult       = ref(null)

// Computed properties mapping from the unified 'record' object
const isImage = computed(() => {
  if (!record.value?.file_name) return false
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(record.value.file_name)
})
const isPdf = computed(() => {
  if (!record.value?.file_name) return false
  return /\.pdf$/i.test(record.value.file_name)
})

function extractToken(input) {
  const trimmed  = input.trim()
  const urlMatch = trimmed.match(/\/verify\/([a-f0-9-]+)/i)
  if (urlMatch) return urlMatch[1]
  const uuidMatch = trimmed.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)
  if (uuidMatch) return trimmed
  return trimmed || null
}

// 1. Verification via Link/Token
async function verifyToken(token) {
  loading.value       = true
  error.value         = null
  record.value        = null
  showInputForm.value = false
  try {
    const res = await fetch(`http://localhost:8000/api/records/verify/${token}/`)
    if (!res.ok) { router.replace('/404'); return }
    record.value = await res.json()
  } catch {
    router.replace('/404')
  } finally {
    loading.value = false
  }
}

function submitToken() {
  inputError.value = ''
  const token = extractToken(tokenInput.value)
  if (!token) { inputError.value = 'Please enter a valid verification link or token.'; return }
  router.push(`/verify/${token}`)
  verifyToken(token)
}

// 2. Verification via Uploaded File Hash (REAL BACKEND MAPPING)
async function docLookUpHash() {
  if (!docComputedHash.value) return
  docIsLookingUp.value = true
  try {
    const res = await fetch(`http://localhost:8000/api/records/lookup/?hash=${docComputedHash.value}`)
    if (res.status === 404) { docResult.value = { found: false }; return }
    if (!res.ok) { console.error('Lookup failed:', res.status); return }
    
    const data = await res.json()
    
    if (data?.found) {
      // Map the real properties from your backend directly into your template's layout fields
      record.value = {
        created_at:    data.block_date   ?? data.blockDate   ?? new Date().toISOString(),
        document_hash: docComputedHash.value,
        txid:          data.tx_id        ?? data.txId        ?? '—',
        file_name:     data.file_name    ?? (docFile.value ? docFile.value.name : 'document'),
        preview_url:   data.preview_url  ?? data.previewUrl  ?? null,
        file_url:      data.file_url     ?? data.fileUrl     ?? null
      }
      
      // Hide input layout and route into the success view state
      showInputForm.value = false
    } else {
      docResult.value = { found: false }
    }
  } catch { 
    console.error('Lookup network error') 
  } finally { 
    docIsLookingUp.value = false 
  }
}

async function docProcessFile(file) {
  docFile.value         = file
  docIsHashing.value    = true
  docResult.value       = null
  docComputedHash.value = ''
  try {
    const buf    = await file.arrayBuffer()
    const digest = await crypto.subtle.digest('SHA-256', buf)
    docComputedHash.value = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
    await docLookUpHash()
  } catch { 
    console.error('Hashing failed')
    docClear() 
  } finally { 
    docIsHashing.value = false 
  }
}

function onDocDropzoneClick() { if (!docFile.value) docFileInput.value?.click() }
function onDocDrop(e) { docIsDragging.value = false; const f = e.dataTransfer?.files?.[0]; if (f) docProcessFile(f) }
function onDocFileChange(e) { const f = e.target?.files?.[0]; if (f) docProcessFile(f) }

function docClear() {
  docFile.value         = null
  docComputedHash.value = ''
  docResult.value       = null
  docIsHashing.value    = false
  docIsLookingUp.value  = false
  if (docFileInput.value) docFileInput.value.value = ''
}

function resetToInput() {
  error.value         = null
  record.value        = null
  loading.value       = false
  showInputForm.value = true
  tokenInput.value    = ''
  inputError.value    = ''
  router.push('/verify')
  docClear()
}

function docFormatSize(bytes) {
  if (bytes < 1024)    return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

onMounted(() => {
  gsap.from('.gsap-header', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' })
  gsap.from('.gsap-card',   { y: 40,  opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 })
  const token = route.params.token
  if (token) { verifyToken(token); showInputForm.value = false }
  else showInputForm.value = true
})
</script>

<style scoped>
.verify-page {
  padding-top: 40px;
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 80px;
}
.page-header {
  padding: 60px 24px 40px;
  text-align: center;
  background: transparent;
  margin-bottom: 16px;
}
.header-content h1 {
  font-family: var(--fd);
  font-size: 3rem;
  font-weight: 800;
  color: var(--tx);
  margin: 0 0 16px;
  letter-spacing: -1.5px;
}
.header-content p {
  font-family: var(--fd);
  font-size: 1.15rem;
  color: var(--step-p);
  margin: 0;
}
.main-column {
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;
}
.status-box {
  text-align: center;
  padding: 80px 40px;
  background: rgba(10, 21, 16, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}
.status-box p { color: var(--step-p); font-size: 1.1rem; }
.status-box.error { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.05); }
.status-box.error svg { color: #ef4444; }
.status-box.error h2 { margin: 0; color: #ef4444; font-size: 1.75rem; }

.step-card {
  background: rgba(10, 21, 16, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
  isolation: isolate;
  z-index: 0;
}
.step-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent);
  z-index: 0;
  pointer-events: none;
}
.success-card { border-color: rgba(34,197,94,.4); }

.card-header {
  display: flex; align-items: center; gap: 20px; margin-bottom: 32px;
  padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,.06);
}
.success-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(34,197,94,.15); border: 1.5px solid rgba(34,197,94,.4);
  display: flex; align-items: center; justify-content: center;
  color: var(--g); flex-shrink: 0;
  box-shadow: 0 0 20px rgba(34,197,94,0.2);
}
.card-title-group { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.card-title { font-family: var(--fd); font-size: 1.3rem; font-weight: 700; color: var(--tx); }
.card-sub { font-size: .85rem; color: var(--step-p); }

.info-table { display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
.irow {
  display: flex; flex-direction: column; gap: 8px;
  padding: 16px 20px; background: rgba(0,0,0,.2);
  border: 1px solid rgba(255,255,255,.05); border-radius: 12px;
  transition: all 0.3s;
}
.irow:hover { background: rgba(255,255,255,.03); border-color: rgba(255,255,255,.1); }
.ikey { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--g); }
.ival-row { display: flex; align-items: center; gap: 12px; overflow: hidden; }
.ival { font-size: .95rem; color: var(--tx); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mono { font-family: 'Courier New', monospace; letter-spacing: 0; }
.icon-btn {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  color: var(--step-p); cursor: pointer; flex-shrink: 0; transition: all 0.2s;
}
.icon-btn:hover { border-color: var(--g); color: var(--g); background: rgba(34,197,94,0.1); transform: translateY(-1px); }

.file-action {
  margin-top: 32px; padding-top: 32px;
  border-top: 1px solid rgba(255,255,255,.06);
  text-align: center;
}
.file-action h3 { margin: 0 0 16px; color: var(--tx); font-size: 1.3rem; font-weight: 700; }
.no-doc {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 32px 24px;
}
.no-doc svg { color: var(--step-p); }
.no-doc h3 { margin: 0; }
.no-doc p  { color: var(--step-p); font-size: 0.9rem; max-width: 480px; }
.no-preview {
  padding: 24px; color: #ef4444; font-size: 0.9rem;
  background: rgba(239,68,68,0.05); border-radius: 8px;
}

.expiration-warning {
  margin: 0 auto 24px;
  max-width: 540px;
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 12px;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.3);
  color: #fbbf24; font-size: 0.9rem; line-height: 1.5; text-align: left;
}
.expiration-warning svg { flex-shrink: 0; }

.file-preview-box {
  margin: 0 auto 24px; max-width: 100%;
  border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
  overflow: hidden; background: rgba(0,0,0,0.3);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.img-preview { display: block; max-width: 100%; max-height: 500px; margin: 0 auto; object-fit: contain; }
.pdf-preview { width: 100%; height: 500px; border: none; display: block; background: #fff; }

.file-link { margin-top: 12px; font-size: 0.8rem; word-break: break-all; color: var(--step-p); }
.file-link a { color: var(--g); }

.download-btn { display: inline-flex; justify-content: center; width: auto; padding: 14px 28px; }
.mt-4 { margin-top: 16px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.primary-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 16px; border-radius: 14px; border: none;
  background: var(--g); color: #fff;
  font-family: var(--fd); font-size: 1.05rem; font-weight: 700;
  cursor: pointer; transition: all .3s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 4px 14px rgba(34,197,94,.2); text-decoration: none;
  margin-top: 16px;
}
.primary-btn:hover:not(:disabled) { transform: translateY(-2px); background: #16a34a; box-shadow: 0 6px 20px rgba(34,197,94,.3); }
.primary-btn:active:not(:disabled) { transform: translateY(1px); }
.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(50%); }

.secondary-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 16px; border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);
  color: var(--tx); font-family: var(--fd); font-size: 1rem; font-weight: 600;
  cursor: pointer; transition: all .3s cubic-bezier(0.4,0,0.2,1); text-decoration: none;
}
.secondary-btn:hover { border-color: rgba(34,197,94,0.5); color: var(--g); background: rgba(34,197,94,0.05); transform: translateY(-1px); }

.verify-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(34,197,94,.1); border: 1.5px solid rgba(34,197,94,.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--g); flex-shrink: 0;
  box-shadow: 0 0 20px rgba(34,197,94,0.1);
}

.input-card { border-color: rgba(34,197,94,.2); }
.input-card::before { background: linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent); }

.input-group { margin-bottom: 28px; }
.input-label {
  display: block; font-size: .8rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: var(--g); margin-bottom: 12px;
}
.input-row { display: flex; gap: 8px; position: relative; }
.token-input {
  flex: 1; padding: 18px 24px; border-radius: 14px;
  border: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.25);
  color: #fff; font-family: 'Courier New', monospace; font-size: 1rem;
  outline: none; transition: all .3s;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
}
.token-input::placeholder { color: var(--step-p); opacity: 0.5; font-family: var(--fd); }
.token-input:focus {
  border-color: rgba(34,197,94,.4);
  box-shadow: 0 0 0 4px rgba(34,197,94,.1), inset 0 2px 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,.4);
}
.input-hint { margin: 12px 0 0; font-size: .8rem; color: var(--step-p); opacity: 0.7; }
.input-error { margin: 16px 0 0; font-size: .9rem; color: #ef4444; font-weight: 600; text-align: center; }

.verify-another { margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,.06); }

.or-divider { display: flex; align-items: center; gap: 16px; margin: 28px 0 24px; }
.or-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
.or-label { font-size: 0.75rem; font-weight: 700; color: var(--step-p); letter-spacing: 0.12em; opacity: 0.5; }

.upload-section { margin-top: 4px; position: relative; z-index: 1; }
.upload-privacy-note {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.78rem; color: var(--step-p); opacity: 0.65; margin: -4px 0 14px;
}
.upload-privacy-note svg { flex-shrink: 0; color: var(--g); opacity: 0.7; }

.doc-dropzone {
  border: 1.5px dashed rgba(34,197,94,0.25);
  border-radius: 16px;
  padding: 28px 20px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; cursor: pointer;
  background: rgba(0,0,0,0.2);
  min-height: 130px; text-align: center;
  transition: border-color 0.2s, background 0.2s;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  z-index: 1;
}
.doc-dropzone:hover { border-color: rgba(34,197,94,0.5); background: rgba(34,197,94,0.04); }
.doc-dropzone--dragging { border-color: rgba(34,197,94,0.7); background: rgba(34,197,94,0.06); }
.doc-dropzone--has-file { border-style: solid; border-color: rgba(34,197,94,0.35); cursor: default; }
.doc-dropzone--verified { border-style: solid; border-color: rgba(34,197,94,0.55); background: rgba(34,197,94,0.05); cursor: default; }
.doc-dropzone--not-found { border-style: solid; border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.04); cursor: default; }
.doc-file-input { display: none; }

.dz-upload-icon { color: rgba(34,197,94,0.45); margin-bottom: 4px; }
.dz-primary { font-size: 0.95rem; font-weight: 600; color: var(--tx); }
.dz-primary--ok   { color: #22c55e; }
.dz-primary--fail { color: #ef4444; }
.dz-secondary { font-size: 0.8rem; color: var(--step-p); opacity: 0.7; }

.dz-file-row { display: flex; align-items: center; gap: 10px; }
.dz-file-icon { color: var(--g); flex-shrink: 0; }

.dz-hash-pill {
  display: flex; align-items: center; gap: 8px;
  background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px; padding: 5px 12px; margin-top: 6px;
  max-width: 100%; overflow: hidden;
}
.dz-hash-label { font-size: 0.65rem; font-weight: 700; color: var(--g); letter-spacing: 0.08em; flex-shrink: 0; }
.dz-hash-val { font-size: 0.65rem; color: var(--step-p); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.dz-status-icon {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
}
.dz-status-icon--ok   { background: rgba(34,197,94,0.15); color: #22c55e; }
.dz-status-icon--fail { background: rgba(239,68,68,0.15); color: #ef4444; }

/* UPDATED: anchor result uses irow card style matching the success card */
.doc-anchor-table {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.doc-anchor-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--g);
  letter-spacing: 0.09em;
  text-transform: uppercase;
  margin-bottom: -4px;
}

.doc-result-block { border-radius: 12px; padding: 16px 20px; margin-top: 14px; font-size: 0.85rem; }
.doc-result-block--fail {
  background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.25);
  color: #f87171; display: flex; gap: 10px; align-items: flex-start; line-height: 1.6;
}
.doc-result-block--fail svg { flex-shrink: 0; margin-top: 2px; }

.doc-action-row { display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-top: 14px; }
.doc-ghost-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: var(--step-p);
  font-size: 0.82rem;
  font-family: var(--fd);
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.doc-ghost-btn:hover {
  border-color: rgba(34,197,94,0.4);
  color: var(--g);
  background: rgba(34,197,94,0.05);
}
.doc-lookup-btn { width: auto; padding: 10px 20px; font-size: 0.9rem; margin-top: 0; }

.error-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }
</style>

<style>
body > *:not(#q-app) {
  z-index: 0 !important;
}
</style>
