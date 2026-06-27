export async function signWithWizardConnect (manager: any, signRequest: any): Promise<string | { signedHex: string, signature?: string }> {
  console.log('signWithWizardConnect: ENTRY')
  console.log('signWithWizardConnect: signRequest:', signRequest)

  if (!manager) throw new Error('Connection Failure: Wallet not ready.')

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('Connection Failure: Wallet signing request timed out.'))
    }, 120_000)

    function cleanup (): void {
      clearTimeout(timeout)
      try {
        if (typeof manager.removeListener === 'function') {
          manager.removeListener('messagereceived', onMessage)
        } else if (typeof manager.off === 'function') {
          manager.off('messagereceived', onMessage)
        }
      } catch (e) {
        console.warn('cleanup error:', e)
      }
    }

    function onMessage (msg: any): void {
      console.log('signWithWizardConnect: Received message:', msg)
      const action: string = msg?.action ?? ''
      const isSignResponse =
        action === 'sign_transaction_response' ||
        action === 'signed_transaction'        ||
        action === 'transaction_signed'

      if (!isSignResponse) return

      console.log('signWithWizardConnect: Sign response detected')
      cleanup()

      // User cancelled or rejected
      if (msg?.cancelled || msg?.rejected || msg?.error) {
        console.log('signWithWizardConnect: Wallet rejected/cancelled:', msg)
        const errMsg = String(msg?.error?.message ?? msg?.error ?? '')
        if (
          errMsg.toLowerCase().includes('cancel') ||
          errMsg.toLowerCase().includes('reject') ||
          msg?.cancelled === true
        ) {
          reject(new Error('cancelled: User rejected the signing request.'))
        } else {
          reject(new Error(errMsg || 'Wallet rejected the transaction.'))
        }
        return
      }

      // Extract signed hex — try all known response shapes
      const signedHex: string | null =
        msg?.transaction?.transaction       ??
        msg?.transaction?.signedTransaction ??
        msg?.signedTransaction              ??
        msg?.transaction_hex                ??
        msg?.transactionHex                 ??
        msg?.signed_transaction             ??
        (typeof msg?.transaction === 'string' ? msg.transaction : null) ??
        null

      // Attempt to also pull a raw signature if supplied separately
      const signature: string | undefined = msg?.signature ?? msg?.sig ?? undefined

      console.log('signWithWizardConnect: Extracted signed hex length:', signedHex?.length || 0)
      if (!signedHex || typeof signedHex !== 'string' || signedHex.length === 0) {
        reject(new Error('Connection Failure: Wallet returned no signed transaction.'))
        return
      }

      console.log('signWithWizardConnect: Resolving with signed transaction')
      // Resolve with an object so callers can access both values
      resolve({ signedHex, signature })
    }

    // Attach listener BEFORE sending
    console.log('signWithWizardConnect: Attaching message listener...')
    if (typeof manager.addListener === 'function') {
      manager.addListener('messagereceived', onMessage)
    } else if (typeof manager.on === 'function') {
      manager.on('messagereceived', onMessage)
    } else {
      reject(new Error('Connection Failure: Wallet event listener unavailable.'))
      return
    }

    // Send — WizardConnect dapp manager uses signTransaction, not sendMessage
    console.log('signWithWizardConnect: Sending sign request...')
    const sendPromise: Promise<any> | undefined =
      typeof manager.sendMessage    === 'function' ? manager.sendMessage(signRequest)    :
      typeof manager.signTransaction === 'function' ? manager.signTransaction(signRequest) :
      undefined

    if (!sendPromise) {
      cleanup()
      reject(new Error('Connection Failure: Wallet has no sendMessage or signTransaction method.'))
      return
    }

    sendPromise.catch((err: any) => {
      console.log('signWithWizardConnect: Send promise error:', err)
      cleanup()
      reject(new Error(err?.message ?? 'Failed to send sign request to wallet.'))
    })
  })
}