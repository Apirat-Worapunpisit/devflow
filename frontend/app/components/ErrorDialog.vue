<template>
  <div v-if="errorStore.message" class="error-overlay" @click.self="errorStore.clear()">
    <div class="error-dialog">
      <div class="error-icon">⚠️</div>
      <h3>เกิดข้อผิดพลาด</h3>
      <p>{{ errorStore.message }}</p>
      <button class="error-btn" @click="errorStore.clear()">ตกลง</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const errorStore = useErrorStore()
</script>

<style scoped>
.error-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.error-dialog {
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 380px;
  text-align: center;
}

.error-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.error-dialog h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.error-dialog p {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
  white-space: pre-wrap;
}

.error-btn {
  padding: 10px 32px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}
</style>
