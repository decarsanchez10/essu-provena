<template>
  <div>
    <AppCursor />
    <AppToast :message="toastMsg" :trigger="toastTrigger" />
    <AppNav
      :wallet-state="walletState"
      :wallet-name="walletName"
      @connect-wallet="connect"
      @disconnect-wallet="disconnect"
    />
    <router-view
      :wallet-state="walletState"
      :wallet-name="walletName"
      :wallet-address="address"
      :wallet-manager="manager"
      :wallet-uri="uri"
      :wallet-qr-uri="qrUri"
      @connect-wallet="connect"
      @disconnect-wallet="disconnect"
      @toast="showToast"
    />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import AppCursor from './components/AppCursor.vue'
import AppToast from './components/AppToast.vue'
import AppNav from './components/AppNav.vue'
import { useWalletConnect } from './composables/useWalletConnect'

// ── Toast ──
const toastMsg = ref('')
const toastTrigger = ref(0)
function showToast (msg) {
  toastMsg.value = msg
  toastTrigger.value++
}

// ── Global wallet — initialized once here, shared everywhere ──
const {
  state: walletState,
  walletName,
  address,
  manager,
  uri,
  qrUri,
  connect,
  disconnect,
  error: walletError,
} = useWalletConnect()

// provide() makes wallet available to ANY child component via inject()
// without needing to pass props through every layer
provide('wallet', {
  state: walletState,
  walletName,
  address,
  manager,
  uri,
  qrUri,
  connect,
  disconnect,
  error: walletError,
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>