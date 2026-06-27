import { useWizardConnect } from '@paytaca/wizardconnect-vue'
import { ref, computed, watch } from 'vue'

// ── Module-level singleton ────────────────────────────────────────────────────
// _wc is created exactly once and shared across every useWalletConnect() call.
// This prevents duplicate watchers and duplicate keepalive timers.
let _wc          = null
let _watchersSet = false   // guard: only register watchers once per singleton

const walletAddress = ref('')

// ── localStorage keys ─────────────────────────────────────────────────────────
const ADDRESS_STORAGE_KEY = 'provena-wc-address'
const SESSION_KEY         = 'provena-wc-session'
const SESSION_BACKUP_KEY  = 'provena-wc-session-backup'

// ── Session backup helpers ────────────────────────────────────────────────────

function backupSession () {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) localStorage.setItem(SESSION_BACKUP_KEY, raw)
  } catch { /* noop */ }
}

function restoreSessionFromBackup () {
  try {
    const backup = localStorage.getItem(SESSION_BACKUP_KEY)
    if (!backup) return null
    localStorage.setItem(SESSION_KEY, backup)
    return JSON.parse(backup)
  } catch { return null }
}

function clearSessionBackup () {
  try { localStorage.removeItem(SESSION_BACKUP_KEY) } catch { /* noop */ }
}

// ── Address persistence ───────────────────────────────────────────────────────

function persistAddress (addr) {
  if (addr) {
    try { localStorage.setItem(ADDRESS_STORAGE_KEY, addr) } catch { /* noop */ }
  }
}

function clearPersistedAddress () {
  try { localStorage.removeItem(ADDRESS_STORAGE_KEY) } catch { /* noop */ }
}

function loadPersistedAddress () {
  try { return localStorage.getItem(ADDRESS_STORAGE_KEY) || '' } catch { return '' }
}

// ── Address extraction ────────────────────────────────────────────────────────

/**
 * Pull a BCH address out of the persisted WalletConnect session in localStorage.
 * Paytaca/WizardConnect stores CAIP-10 format: "bch:mainnet:bitcoincash:qp..."
 */
function getAddressFromPersistedSession () {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return ''
    const session    = JSON.parse(raw)
    const namespaces = session?.namespaces ?? session?.session?.namespaces ?? session
    if (!namespaces) return ''

    for (const ns of ['bch', 'bitcoincash', 'BCH', 'bchtest', 'bchreg']) {
      try {
        const accounts = namespaces[ns]?.accounts
        if (Array.isArray(accounts) && accounts.length > 0) {
          const caip10 = accounts[0]
          const parts  = caip10.split(':')
          const addr   = parts[parts.length - 1]
          if (addr && addr.length > 10) return addr
        }
      } catch { /* skip */ }
    }

    // Fallback: any account string in a flat namespace
    for (const key of Object.keys(namespaces)) {
      try {
        const val = namespaces[key]
        const candidates = Array.isArray(val) ? val : [val]
        for (const item of candidates) {
          if (typeof item === 'string' && item.length > 10 && item.includes(':')) {
            const parts = item.split(':')
            const addr  = parts[parts.length - 1]
            if (addr.length > 10) return addr
          }
        }
      } catch { /* skip */ }
    }
  } catch { /* invalid JSON */ }
  return ''
}

function extractAddress (mgr) {
  if (!mgr) return ''

  // 1. Persisted session (most reliable — survives page reload)
  const fromSession = getAddressFromPersistedSession()
  if (fromSession) return fromSession

  // 2. Manager session namespaces
  try {
    const session = mgr.session?.namespaces || mgr.session
    if (session) {
      for (const ns of ['bch', 'bitcoincash', 'BCH', 'bchtest', 'bchreg']) {
        const accounts = session[ns]?.accounts
        if (Array.isArray(accounts) && accounts.length > 0) {
          const parts = accounts[0].split(':')
          const addr  = parts[parts.length - 1]
          if (addr && addr.length > 10) return addr
        }
      }
    }
  } catch { /* skip */ }

  // 3. Direct properties
  for (const key of ['address', 'walletAddress', 'account']) {
    try {
      if (typeof mgr[key] === 'string' && mgr[key].length > 10) return mgr[key]
      if (mgr.session && typeof mgr.session[key] === 'string' && mgr.session[key].length > 10) {
        return mgr.session[key]
      }
    } catch { /* skip */ }
  }

  return ''
}

// ── Watcher setup (called exactly once per singleton) ─────────────────────────

