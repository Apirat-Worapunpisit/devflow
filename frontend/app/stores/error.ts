import { defineStore } from 'pinia'

interface ErrorState {
  message: string | null
}

export const useErrorStore = defineStore('error', {
  state: (): ErrorState => ({
    message: null,
  }),

  actions: {
    show(message: string) {
      this.message = message
    },

    clear() {
      this.message = null
    },
  },
})
