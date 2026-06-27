import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Empty baseURL = relative paths, which the Vite proxy handles in dev.
// An absolute baseURL is only needed when the frontend and backend are on
// different origins (Docker / production). See quasar-provena/.env.
const _rawBase = import.meta.env.VITE_API_BASE_URL || ''
const apiBase  = (_rawBase && !_rawBase.startsWith('/') && _rawBase !== 'http://localhost:9000')
  ? _rawBase.replace(/\/$/, '')
  : ''

const api = axios.create({
  baseURL: apiBase,
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }