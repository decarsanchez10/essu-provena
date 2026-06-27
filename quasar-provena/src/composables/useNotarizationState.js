import { ref } from 'vue'

/**
 * Global state for the BCH Notarization flow.
 * Singleton pattern ensures processing status is synchronized across the app.
 */
const isProcessing = ref(false)
const step = ref('idle') // 'idle' | 'hashing' | 'building' | 'signing' | 'broadcasting' | 'success'
const error = ref(null)
const txid = ref(null)

export function useNotarizationState() {
  return {
    isProcessing,
    step,
    error,
    txid,
    // Helper to clear state for new attempts
    reset: () => {
      isProcessing.value = false
      step.value = 'idle'
      error.value = null
      txid.value = null
    }
  }
}