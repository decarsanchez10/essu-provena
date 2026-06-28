/**
 * Provena Application Configuration
 * Centralized config for environment variables, API endpoints, and constants.
 * All hardcoded values should be referenced from this file.
 */

// API Base URL - uses Vite proxy in dev, env var in production
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Blockchain Explorer URLs
export const EXPLORER_BASE_URL = 'https://explorer.bitcoincash.org'
export const EXPLORER_TX_URL = (txid) => `${EXPLORER_BASE_URL}/tx/${txid}`
export const EXPLORER_ADDRESS_URL = (address) => `${EXPLORER_BASE_URL}/address/${address}`

// Alternative explorers for redundancy
export const BLOCKCHAIR_BASE_URL = 'https://blockchair.com/bitcoin-cash'
export const BLOCKCHAIR_TX_URL = (txid) => `${BLOCKCHAIR_BASE_URL}/transaction/${txid}`

// Watchtower API (BCH blockchain data)
export const WATCHTOWER_API_URL = 'https://watchtower.cash/api'

// Supported file types for notarization
export const ALLOWED_FILE_TYPES = {
  mimeTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ],
  extensions: ['.pdf', '.docx', '.jpg', '.jpeg', '.png'],
  maxSizeBytes: 100 * 1024 * 1024, // 100MB max
}

// Notarization flow stages
export const NOTARIZATION_STAGES = {
  BUILDING: 'building',
  SIGNING: 'signing',
  BROADCASTING: 'broadcasting',
  UPLOADING: 'uploading',
}

// Wallet connection states
export const WALLET_STATES = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  DISCONNECTED: 'disconnected',
}

// Local storage keys
export const STORAGE_KEYS = {
  NOTARIZATION_RECORDS: 'pv',
  WALLET_SESSION: 'wc_session',
  WALLET_SESSION_BACKUP: 'wc_session_backup',
  THEME: 'provena_theme',
  TERMS_ACCEPTED: 'provena_terms_accepted',
}

// Temporary link expiry
export const TEMP_LINK_EXPIRY_HOURS = 24

// Application metadata
export const APP_CONFIG = {
  name: 'Provena',
  tagline: 'Blockchain Document Notary',
  description: 'Decentralized document verification and notarization on Bitcoin Cash',
  version: '1.0.0',
  copyright: '© 2026 Provena',
}

// Social links
export const SOCIAL_LINKS = {
  github: 'https://github.com/provena',
  twitter: 'https://twitter.com/provena',
}

// API endpoint paths (relative to API_BASE_URL)
export const API_ENDPOINTS = {
  // Records
  RECORDS: '/api/records/',
  RECORDS_CHECK: (hash) => `/api/records/check/${hash}/`,
  RECORDS_LOOKUP: '/api/records/lookup/',
  RECORDS_VERIFY: (token) => `/api/records/verify/${token}/`,
  RECORDS_GENERATE_LINK: (recordId) => `/api/records/${recordId}/generate-link/`,
  RECORDS_SEND_EMAIL: '/api/records/send-email/',

  // UTXO proxy
  UTXOS: (address) => `/api/utxos/${address}/`,

  // Watchtower proxy
  WATCHTOWER: (path) => `/api/watchtower/${path}`,
}

// Validation helpers
export const isValidFileType = (file) => {
  const isValidMime = ALLOWED_FILE_TYPES.mimeTypes.includes(file.type)
  const ext = file.name.toLowerCase()
  const isValidExt = ALLOWED_FILE_TYPES.extensions.some(e => ext.endsWith(e))
  return isValidMime || isValidExt
}

export const isValidFileSize = (file) => {
  return file.size <= ALLOWED_FILE_TYPES.maxSizeBytes
}

export default {
  API_BASE_URL,
  EXPLORER_BASE_URL,
  EXPLORER_TX_URL,
  EXPLORER_ADDRESS_URL,
  BLOCKCHAIR_TX_URL,
  WATCHTOWER_API_URL,
  ALLOWED_FILE_TYPES,
  NOTARIZATION_STAGES,
  WALLET_STATES,
  STORAGE_KEYS,
  TEMP_LINK_EXPIRY_HOURS,
  APP_CONFIG,
  SOCIAL_LINKS,
  API_ENDPOINTS,
  isValidFileType,
  isValidFileSize,
}
