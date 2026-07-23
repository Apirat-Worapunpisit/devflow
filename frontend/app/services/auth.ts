const useApiUrl = () => useRuntimeConfig().public.apiUrl as string

export const authService = {
  async register(email: string, username: string, password: string) {
    const response = await fetch(`${useApiUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }
    return await response.json()
  },

  async login(email: string, password: string) {
    const response = await fetch(`${useApiUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username: email, password }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }
    return await response.json()
  },
}