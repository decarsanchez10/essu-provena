<template>
  <section class="history-section" id="notarization-history">
    <div class="history-inner">
      <div class="section-label">History</div>
      <h2 class="section-title">Your Notarizations</h2>
      <p class="section-description">
        All documents you've anchored to the Bitcoin Cash blockchain are listed below.
      </p>

      <div v-if="records.length === 0" class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12h6m-6 4h6M9 8h6m-6-4h6M5 20h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"/>
        </svg>
        <h3>No notarizations yet</h3>
        <p>Upload and anchor your first document to get started.</p>
      </div>

      <div v-else class="records-table">
        <div class="table-header">
          <div class="col-hash">Document Hash</div>
          <div class="col-txid">Transaction ID</div>
          <div class="col-date">Date</div>
          <div class="col-actions">Actions</div>
        </div>

        <div v-for="(record, idx) in records" :key="idx" class="table-row">
          <div class="col-hash">
            <div class="hash-badge">{{ truncateHash(record.hash) }}</div>
            <button class="btn-copy" @click="copyToClipboard(record.hash)" title="Copy full hash">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>

          <div class="col-txid">
            <div class="txid-badge">{{ truncateHash(record.txid) }}</div>
            <button class="btn-copy" @click="copyToClipboard(record.txid)" title="Copy TXID">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>

          <div class="col-date">
            <span class="date-text">{{ formatDate(record.timestamp) }}</span>
            <span class="time-text">{{ formatTime(record.timestamp) }}</span>
          </div>

          <div class="col-actions">
            <a :href="`https://bchexplorer.info/tx/${record.txid}`" target="_blank" class="btn-action" title="View on BCH Explorer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              View
            </a>
            <button class="btn-action" @click="generateLink(record)" title="Generate single-use view link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Get Verification Link
            </button>
            <button class="btn-action btn-delete" @click="removeRecord(idx)" title="Remove from history">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="records.length > 0" class="history-actions">
        <button class="btn-export" @click="exportRecords">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export Records
        </button>
        <button class="btn-clear" @click="clearAllRecords">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          Clear All
        </button>
      </div>
      <div v-if="generatedLink" class="link-modal-overlay" @click.self="generatedLink = null">
        <div class="link-modal" style="position: relative;">
          <button @click="generatedLink = null" class="modal-x-btn">&times;</button>
          <h3>Verification Link</h3>
          <p>Share this link to verify your document. Expires in 24 hours.</p>
          <div class="link-box">
            <input type="text" readonly :value="generatedLink" />
          </div>
          <div style="display: flex; gap: 12px;">
            <button class="btn-close modal-copy-link" @click="copyToClipboard(generatedLink)">
              Copy Link
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
            <a :href="generatedLink" target="_blank" class="modal-open-link">
              Open Link
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadRecords } from '../services/saveNotarizationRecord.js'

const emit = defineEmits(['toast'])

const records = ref([])
const generatedLink = ref(null)
onMounted(() => refreshRecords())

function refreshRecords() {
  records.value = loadRecords()
}

defineExpose({ refreshRecords })

async function generateLink(record) {
  try {
    let rId = record.record_id
    if (!rId) {
      const formData = new FormData()
      formData.append('document_hash', record.hash)
      formData.append('txid', record.txid)
      
      const syncRes = await fetch('http://localhost:8000/api/records/', {
        method: 'POST',
        body: formData
      })
      if (!syncRes.ok) throw new Error('Failed to sync local record to server')
      const data = await syncRes.json()
      rId = data.record_id
      
      // Update local storage so we don't sync again
      record.record_id = rId
      const allRecords = JSON.parse(localStorage.getItem('pv') || '[]')
      const match = allRecords.find(r => r.hash === record.hash && r.txid === record.txid)
      if (match) {
        match.record_id = rId
        localStorage.setItem('pv', JSON.stringify(allRecords))
      }
    }

    const res = await fetch(`http://localhost:8000/api/records/${rId}/generate-link/`, {
      method: 'POST'
    })
    if (!res.ok) throw new Error('Failed to generate link')
    const data = await res.json()
    generatedLink.value = `${window.location.origin}/#/verify/${data.token}`
  } catch (err) {
    emit('toast', 'ERR:Error generating link: ' + err.message)
  }
}

function truncateHash(hash) {
  if (!hash) return 'N/A'
  return hash.length > 20 ? hash.slice(0, 10) + '...' + hash.slice(-10) : hash
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => emit('toast', 'Copied to clipboard!'))
}

function removeRecord(index) {
  if (confirm('Remove this record from your local history?')) {
    records.value.splice(index, 1)
    localStorage.setItem('pv', JSON.stringify(records.value))
    refreshRecords()
  }
}

function clearAllRecords() {
  if (confirm('Clear all notarization records? This cannot be undone.')) {
    records.value = []
    localStorage.removeItem('pv')
    refreshRecords()
  }
}

