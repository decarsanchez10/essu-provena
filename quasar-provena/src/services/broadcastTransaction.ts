/**
 * Broadcast a signed transaction via Watchtower (Paytaca's backend).
 * Broadcasting through Watchtower ensures the transaction appears
 * in the user's Paytaca wallet history immediately.
 */
export async function broadcastTransaction (txHex: string): Promise<{ txid: string }> {
  console.log('broadcastTransaction: ENTRY')
  console.log('broadcastTransaction: txHex length:', txHex.length)

  // Broadcast via Watchtower — Paytaca's own backend
  const url = 'https://watchtower.cash/api/broadcast/'
  console.log('broadcastTransaction: Broadcasting via Watchtower...')

  const response = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ transaction: txHex }),
  })

  console.log('broadcastTransaction: Response status:', response.status)
  const result = await response.json().catch(() => ({}))
  console.log('broadcastTransaction: Response body:', result)

  if (!response.ok || result.error) {
    console.error('broadcastTransaction: Broadcast failed:', result.error)
    throw new Error(`broadcast: ${result.error ?? 'Unknown broadcast error'}`)
  }

  const txid: string | null =
    result.txid      ??
    result.tx_hash   ??
    result.result    ??
    null

  console.log('broadcastTransaction: Extracted txid:', txid)
  if (!txid) {
    throw new Error('broadcast: No TXID returned from Watchtower')
  }

  return { txid }
}