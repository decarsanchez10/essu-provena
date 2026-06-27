export async function signMessageWithWizardConnect (manager: any, signRequest: any): Promise<string> {
  console.log('signMessageWithWizardConnect: ENTRY')
  console.log('signMessageWithWizardConnect: signRequest:', signRequest)

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
      console.log('signMessageWithWizardConnect: Received message:', msg)
      const action: string = msg?.action ?? ''
      const isSignResponse =
        action === 'sign_message_response' ||
        action === 'signed_message'        ||
        action === 'message_signed'

      if (!isSignResponse) return

      console.log('signMessageWithWizardConnect: Sign response detected')
      cleanup()

      // User cancelled or rejected
      if (msg?.cancelled || msg?.rejected || msg?.error) {
        console.log('signMessageWithWizardConnect: Wallet rejected/cancelled:', msg)
        const errMsg = String(msg?.error?.message ?? msg?.error ?? '')
        if (
          errMsg.toLowerCase().includes('cancel') ||
          errMsg.toLowerCase().includes('reject') ||
          msg?.cancelled === true
        ) {
          reject(new Error('cancelled: User rejected the signing request.'))
        } else {
          reject(new Error(errMsg || 'Wallet rejected the message.'))
        }
        return
      }

      const signature: string | null =
        msg?.signature ?? msg?.sig ?? msg?.signedMessage ??
        (typeof msg?.message === 'string' ? msg.message : null) ??
        null

      if (!signature || typeof signature !== 'string' || signature.length === 0) {
        reject(new Error('Connection Failure: Wallet returned no signature.'))
        return
      }

      console.log('signMessageWithWizardConnect: Resolving with signature')
      resolve(signature)
    }

    console.log('signMessageWithWizardConnect: Attaching message listener...')
    if (typeof manager.addListener === 'function') {
      manager.addListener('messagereceived', onMessage)
    } else if (typeof manager.on === 'function') {
      manager.on('messagereceived', onMessage)
    } else {
      reject(new Error('Connection Failure: Wallet event listener unavailable.'))
      return
    }

    console.log('signMessageWithWizardConnect: Sending sign request...')
    const sendPromise: Promise<any> | undefined =
      typeof manager.sendMessage === 'function' ? manager.sendMessage(signRequest) :
      undefined

    if (!sendPromise) {
      cleanup()
      reject(new Error('Connection Failure: Wallet has no sendMessage method.'))
      return
    }

    sendPromise.catch((err: any) => {
      console.log('signMessageWithWizardConnect: Send promise error:', err)
      cleanup()
      reject(new Error(err?.message ?? 'Failed to send sign request to wallet.'))
    })
  })
}
