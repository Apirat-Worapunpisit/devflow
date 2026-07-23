<template>
  <div class="projects-page">

    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="title">📁 Projects</h1>
        <p class="subtitle">จัดการ projects ทั้งหมดของคุณ</p>
      </div>
      <div class="header-actions">
        <NuxtLink to="/dashboard" class="back-btn">← Dashboard</NuxtLink>
        <button class="create-btn" @click="showModal = true">+ สร้าง Project</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="projectStore.loading" class="loading">กำลังโหลด...</div>

    <!-- Empty -->
    <div v-else-if="projectStore.projects.length === 0" class="empty">
      <p>ยังไม่มี project</p>
      <button class="create-btn" @click="showModal = true">สร้าง Project แรก</button>
    </div>

    <!-- Project Grid -->
    <div v-else class="project-grid">
      <div
        v-for="project in projectStore.projects"
        :key="project.id"
        class="project-card"
      >
        <div class="card-body" @click="navigateTo(`/dashboard/projects/${project.id}`)">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description || 'ไม่มีคำอธิบาย' }}</p>
          <span class="date">{{ formatDate(project.created_at) }}</span>
        </div>
        <button class="delete-btn" @click="handleDelete(project.id)">ลบ</button>
      </div>
    </div>

    <!-- Modal สร้าง Project -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <h2>สร้าง Project ใหม่</h2>

        <div class="field">
          <label>ชื่อ Project</label>
          <input v-model="newTitle" class="input" placeholder="เช่น DevFlow" />
        </div>

        <div class="field">
          <label>คำอธิบาย</label>
          <textarea v-model="newDesc" class="input" placeholder="อธิบาย project นี้..." rows="3" />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="modal-actions">
          <button class="cancel-btn" @click="showModal = false">ยกเลิก</button>
          <button class="create-btn" :disabled="creating" @click="handleCreate">
            {{ creating ? 'กำลังสร้าง...' : 'สร้าง' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    function () {
      const authStore = useAuthStore()
      authStore.initAuth()
      if (!authStore.isAuthenticated) return navigateTo('/login')
    }
  ]
})

const projectStore = useProjectStore()

const showModal = ref(false)
const newTitle = ref('')
const newDesc = ref('')
const error = ref('')
const creating = ref(false)

onMounted(async () => {
  try {
    await projectStore.fetchProjects()
  } catch {
    // error dialog แสดงจาก apiFetch แล้ว
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('th-TH')
}

const handleCreate = async () => {
  if (!newTitle.value) {
    error.value = 'กรุณากรอกชื่อ project'
    return
  }
  try {
    creating.value = true
    await projectStore.createProject(newTitle.value, newDesc.value)
    showModal.value = false
    newTitle.value = ''
    newDesc.value = ''
  } catch (e: any) {
    error.value = e.message
  } finally {
    creating.value = false
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('ต้องการลบ project นี้?')) return
  try {
    await projectStore.deleteProject(id)
  } catch {
    // error dialog แสดงจาก apiFetch แล้ว
  }
}
</script>

<style scoped>
.projects-page {
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
  gap: 12px;
  align-items: center;
}

.back-btn {
  color: #6366f1;
  font-size: 14px;
}

.create-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.project-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  transition: 0.2s;
}

.project-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.card-body {
  padding: 20px;
  cursor: pointer;
}

.card-body h3 {
  font-weight: 600;
  margin-bottom: 6px;
}

.card-body p {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 12px;
}

.date {
  font-size: 12px;
  color: #9ca3af;
}

.delete-btn {
  width: 100%;
  padding: 8px;
  background: #fef2f2;
  color: #ef4444;
  border: none;
  border-top: 1px solid #fee2e2;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background: #fee2e2;
}

.loading, .empty {
  text-align: center;
  color: #6b7280;
  padding: 60px 0;
}

.empty p {
  margin-bottom: 16px;
  font-size: 18px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 440px;
}

.modal h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: #6366f1;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  cursor: pointer;
}

.error {
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 12px;
}
</style>