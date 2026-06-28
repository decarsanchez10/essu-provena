<template>
  <div class="unverified-document">
    <div class="unverified-card">
      <!-- Unverified Badge -->
      <div class="unverified-badge">
        <div class="badge-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <div class="badge-content">
          <span class="badge-title">Not Verified</span>
          <span class="badge-subtitle">No blockchain record found</span>
        </div>
      </div>

      <!-- Explanation -->
      <div class="explanation">
        <p class="explanation-text">
          No matching anchor was found for this document's cryptographic hash on the Bitcoin Cash blockchain.
        </p>
        <ul class="explanation-list">
          <li>The document may not have been notarized yet</li>
          <li>The document may have been modified after notarization</li>
          <li>You may be checking a different version of the document</li>
        </ul>
      </div>

      <!-- Document Hash (if provided) -->
      <div v-if="documentHash" class="hash-section">
        <span class="hash-label">Document Hash (SHA-256)</span>
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

      <!-- Next Steps -->
      <div class="next-steps">
        <h4 class="next-steps-title">What you can do:</h4>
        <div class="next-steps-grid">
          <button class="next-step-btn" @click="emit('notarize')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
            <span>
              <span class="btn-title">Notarize This Document</span>
              <span class="btn-desc">Create a permanent blockchain proof</span>
            </span>
          </button>
          <button class="next-step-btn secondary" @click="emit('verify-another')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
            <span>
              <span class="btn-title">Verify Another Document</span>
              <span class="btn-desc">Check a different file</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props are immutable - no internal state changes after mount
defineProps({
  documentHash: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['notarize', 'verify-another'])

const copyLabel = ref('Copy')

function handleCopy(text) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    copyLabel.value = 'Copied!'
    setTimeout(() => { copyLabel.value = 'Copy' }, 2000)
  })
}
</script>

<style scoped>
.unverified-document {
  width: 100%;
}

.unverified-card {
  background: linear-gradient(135deg, rgba(30, 15, 15, 0.5), rgba(20, 10, 10, 0.7));
  border: 1.5px solid rgba(239, 68, 68, 0.25);
  border-radius: 20px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(239, 68, 68, 0.05);
}

.unverified-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4), transparent);
}

/* Badge */
.unverified-badge {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 14px;
  margin-bottom: 24px;
}

.badge-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
}

.badge-content {
  flex: 1;
}

.badge-title {
  display: block;
  font-family: var(--fd);
  font-size: 1.2rem;
  font-weight: 800;
  color: #ef4444;
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

/* Explanation */
.explanation {
  margin-bottom: 24px;
}

.explanation-text {
  font-size: 0.95rem;
  color: var(--tx);
  margin: 0 0 12px;
  line-height: 1.6;
}

.explanation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.explanation-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--step-p);
  padding-left: 20px;
  position: relative;
}

.explanation-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.5);
}

/* Hash Section */
.hash-section {
  margin-bottom: 24px;
}

.hash-label {
  display: block;
  font-family: var(--fd);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ef4444;
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
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  word-break: break-all;
  letter-spacing: 0.02em;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  font-family: var(--fd);
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
}

/* Next Steps */
.next-steps {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.next-steps-title {
  font-family: var(--fd);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--tx);
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.next-steps-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.next-step-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 14px;
  border: 1px solid rgba(34, 197, 94, 0.25);
  background: rgba(34, 197, 94, 0.05);
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
}

.next-step-btn:hover {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateX(4px);
}

.next-step-btn svg {
  color: var(--g);
  flex-shrink: 0;
}

.next-step-btn span {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.btn-title {
  font-family: var(--fd);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--tx);
}

.btn-desc {
  font-size: 0.75rem;
  color: var(--step-p);
}

.next-step-btn.secondary {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.next-step-btn.secondary svg {
  color: var(--step-p);
}

.next-step-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.next-step-btn.secondary .btn-title {
  color: var(--step-p);
}

/* Responsive */
@media (max-width: 640px) {
  .unverified-card {
    padding: 20px;
  }

  .unverified-badge {
    padding: 12px 16px;
  }

  .badge-icon {
    width: 40px;
    height: 40px;
  }

  .badge-title {
    font-size: 1rem;
  }

  .hash-display {
    flex-direction: column;
    align-items: stretch;
  }

  .copy-btn {
    justify-content: center;
  }

  .next-step-btn {
    padding: 14px 16px;
  }
}
</style>
