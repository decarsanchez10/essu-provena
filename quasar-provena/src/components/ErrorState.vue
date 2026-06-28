<template>
  <div class="error-state">
    <div class="error-card">
      <div class="error-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      <div class="error-content">
        <h3 class="error-title">{{ title }}</h3>
        <p class="error-message">{{ message }}</p>
      </div>

      <div class="error-actions">
        <button v-if="showRetry" class="retry-btn" @click="emit('retry')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-4.32"/>
          </svg>
          Try Again
        </button>
        <button v-if="showDismiss" class="dismiss-btn" @click="emit('dismiss')">
          Dismiss
        </button>
      </div>

      <div v-if="details" class="error-details">
        <details>
          <summary>Technical Details</summary>
          <pre>{{ details }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Something went wrong'
  },
  message: {
    type: String,
    default: 'An unexpected error occurred. Please try again.'
  },
  details: {
    type: String,
    default: ''
  },
  showRetry: {
    type: Boolean,
    default: true
  },
  showDismiss: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['retry', 'dismiss'])
</script>

<style scoped>
.error-state {
  width: 100%;
}

.error-card {
  background: linear-gradient(135deg, rgba(30, 15, 15, 0.5), rgba(20, 10, 10, 0.7));
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
}

.error-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  margin: 0 auto 20px;
}

.error-content {
  margin-bottom: 24px;
}

.error-title {
  font-family: var(--fd);
  font-size: 1.2rem;
  font-weight: 700;
  color: #ef4444;
  margin: 0 0 12px;
}

.error-message {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--step-p);
  margin: 0;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 100px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  font-family: var(--fd);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
}

.dismiss-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: var(--step-p);
  font-family: var(--fd);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.dismiss-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--tx);
}

.error-details {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: left;
}

.error-details summary {
  font-family: var(--fd);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--step-p);
  cursor: pointer;
  margin-bottom: 12px;
}

.error-details summary:hover {
  color: var(--tx);
}

.error-details pre {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--step-p);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

@media (max-width: 640px) {
  .error-card {
    padding: 24px;
  }

  .retry-btn, .dismiss-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
