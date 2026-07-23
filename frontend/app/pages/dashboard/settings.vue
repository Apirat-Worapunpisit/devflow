<template>
  <div class="settings-page">
    <div class="header">
      <NuxtLink to="/dashboard" class="back-btn">← Dashboard</NuxtLink>
      <h1 class="title">⚙️ Settings</h1>
    </div>

    <div class="section">
      <h2>บัญชีของฉัน</h2>
      <div class="info-card">
        <div class="info-row">
          <span class="label">Username</span>
          <span class="value">{{ authStore.user?.username || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email</span>
          <span class="value">{{ authStore.user?.email || '-' }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <button class="logout-btn" @click="authStore.logout()">
        ออกจากระบบ
      </button>
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

const authStore = useAuthStore()

onMounted(async () => {
  try {
    await authStore.fetchUser()
  } catch {
    // error dialog แสดงจาก apiFetch แล้ว
  }
})
</script>

<style scoped>
.settings-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  margin-bottom: 32px;
}

.back-btn {
  color: #6366f1;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}

.title {
  font-size: 28px;
  font-weight: 700;
}

.section {
  margin-bottom: 32px;
}

.section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.info-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: #6b7280;
  font-size: 14px;
}

.value {
  font-weight: 500;
}

.logout-btn {
  padding: 10px 20px;
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.logout-btn:hover {
  background: #fee2e2;
}
</style>