<template>
  <div class="project-page">
    <!-- Header -->
    <div class="header">
      <div>
        <NuxtLink to="/dashboard/projects" class="back-btn"
          >← Projects</NuxtLink
        >
        <h1 class="title">{{ project?.title || "Loading..." }}</h1>
        <p class="subtitle">{{ project?.description || "ไม่มีคำอธิบาย" }}</p>
      </div>
      <button class="create-btn" @click="showModal = true">+ สร้าง Task</button>
    </div>

    <!-- AI Breakdown -->
    <div class="ai-section">
      <h2>🤖 AI Task Breakdown</h2>
      <p class="ai-desc">พิมพ์ชื่อ feature แล้วให้ AI แตก tasks ให้อัตโนมัติ</p>
      <div class="ai-input">
        <input
          v-model="aiFeature"
          class="input"
          placeholder="เช่น ระบบ login, ระบบ payment..."
          :disabled="aiLoading"
        />
        <button
          class="ai-btn"
          :disabled="aiLoading || !aiFeature"
          @click="handleAIBreakdown"
        >
          {{ aiLoading ? "กำลังคิด..." : "✨ แตก Tasks" }}
        </button>
      </div>

      <!-- AI Result -->
      <div v-if="aiTasks.length > 0" class="ai-result">
        <p class="ai-result-title">AI แนะนำ {{ aiTasks.length }} tasks</p>
        <div v-for="(task, index) in aiTasks" :key="index" class="ai-task-card">
          <div class="ai-task-top">
            <p class="ai-task-title">{{ task.title }}</p>
            <span :class="['priority', task.priority]">{{
              task.priority
            }}</span>
          </div>
          <p class="ai-task-desc">{{ task.description }}</p>
          <p class="ai-task-hours">⏱ {{ task.estimated_hours }} ชั่วโมง</p>
        </div>
        <div class="ai-actions">
          <button class="cancel-btn" @click="aiTasks = []">ยกเลิก</button>
          <button class="create-btn" :disabled="addingAll" @click="addAllTasks">
            {{ addingAll ? "กำลังเพิ่ม..." : "+ เพิ่มทั้งหมด" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="kanban">
      <!-- TODO -->
      <div class="column">
        <div class="column-header todo">
          <span>📋 Todo</span>
          <span class="count">{{ todoTasks.length }}</span>
        </div>
        <div class="task-list" @dragover.prevent @drop="drop('todo')">
          <div
            v-for="task in todoTasks"
            :key="task.id"
            class="task-card"
            draggable="true"
            @dragstart="dragStart(task)"
          >
            <div class="task-top">
              <p class="task-title">{{ task.title }}</p>
              <button class="delete-task" @click="handleDeleteTask(task.id)">
                ✕
              </button>
            </div>
            <p v-if="task.description" class="task-desc">
              {{ task.description }}
            </p>
            <span :class="['priority', task.priority]">{{
              task.priority
            }}</span>
          </div>
        </div>
      </div>

      <!-- IN PROGRESS -->
      <div class="column">
        <div class="column-header in-progress">
          <span>⚡ In Progress</span>
          <span class="count">{{ inProgressTasks.length }}</span>
        </div>
        <div class="task-list" @dragover.prevent @drop="drop('in_progress')">
          <div
            v-for="task in inProgressTasks"
            :key="task.id"
            class="task-card"
            draggable="true"
            @dragstart="dragStart(task)"
          >
            <div class="task-top">
              <p class="task-title">{{ task.title }}</p>
              <button class="delete-task" @click="handleDeleteTask(task.id)">
                ✕
              </button>
            </div>
            <p v-if="task.description" class="task-desc">
              {{ task.description }}
            </p>
            <span :class="['priority', task.priority]">{{
              task.priority
            }}</span>
          </div>
        </div>
      </div>

      <!-- DONE -->
      <div class="column">
        <div class="column-header done">
          <span>✅ Done</span>
          <span class="count">{{ doneTasks.length }}</span>
        </div>
        <div class="task-list" @dragover.prevent @drop="drop('done')">
          <div
            v-for="task in doneTasks"
            :key="task.id"
            class="task-card done-card"
            draggable="true"
            @dragstart="dragStart(task)"
          >
            <div class="task-top">
              <p class="task-title">{{ task.title }}</p>
              <button class="delete-task" @click="handleDeleteTask(task.id)">
                ✕
              </button>
            </div>
            <p v-if="task.description" class="task-desc">
              {{ task.description }}
            </p>
            <span :class="['priority', task.priority]">{{
              task.priority
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal สร้าง Task -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <h2>สร้าง Task ใหม่</h2>

        <div class="field">
          <label>ชื่อ Task</label>
          <input
            v-model="newTitle"
            class="input"
            placeholder="เช่น Setup Docker"
          />
        </div>

        <div class="field">
          <label>คำอธิบาย</label>
          <textarea
            v-model="newDesc"
            class="input"
            placeholder="อธิบาย task นี้..."
            rows="3"
          />
        </div>

        <div class="field">
          <label>Priority</label>
          <select v-model="newPriority" class="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="modal-actions">
          <button class="cancel-btn" @click="showModal = false">ยกเลิก</button>
          <button class="create-btn" :disabled="creating" @click="handleCreate">
            {{ creating ? "กำลังสร้าง..." : "สร้าง" }}
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
      const authStore = useAuthStore();
      authStore.initAuth();
      if (!authStore.isAuthenticated) return navigateTo("/login");
    },
  ],
});

