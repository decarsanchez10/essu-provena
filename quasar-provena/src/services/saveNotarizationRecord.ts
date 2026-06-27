const STORAGE_KEY = 'pv'

interface NotarizationRecord {
  hash:      string
  txid:      string
  address:   string
  timestamp: string
  status:    'confirmed' | 'pending' | 'failed'
  record_id?: string
  uploaded?:  boolean
}

interface SaveRecordParams {
  hash:       string
  txid:       string
  address:    string
  timestamp?: string
  record_id?: string
  uploaded?:  boolean
}

export function saveNotarizationRecord ({
  hash,
  txid,
  address,
  timestamp,
  ...kwargs
}: SaveRecordParams): NotarizationRecord[] {
  const records = loadRecords()

  records.unshift({
    hash,
    txid,
    address,
    timestamp: timestamp ?? new Date().toISOString(),
    status:    'confirmed',
    record_id: kwargs.record_id,
    uploaded:  kwargs.uploaded,
  })

  if (records.length > 50) records.pop()

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (e: unknown) {
    console.warn('localStorage write failed:', e)
  }

  return records
}

export function loadRecords (): NotarizationRecord[] {
  try {
    const raw    = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as NotarizationRecord[]) : []
  } catch {
    return []
  }
}