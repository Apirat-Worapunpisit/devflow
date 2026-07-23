import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface Project {
  id: number
  title: string
  description: string | null
  owner_id: number
  created_at: string
  updated_at: string
}

interface ProjectState {
  projects: Project[]
  loading: boolean
}

export const useProjectStore = defineStore('projects', {
  state: (): ProjectState => ({
    projects: [],
    loading: false,
  }),

  actions: {
    async fetchProjects() {
      const authStore = useAuthStore()
      this.loading = true

      try {
        this.projects = await apiFetch<Project[]>('/projects', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
      } finally {
        this.loading = false
      }
    },

    async createProject(title: string, description: string) {
      const authStore = useAuthStore()

      const newProject = await apiFetch<Project>('/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({ title, description }),
      })

      this.projects.push(newProject)
      return newProject
    },

    async deleteProject(id: number) {
      const authStore = useAuthStore()

      await apiFetch(`/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })

      this.projects = this.projects.filter(p => p.id !== id)
    },
  },
})