function setupWatchers () {
  if (_watchersSet) return
  _watchersSet = true

  // State watcher — no { immediate: true } so it never fires on the initial
  // 'idle' state during page load (which would look like a real disconnect).
  watch(() => _wc.state.value, (newState, oldState) => {
    console.log(`🔌 WC state: ${oldState} → ${newState}`)

    if (newState === 'connected') {
      // Persist the session and address immediately on connect
      backupSession()
      const mgr  = _wc.manager.value
      const addr = mgr ? extractAddress(mgr) : ''
      if (addr) {
        walletAddress.value = addr
        persistAddress(addr)
        console.log('📍 Connected, address:', addr.slice(0, 16) + '...')
      } else {
        const cached = loadPersistedAddress()
        if (cached) {
          walletAddress.value = cached
          console.log('📍 Connected, using cached address:', cached.slice(0, 16) + '...')
        }
      }
      return
    }

    if (newState === 'reconnecting') {
      // Library is handling reconnect on its own — do nothing, just log.
      // DO NOT call connect() or disconnect() here; that fights the library.
      console.log('🔄 WC reconnecting — waiting for library...')
      return
    }

    if (newState === 'disconnected' || newState === 'idle') {
      // Only act on a real transition FROM an active state.
      // Ignore startup idle and explicit-user-disconnect idle (handled in disconnect()).
      const wasActive = oldState && oldState !== 'idle' && oldState !== 'disconnected'
      if (!wasActive) return

      // Preserve the session backup before the library may clear localStorage
      backupSession()
      console.log('⚠️ WC dropped from active state — session backed up')
      // Do NOT call connect() — the library's persistSession will restore
      // the session automatically on the next page load / re-mount.
      // Calling connect() here opens a fresh QR pairing and wipes the old session.
    }
  })

  // Manager watcher — resolve address when manager becomes available after connect
  watch(() => _wc.manager.value, (newMgr) => {
    if (_wc.state.value === 'connected' && newMgr && !walletAddress.value) {
      const addr = extractAddress(newMgr)
      if (addr) {
        walletAddress.value = addr
        persistAddress(addr)
        console.log('📍 Address resolved (deferred):', addr.slice(0, 16) + '...')
      } else {
        const cached = loadPersistedAddress()
        if (cached) walletAddress.value = cached
      }
    }
  })
}

// ── Public composable ─────────────────────────────────────────────────────────

export function useWalletConnect () {
  if (!_wc) {
    // Restore session backup before the library initialises so it finds
    // the session data at the primary key.
    restoreSessionFromBackup()

    _wc = useWizardConnect({
      dappName:       'Provena',
      dappIcon:       '',
      persistSession: true,
      sessionKey:     SESSION_KEY,
    })
  }

  // Seed the cached address from localStorage on first call
  const cached = loadPersistedAddress()
  if (cached && !walletAddress.value) {
    walletAddress.value = cached
  }

  // Register reactive watchers exactly once per singleton lifetime
  setupWatchers()

  // Reactive address — prioritises live extraction when connected,
  // falls back to persisted value across page reloads.
  const address = computed(() => {
    const mgr   = _wc.manager.value
    const state = _wc.state.value
    if (state === 'connected' && mgr) {
      const extracted = extractAddress(mgr)
      if (extracted) {
        persistAddress(extracted)
        return extracted
      }
    }
    return walletAddress.value
  })

  function connect () {
    if (_wc && typeof _wc.connect === 'function') _wc.connect()
  }

  /**
   * Explicit user-initiated disconnect.
   * Clears all session data so the library starts fresh next time.
   */
  function disconnect () {
    if (_wc && typeof _wc.disconnect === 'function') _wc.disconnect()
    walletAddress.value = ''
    clearPersistedAddress()
    clearSessionBackup()
    console.log('🔌 Wallet disconnected by user')
  }

  return {
    state:      _wc.state,
    manager:    _wc.manager,
    uri:        _wc.uri,
    qrUri:      _wc.qrUri,
    walletName: _wc.walletName,
    walletIcon: _wc.walletIcon,
    address,
    connect,
    disconnect,
    error:      _wc.error,
  }
}

/**
 * Hard reset — destroys the singleton entirely.
 * Use only for "forget this wallet / log out" flows.
 */
export function resetWalletSession () {
  _watchersSet = false
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(ADDRESS_STORAGE_KEY)
  localStorage.removeItem(SESSION_BACKUP_KEY)
  _wc          = null
  walletAddress.value = ''
}
