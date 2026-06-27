<template>
  <div class="wallet-connect-header">
    <button @click="connectWallet" v-if="!isConnected" class="connect-btn">
      Connect Wallet
    </button>
    <div v-else class="connected">
      <span>✓ Connected</span>
      <button @click="disconnectWallet" class="disconnect-btn">Disconnect</button>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const wallet = inject('wallet')
const isConnected = computed(() => wallet.state.value === 'connected')
// Direct reference to connect/disconnect from the global wallet singleton
const connectWallet = wallet.connect
const disconnectWallet = wallet.disconnect
</script>

<style scoped>
.wallet-connect-header {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
.connect-btn, .disconnect-btn {
  padding: 10px 20px;
  background: var(--g);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
.connected {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--gf);
  padding: 10px 16px;
  border-radius: 8px;
}
</style>