const route = useRoute();
const projectId = Number(route.params.id);
const taskStore = useTaskStore();
const projectStore = useProjectStore();

const project = computed(() =>
  projectStore.projects.find((p) => p.id === projectId),
);

const todoTasks = computed(() =>
  taskStore.tasks.filter((t) => t.status === "todo"),
);
const inProgressTasks = computed(() =>
  taskStore.tasks.filter((t) => t.status === "in_progress"),
);
const doneTasks = computed(() =>
  taskStore.tasks.filter((t) => t.status === "done"),
);

const showModal = ref(false);
const newTitle = ref("");
const newDesc = ref("");
const newPriority = ref("medium");
const error = ref("");
const creating = ref(false);
const aiFeature = ref('')
const aiLoading = ref(false)
const aiTasks = ref<any[]>([])
const addingAll = ref(false)

const handleAIBreakdown = async () => {
  if (!aiFeature.value) return
  aiLoading.value = true
  aiTasks.value = []

  try {
    const authStore = useAuthStore()
    const data = await apiFetch<{ tasks: any[] }>(
      `/tasks/ai-breakdown?feature=${encodeURIComponent(aiFeature.value)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    )

    aiTasks.value = data.tasks
  } catch (e: any) {
    error.value = e.message
  } finally {
    aiLoading.value = false
  }
}

const addAllTasks = async () => {
  addingAll.value = true
  try {
    for (const task of aiTasks.value) {
      await taskStore.createTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        project_id: projectId,
      })
    }
    aiTasks.value = []
    aiFeature.value = ''
  } catch {
    // error dialog แสดงจาก apiFetch แล้ว
  } finally {
    addingAll.value = false
  }
}

let draggedTask: any = null;

const dragStart = (task: any) => {
  draggedTask = task;
};

const drop = async (status: string) => {
  if (!draggedTask || draggedTask.status === status) return;
  const taskId = draggedTask.id;
  draggedTask = null;
  try {
    await taskStore.updateTaskStatus(taskId, status);
  } catch {
    // error dialog แสดงจาก apiFetch แล้ว
  }
};

const handleCreate = async () => {
  if (!newTitle.value) {
    error.value = "กรุณากรอกชื่อ task";
    return;
  }
  try {
    creating.value = true;
    await taskStore.createTask({
      title: newTitle.value,
      description: newDesc.value,
      priority: newPriority.value,
      project_id: projectId,
    });
    showModal.value = false;
    newTitle.value = "";
    newDesc.value = "";
  } catch (e: any) {
    error.value = e.message;
  } finally {
    creating.value = false;
  }
};

const handleDeleteTask = async (id: number) => {
  if (!confirm("ต้องการลบ task นี้?")) return;
  try {
    await taskStore.deleteTask(id);
  } catch {
    // error dialog แสดงจาก apiFetch แล้ว
  }
};

onMounted(async () => {
  try {
    await projectStore.fetchProjects();
    await taskStore.fetchTasks(projectId);
  } catch {
    // error dialog แสดงจาก apiFetch แล้ว
  }
});
</script>

<style scoped>
.project-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.subtitle {
  color: #6b7280;
  margin-top: 4px;
}

.create-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}

.kanban {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.column {
  background: #f9fafb;
  border-radius: 16px;
  padding: 16px;
  min-height: 500px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 600;
  margin-bottom: 16px;
}

.todo {
  background: #eff6ff;
  color: #3b82f6;
}
.in-progress {
  background: #fefce8;
  color: #d97706;
}
.done {
  background: #f0fdf4;
  color: #16a34a;
}

.count {
  background: white;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 13px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 400px;
}

.task-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  cursor: grab;
  transition: 0.2s;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.done-card {
  opacity: 0.7;
}

.task-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.task-title {
  font-weight: 600;
  font-size: 14px;
}

.task-desc {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 8px;
}

.delete-task {
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
}

.delete-task:hover {
  color: #ef4444;
}

.priority {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
}

.priority.low {
  background: #f0fdf4;
  color: #16a34a;
}
.priority.medium {
  background: #fefce8;
  color: #d97706;
}
.priority.high {
  background: #fef2f2;
  color: #ef4444;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
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
}

.ai-section {
  margin-bottom: 32px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(135deg, #faf5ff, #eff6ff);
}

.ai-section h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.ai-desc {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.ai-input {
  display: flex;
  gap: 12px;
}

.ai-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}

.ai-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-result {
  margin-top: 20px;
}

.ai-result-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #6366f1;
}

.ai-task-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 10px;
}

.ai-task-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.ai-task-title {
  font-weight: 600;
  font-size: 14px;
}

.ai-task-desc {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 6px;
}

.ai-task-hours {
  font-size: 12px;
  color: #9ca3af;
}

.ai-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