function exportRecords() {
  const data = JSON.stringify(records.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `provena-notarizations-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* ── Section ── */
.history-section {
  background: var(--bg);
  padding: 60px 20px;
  border-top: 1px solid var(--gb);
  transition: background .35s, border-color .35s;
}

.history-inner {
  max-width: 820px;
  margin: 0 auto;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--g);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-label::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 1.5px;
  background: var(--g);
  border-radius: 2px;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--tx);
  margin-bottom: 12px;
  transition: color .3s;
}

.section-description {
  color: var(--step-p);
  font-size: 1rem;
  margin-bottom: 32px;
  max-width: 600px;
  line-height: 1.65;
  transition: color .3s;
}

/* ── Empty State ── */
.empty-state {
  text-align: center;
  padding: 60px 40px;
  background: rgba(0, 0, 0, 0.25);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
  transition: background .35s, border-color .35s;
}
.empty-state svg { color: var(--gb); margin-bottom: 16px; }
.empty-state h3  { font-size: 1.1rem; font-weight: 700; color: var(--tx); margin-bottom: 8px; transition: color .3s; }
.empty-state p   { color: var(--step-p); transition: color .3s; }

/* ── Table ── */
.records-table {
  background: rgba(10, 21, 16, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: background .35s, border-color .35s;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr;
  gap: 16px;
  padding: 14px 20px;
  background: rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--step-p);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: background .35s, border-color .35s;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  transition: background .2s, border-color .35s;
}
.table-row:hover      { background: rgba(255, 255, 255, 0.03); }
.table-row:last-child { border-bottom: none; }

/* ── Columns ── */
.col-hash, .col-txid {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.hash-badge, .txid-badge {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--g);
  word-break: break-all;
  line-height: 1.4;
}

.btn-copy {
  background: transparent;
  border: 1px solid var(--gb);
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  color: var(--step-p);
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-copy:hover { border-color: var(--g); color: var(--g); }

.col-date { display: flex; flex-direction: column; gap: 2px; }
.date-text { font-size: 0.9rem; font-weight: 600; color: var(--tx); transition: color .3s; }
.time-text { font-size: 0.75rem; color: var(--step-p); transition: color .3s; }

.col-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--gb);
  border-radius: 6px;
  color: var(--step-p);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-action:hover       { border-color: var(--g); color: var(--g); }
.btn-action.btn-delete:hover { border-color: #ef4444; color: #ef4444; }
.btn-action svg { color: inherit; }

/* ── History Actions ── */
.history-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.btn-export, .btn-clear {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.25);
  color: var(--step-p);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
}
.btn-export:hover { border-color: var(--g); color: var(--g); }
.btn-clear:hover  { border-color: #ef4444; color: #ef4444; }
.btn-export svg, .btn-clear svg { color: inherit; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .table-header { display: none; }

  .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 16px;
  }

  .col-hash::before,
  .col-txid::before,
  .col-date::before,
  .col-actions::before {
    display: block;
    font-weight: 700;
    color: var(--step-p);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }
  .col-hash::before    { content: 'Hash'; }
  .col-txid::before    { content: 'TXID'; }
  .col-date::before    { content: 'Date'; }
  .col-actions::before { content: 'Actions'; }

  .history-actions { justify-content: center; }
}

/* ── Modal ── */
.link-modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.link-modal {
  background: rgba(10, 21, 16, 0.6); backdrop-filter: blur(20px);
  padding: 40px; border-radius: 24px;
  border: 1px solid rgba(34, 197, 94, 0.2); max-width: 450px; width: 100%;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
}
.link-modal h3 { margin: 0 0 12px; font-size: 1.35rem; font-weight: 700; color: var(--tx); }
.link-modal p { color: var(--step-p); font-size: 0.95rem; margin-bottom: 24px; line-height: 1.6; }
.link-box { display: flex; gap: 8px; margin-bottom: 24px; }
.link-box input {
  flex: 1; padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; background: rgba(0,0,0,0.25); color: #fff;
  font-family: 'Courier New', monospace; outline: none; transition: all 0.3s;
}
.link-box input:focus { border-color: rgba(34, 197, 94, 0.5); background: rgba(0,0,0,0.4); }
.btn-close {
  width: 100%; padding: 16px; background: var(--g); color: #fff;
  border: none; border-radius: 12px; font-weight: 700; font-size: 1.05rem; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(34,197,94,0.2);
}
.btn-close:hover { background: #16a34a; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34,197,94,0.3); }

.modal-x-btn {
  position: absolute; top: 16px; right: 20px; background: none; border: none;
  color: var(--step-p); font-size: 1.5rem; cursor: pointer; line-height: 1; padding: 4px;
  transition: color 0.2s ease;
}
.modal-x-btn:hover { color: #ef4444; }

.modal-copy-link {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
}

.modal-open-link {
  flex: 1; padding: 16px; border-radius: 12px; font-weight: 700; font-size: 1.05rem;
  background: transparent; border: 1px solid var(--gb); color: var(--step-p);
  text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.2s ease;
}
.modal-open-link:hover { border-color: var(--g); color: var(--g); }
</style>
