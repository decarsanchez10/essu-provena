<template>
  <div class="verified-document">
    <!-- Sealed Card - Read-only, Immutable Design -->
    <div class="verified-seal">
      <!-- Verification Badge - Prominent, locked -->
      <div class="verified-badge">
        <div class="badge-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <div class="badge-content">
          <span class="badge-title">Verified</span>
          <span class="badge-subtitle">Blockchain Anchored</span>
        </div>
        <div class="badge-lock">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>

      <!-- Document Hash Display -->
      <div class="verified-hash-row">
        <span class="hash-label">SHA-256 Hash</span>
        <div class="hash-display">
          <span class="hash-value mono">{{ documentHash }}</span>
          <button class="copy-btn" @click="handleCopy(documentHash)" title="Copy hash">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span class="copy-text">{{ copyLabel }}</span>
          </button>
        </div>
      </div>

      <!-- Blockchain Provenance Details -->
      <div class="verified-details">
        <div class="detail-row">
          <span class="detail-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Block Date
          </span>
          <span class="detail-value">{{ formattedBlockDate }}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
              <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
            </svg>
            Block Height
          </span>
          <div class="block-height-display">
            <span class="block-height-value mono">#{{ blockHeight }}</span>
            <button class="copy-btn-mini" @click="handleCopy(blockHeight)" title="Copy block height">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Transaction ID
          </span>
          <div class="tx-display">
            <span class="tx-value mono">{{ truncatedTxId }}</span>
            <a :href="explorerUrl" target="_blank" rel="noopener" class="explorer-link" title="View on Blockchain Explorer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <button class="copy-btn-mini" @click="handleCopy(txId)" title="Copy transaction ID">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Immutability Notice -->
      <div class="immutability-notice">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
        <span>This record is permanently anchored on the Bitcoin Cash blockchain and cannot be altered.</span>
      </div>

      <!-- Single Action: Verify Another -->
      <div class="verified-actions">
        <button class="action-secondary" @click="emit('new-verification')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
          Verify Another Document
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { EXPLORER_TX_URL, BLOCKCHAIR_TX_URL } from '../config'

// Props are immutable - no internal state changes after mount
const props = defineProps({
  documentHash: {
    type: String,
    required: true,
    validator: (v) => v && v.length === 64 // SHA-256 hex string
  },
  txId: {
    type: String,
    required: true,
    validator: (v) => v && v.length === 64
  },
  blockHeight: {
    type: [String, Number],
    required: true
  },
  blockDate: {
    type: String,
    required: true
  },
  explorerType: {
    type: String,
    default: 'default', // 'default' | 'blockchair'
    validator: (v) => ['default', 'blockchair'].includes(v)
  }
})

const emit = defineEmits(['new-verification'])

// Copy state
const copyLabel = ref('Copy')

// Computed values (derived from props, not reactive state)
const explorerUrl = computed(() => {
  return props.explorerType === 'blockchair'
    ? BLOCKCHAIR_TX_URL(props.txId)
    : EXPLORER_TX_URL(props.txId)
})

const truncatedTxId = computed(() => {
  const tx = props.txId
  return tx.length > 24 ? `${tx.slice(0, 12)}...${tx.slice(-12)}` : tx
})

const formattedBlockDate = computed(() => {
  try {
    const date = new Date(props.blockDate)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  } catch {
    return props.blockDate
  }
})

// Methods
function handleCopy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).then(() => {
    copyLabel.value = 'Copied!'
    setTimeout(() => { copyLabel.value = 'Copy' }, 2000)
  })
}
</script>

<style scoped>
.verified-document {
  width: 100%;
}

.verified-seal {
  background: linear-gradient(135deg, rgba(10, 21, 16, 0.6), rgba(5, 15, 10, 0.8));
  border: 1.5px solid rgba(34, 197, 94, 0.35);
  border-radius: 20px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(34, 197, 94, 0.1);
}

.verified-seal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.6), transparent);
}

/* Badge */
.verified-badge {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-radius: 14px;
  margin-bottom: 24px;
}

.badge-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
}

.badge-content {
  flex: 1;
}

.badge-title {
  display: block;
  font-family: var(--fd);
  font-size: 1.2rem;
  font-weight: 800;
  color: #22c55e;
  letter-spacing: -0.5px;
}

.badge-subtitle {
  display: block;
  font-size: 0.75rem;
  color: var(--step-p);
  margin-top: 2px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge-lock {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
}

/* Hash Row */
.verified-hash-row {
  margin-bottom: 20px;
}

.hash-label {
  display: block;
  font-family: var(--fd);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--g);
  margin-bottom: 8px;
}

.hash-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  flex-wrap: wrap;
}

.hash-value {
  flex: 1;
  font-size: 0.85rem;
  color: #fff;
  word-break: break-all;
  letter-spacing: 0.02em;
}

/* Details */
.verified-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: background 0.2s;
}

.detail-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--fd);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--step-p);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.detail-label svg {
  color: var(--g);
  opacity: 0.7;
}

.detail-value {
  font-size: 0.9rem;
  color: var(--tx);
}

.block-height-value {
  font-size: 0.85rem;
  color: var(--g);
  font-weight: 600;
}

.block-height-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tx-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tx-value {
  font-size: 0.8rem;
  color: var(--g);
}

/* Copy Buttons */
.copy-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.08);
  color: var(--g);
  font-family: var(--fd);
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: rgba(34, 197, 94, 0.15);
  border-color: var(--g);
}

.copy-btn-mini {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: var(--step-p);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.copy-btn-mini:hover {
  border-color: var(--g);
  color: var(--g);
  background: rgba(34, 197, 94, 0.1);
}

.explorer-link {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid rgba(34, 197, 94, 0.25);
  background: rgba(34, 197, 94, 0.08);
  color: var(--g);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
}

.explorer-link:hover {
  background: rgba(34, 197, 94, 0.15);
  border-color: var(--g);
  transform: translateY(-1px);
}

/* Immutability Notice */
.immutability-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 0.8rem;
  color: var(--step-p);
  line-height: 1.5;
}

.immutability-notice svg {
  flex-shrink: 0;
  color: var(--g);
}

/* Actions */
.verified-actions {
  display: flex;
  justify-content: center;
}

.action-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 100px;
  border: 1px solid rgba(34, 197, 94, 0.3);
  background: transparent;
  color: var(--g);
  font-family: var(--fd);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}

.action-secondary:hover {
  background: rgba(34, 197, 94, 0.1);
  border-color: var(--g);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 640px) {
  .verified-seal {
    padding: 20px;
  }

  .verified-badge {
    padding: 12px 16px;
  }

  .badge-icon {
    width: 40px;
    height: 40px;
  }

  .badge-title {
    font-size: 1rem;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .hash-display {
    flex-direction: column;
    align-items: stretch;
  }

  .copy-btn {
    justify-content: center;
  }
}
</style>
