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

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch tasks')

      this.tasks = await response.json()
      this.loading = false
    },

    async createTask(data: {
      title: string
      description: string
      priority: string
      project_id: number
    }) {
      const authStore = useAuthStore()

      const response = await fetch('http://localhost:8000/tasks', {
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

      if (!response.ok) throw new Error('Failed to create task')

      const newTask = await response.json()
      this.tasks.push(newTask)
      return newTask
    },

    async updateTaskStatus(taskId: number, status: string) {
      const authStore = useAuthStore()

      const response = await fetch(
        `http://localhost:8000/tasks/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({ status }),
        }
      )

      if (!response.ok) throw new Error('Failed to update task')

      const updated = await response.json()
      const index = this.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) this.tasks[index] = updated
    },

    async deleteTask(taskId: number) {
      const authStore = useAuthStore()

      const response = await fetch(
        `http://localhost:8000/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to delete task')

      this.tasks = this.tasks.filter(t => t.id !== taskId)
    },
  },
})