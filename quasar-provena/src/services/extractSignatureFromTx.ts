import { hexToBin, binToHex } from '@bitauth/libauth'

/**
 * Extract the DER-encoded ECDSA signature from the first P2PKH input's
 * scriptSig in a signed Bitcoin Cash transaction hex.
 *
 * A P2PKH scriptSig has the shape:
 *   <sigLen> <DER signature + sighash byte> <pubkeyLen> <compressed pubkey>
 *
 * This function returns only the DER signature (without the trailing sighash byte)
 * as a hex string.
 */
export function extractSignatureFromTx (signedTxHex: string): string {
  const raw = hexToBin(signedTxHex)
  // Skip version (4 bytes)
  let offset = 4

  // Input count (varint)
  const { value: inputCount, bytesRead: icBytes } = readVarInt(raw, offset)
  offset += icBytes

  if (inputCount === 0) {
    throw new Error('Transaction has no inputs — cannot extract signature.')
  }

  // Skip prevout (32-byte txid + 4-byte vout)
  offset += 36

  // scriptSig length (varint)
  const { value: scriptSigLen, bytesRead: ssBytes } = readVarInt(raw, offset)
  offset += ssBytes

  if (scriptSigLen === 0) {
    throw new Error('scriptSig is empty — transaction may not be signed.')
  }

  // First byte of scriptSig is the push-data length for the signature
  const sigPushLen = raw[offset]
  offset += 1

  // The pushed data = DER signature + 1-byte sighash type
  // We want just the DER portion (drop the sighash byte at the end)
  const sigWithSighash = raw.slice(offset, offset + sigPushLen)
  const derSignature   = sigWithSighash.slice(0, sigPushLen - 1) // drop sighash byte

  return binToHex(derSignature)
}

/**
 * Read a Bitcoin-style variable-length integer from a Uint8Array.
 */
function readVarInt (buf: Uint8Array, pos: number): { value: number; bytesRead: number } {
  const first = buf[pos]
  if (first < 0xfd) return { value: first, bytesRead: 1 }
  if (first === 0xfd) {
    return { value: buf[pos + 1] | (buf[pos + 2] << 8), bytesRead: 3 }
  }
  if (first === 0xfe) {
    return {
      value: buf[pos + 1] | (buf[pos + 2] << 8) | (buf[pos + 3] << 16) | (buf[pos + 4] << 24),
      bytesRead: 5,
    }
  }
  // 0xff — 8-byte int; practically never used, but handle gracefully
  return { value: Number(BigInt(buf[pos + 1])), bytesRead: 9 }
}
