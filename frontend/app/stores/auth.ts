import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {

    initAuth() {
      if (process.client) {
        this.token = localStorage.getItem('token')
      }
    },

    async register(email: string, username: string, password: string) {
      return apiFetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })
    },

    async login(email: string, password: string) {
      const data = await apiFetch<{ access_token: string }>('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username: email, password }),
      })

      this.token = data.access_token
      localStorage.setItem('token', data.access_token)
    },

    async fetchUser() {
      this.user = await apiFetch<User>('http://localhost:8000/auth/me', {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      navigateTo('/login')
    },
  },
})
