import { defineStore } from 'pinia'

interface Task {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  project_id: number
  owner_id: number
  created_at: string
  updated_at: string
}

interface TaskState {
  tasks: Task[]
  loading: boolean
}

export const useTaskStore = defineStore('tasks', {
  state: (): TaskState => ({
    tasks: [],
    loading: false,
  }),

  actions: {
    async fetchTasks(projectId?: number) {
      const authStore = useAuthStore()
      this.loading = true

      const url = projectId
        ? `http://localhost:8000/tasks?project_id=${projectId}`
        : 'http://localhost:8000/tasks'

      try {
        this.tasks = await apiFetch<Task[]>(url, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
      } finally {
        this.loading = false
      }
    },

    async createTask(data: {
      title: string
      description: string
      priority: string
      project_id: number
    }) {
      const authStore = useAuthStore()

      const newTask = await apiFetch<Task>('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          ...data,
          status: 'todo',
        }),
      })

      this.tasks.push(newTask)
      return newTask
    },

    async updateTaskStatus(taskId: number, status: string) {
      const authStore = useAuthStore()

      const updated = await apiFetch<Task>(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({ status }),
      })

      const index = this.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) this.tasks[index] = updated
    },

    async deleteTask(taskId: number) {
      const authStore = useAuthStore()

      await apiFetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })

      this.tasks = this.tasks.filter(t => t.id !== taskId)
    },
  },
})
