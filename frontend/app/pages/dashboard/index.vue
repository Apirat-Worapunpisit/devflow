<template>
  <div class="dashboard">

    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="title">👋 สวัสดี, {{ authStore.user?.username || 'Developer' }}</h1>
        <p class="subtitle">ยินดีต้อนรับกลับมา</p>
      </div>
      <div class="header-actions">
        <NuxtLink to="/dashboard/settings" class="settings-btn">
          ⚙️ Settings
        </NuxtLink>
        <button class="logout-btn" @click="authStore.logout()">
          ออกจากระบบ
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div class="stat-card">
        <p class="stat-label">Projects ทั้งหมด</p>
        <p class="stat-value">{{ projectStore.projects.length }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Tasks ทั้งหมด</p>
        <p class="stat-value">{{ totalTasks }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Tasks เสร็จแล้ว</p>
        <p class="stat-value">{{ doneTasks }}</p>
      </div>
    </div>

    <!-- Recent Projects -->
    <div class="section">
      <div class="section-header">
        <h2>Projects ล่าสุด</h2>
        <NuxtLink to="/dashboard/projects" class="see-all">
          ดูทั้งหมด →
        </NuxtLink>
      </div>

      <div v-if="projectStore.loading" class="loading">
        กำลังโหลด...
      </div>

      <div v-else-if="projectStore.projects.length === 0" class="empty">
        ยังไม่มี project — 
        <NuxtLink to="/dashboard/projects">สร้างเลย</NuxtLink>
      </div>

      <div v-else class="project-list">
        <div
          v-for="project in recentProjects"
          :key="project.id"
          class="project-card"
          @click="navigateTo(`/dashboard/projects/${project.id}`)"
        >
          <h3>{{ project.title }}</h3>
          <p>{{ project.description || 'ไม่มีคำอธิบาย' }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      const authStore = useAuthStore()
      authStore.initAuth()
      if (!authStore.isAuthenticated) {
        return navigateTo('/login')
      }
    }
  ]
})

const authStore = useAuthStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const totalTasks = computed(() => taskStore.tasks.length)
const doneTasks = computed(() => taskStore.tasks.filter(t => t.status === 'done').length)
const recentProjects = computed(() => projectStore.projects.slice(0, 3))

onMounted(async () => {
  try {
    await authStore.fetchUser()
    await projectStore.fetchProjects()

    // fetch tasks ของทุก project
    for (const project of projectStore.projects) {
      await taskStore.fetchTasks(project.id)
    }
  } catch {
    // error dialog แสดงจาก apiFetch แล้ว
  }
})
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  font-weight: 700;
}

.subtitle {
  color: #6b7280;
  margin-top: 4px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.settings-btn {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: inherit;
  text-decoration: none;
}

.settings-btn:hover {
  background: #f9fafb;
}

.logout-btn {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.logout-btn:hover {
  background: #f9fafb;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.stat-card {
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
}

.stat-label {
  font-size: 14px;
  opacity: 0.85;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  margin-top: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.see-all {
  color: #6366f1;
  font-size: 14px;
}

.project-list {
  display: grid;
  gap: 12px;
}

.project-card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.project-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.project-card h3 {
  font-weight: 600;
  margin-bottom: 4px;
}

.project-card p {
  color: #6b7280;
  font-size: 14px;
}

.loading, .empty {
  text-align: center;
  color: #6b7280;
  padding: 40px;
}

.empty a {
  color: #6366f1;
}
</style>