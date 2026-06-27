import { boot } from 'quasar/wrappers'

/**
 * Patch BigInt to support JSON.stringify.
 * This is required for blockchain libraries and local storage persistence.
 */
export default boot(() => {
  if (typeof BigInt !== 'undefined' && !(BigInt.prototype as any).toJSON) {
    console.log('🚀 BigInt JSON patch applied');
    Object.defineProperty(BigInt.prototype, 'toJSON', {
      value: function () { return this.toString() },
      configurable: true,
      enumerable: false,
      writable: true
    })
  }
})