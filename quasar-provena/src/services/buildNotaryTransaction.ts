import {
  ElectrumNetworkProvider,
  Network,
  placeholderP2PKHUnlocker,
  TransactionBuilder,
} from 'cashscript'
import {
  hexToBin,
  binToHex,
  decodeCashAddress,
} from '@bitauth/libauth'

const FEE_RATE_SATS_PER_BYTE = 1n
const P2PKH_CHANGE_BYTESIZE  = 34n

interface WatchtowerUtxo {
  txid:           string
  vout:           number
  value?:         number
  satoshis?:      number | bigint | string
  block?:         number
  lockingScript?: string
  scriptPubKey?:  string
  address?:       string
  pathName?:      string
  addressIndex?:  number
  token?:         unknown
}

interface BuildNotaryParams {
  funderUtxos:   WatchtowerUtxo[]
  documentHash:  string
  walletAddress: string
  walletPath?:   {
    pathName:     string
    addressIndex: number
  }
}

function addressToLockingBytecode (address: string): Uint8Array {
  const decoded = decodeCashAddress(address)
  if (typeof decoded === 'string') throw new Error(`Invalid address: ${address}`)
  const hash   = decoded.payload
  const script = new Uint8Array(25)
  script[0]  = 0x76
  script[1]  = 0xa9
  script[2]  = 0x14
  script.set(hash, 3)
  script[23] = 0x88
  script[24] = 0xac
  return script
}

function getLockingBytecode (utxo: WatchtowerUtxo & { address: string }): Uint8Array {
  if (utxo.lockingScript) return hexToBin(utxo.lockingScript)
  if (utxo.scriptPubKey)  return hexToBin(utxo.scriptPubKey)
  return addressToLockingBytecode(utxo.address)
}

function normalizeSatoshis (utxo: WatchtowerUtxo): bigint {
  if (utxo.satoshis !== undefined) return BigInt(utxo.satoshis)
  if (utxo.value    === undefined) return 0n

  // Watchtower may return BCH as a decimal float — convert to satoshis
  const v = Number(utxo.value)
  if (!Number.isInteger(v)) {
    return BigInt(Math.round(v * 100_000_000))
  }
  return BigInt(v)
}

// Address comparator for strict UTXO ownership checks.
// Strips the "bitcoincash:" / "bchtest:" prefix and lowercases, since
// cashaddr comparisons should be prefix- and case-insensitive.
function normalizeAddressForCompare (address: string): string {
  return address.trim().toLowerCase().replace(/^(bitcoincash|bchtest|bchreg):/, '')
}

export function buildNotaryTransaction ({
  funderUtxos,
  documentHash,
  walletAddress,
  walletPath = { pathName: 'receive', addressIndex: 0 },
}: BuildNotaryParams) {
  console.log('buildNotaryTransaction: ENTRY - called with:', {
    funderUtxosCount: funderUtxos?.length,
    documentHash,
    walletAddress,
    walletPath,
  })

  if (!/^[0-9a-f]{64}$/i.test(documentHash)) {
    console.log('buildNotaryTransaction: Invalid hash detected')
    throw new Error('Invalid SHA-256 document hash.')
  }

  console.log('buildNotaryTransaction: Hash validation passed')
  console.log('buildNotaryTransaction: Raw UTXOs before normalization:', funderUtxos)

  // Strict UTXO selection — only UTXOs whose own address provably matches
  // the registered walletAddress are eligible to fund the tx.
  console.log('buildNotaryTransaction: Filtering UTXOs strictly owned by registered address...')
  const registeredAddrNorm = normalizeAddressForCompare(walletAddress)
  const ownedUtxos = funderUtxos.filter(u => {
    const utxoAddr = u.address
    if (!utxoAddr) return false
    return normalizeAddressForCompare(utxoAddr) === registeredAddrNorm
  })

  if (ownedUtxos.length === 0) {
    console.log('buildNotaryTransaction: No UTXOs strictly owned by the registered address')
    throw new Error('No UTXOs found belonging to the registered wallet address.')
  }

  console.log('buildNotaryTransaction: Normalizing UTXOs...')
  const normalized = ownedUtxos
    .filter(u => !u.token)
    .map(u => {
      console.log('buildNotaryTransaction: Processing UTXO:', u)
      return {
        txid:            u.txid,
        vout:            Number(u.vout),
        address:         u.address,
        satoshis:        normalizeSatoshis(u),
        pathName:        u.pathName || walletPath.pathName,
        addressIndex:    Number(u.addressIndex ?? walletPath.addressIndex),
        lockingBytecode: getLockingBytecode({
          ...u,
          address: u.address || walletAddress,
        }),
      }
    })

  console.log('buildNotaryTransaction: Normalized UTXOs:', normalized.length)
  const sorted      = [...normalized].sort((a, b) => Number(b.satoshis - a.satoshis))
  const funderInput = sorted.shift()
  if (!funderInput) {
    console.log('buildNotaryTransaction: No funder input found')
    throw new Error('Insufficient Balance: No UTXOs available.')
  }

  console.log('buildNotaryTransaction: Funder input selected:', {
    txid: funderInput.txid,
    vout: funderInput.vout,
    satoshis: funderInput.satoshis.toString(),
  })

  console.log('buildNotaryTransaction: Creating TransactionBuilder...')
  const transaction = new TransactionBuilder({
    provider: new ElectrumNetworkProvider(Network.MAINNET)
  })

  console.log('buildNotaryTransaction: Adding input...')
  transaction.addInput(funderInput, placeholderP2PKHUnlocker(walletAddress))

  console.log('buildNotaryTransaction: Adding OP_RETURN output...')
  const opReturnChunks: string[] = ['provena', `0x${documentHash}`]

  transaction.addOpReturnOutput(opReturnChunks)

  // Calculate fee with OP_RETURN included
  let txHex     = transaction.build()
  console.log('Transaction hex (with OP_RETURN):', txHex.substring(0, 100) + '...')
  const txBytes = BigInt(hexToBin(txHex).length)

  // Calculate minimum relay fee based on transaction size, adding a buffer of 100 satoshis
  const fee     = (txBytes + P2PKH_CHANGE_BYTESIZE) * FEE_RATE_SATS_PER_BYTE + 100n
  const change  = funderInput.satoshis - fee

  if (change <= 0n) throw new Error('Insufficient Balance: Not enough BCH to cover fee.')

  if (change > 546n) {
    transaction.addOutput({ to: walletAddress, amount: change })
    txHex = transaction.build()
    console.log('Transaction hex (with change):', txHex.substring(0, 100) + '...')
  }

  // ✅ FIXED: Removed the crashing transaction.outputs log line from here
  console.log('Transaction successfully built.')

  const sourceOutputs = [{
    outpointTransactionHash: binToHex(hexToBin(funderInput.txid).reverse()),
    outpointIndex:           funderInput.vout,
    lockingBytecode:         binToHex(funderInput.lockingBytecode),
    valueSatoshis:           funderInput.satoshis.toString(),
  }]

  const inputPaths: [number, string, number][] = [[
    0,
    funderInput.pathName,
    funderInput.addressIndex,
  ]]

  return {
    action: 'sign_transaction_request',
    transaction: {
      transaction:   txHex,
      sourceOutputs,
      userPrompt:    'Notarize Document on Bitcoin Cash',
      broadcast:     false,
    },
    inputPaths,
  }
}
