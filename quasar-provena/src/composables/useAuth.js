import { ref, computed } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const authToken = ref(localStorage.getItem('auth_token') || '')
const user = ref(null)

export function useAuth () {
  const isAuthenticated = computed(() => !!authToken.value)

  async function register (username, password) {
    const response = await fetch(`${API_BASE_URL}/api/publickeys/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'Registration failed')
    }

    const data = await response.json()
    authToken.value = data.token
    user.value = { id: data.id, username: data.username }
    localStorage.setItem('auth_token', data.token)
    return data
  }

  async function login (username, password) {
    const response = await fetch(`${API_BASE_URL}/api/publickeys/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'Login failed')
    }

    const data = await response.json()
    authToken.value = data.token
    user.value = { id: data.id, username: data.username }
    localStorage.setItem('auth_token', data.token)
    return data
  }

  async function logout () {
    try {
      await fetch(`${API_BASE_URL}/api/publickeys/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken.value}`,
        },
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      authToken.value = ''
      user.value = null
      localStorage.removeItem('auth_token')
    }
  }

  return {
    authToken,
    user,
    isAuthenticated,
    register,
    login,
    logout,
  }
}
