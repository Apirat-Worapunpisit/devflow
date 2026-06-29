<template>
  <div class="register-page">
    <div class="register-card">

      <div class="icon-circle">
        👤
      </div>

      <h1 class="title">สมัครสมาชิก</h1>
      <p class="subtitle">
        สร้างบัญชีเพื่อเริ่มใช้งาน
      </p>

      <form
        class="form"
        @submit.prevent="handleRegister"
      >

        <!-- Name -->
        <div class="field">
          <label>ชื่อผู้ใช้</label>

          <input
            v-model="name"
            class="input"
            placeholder="กรอกชื่อ"
          />
        </div>

        <!-- Email -->
        <div class="field">
          <label>อีเมล</label>

          <input
            v-model="email"
            type="email"
            class="input"
            placeholder="example@email.com"
          />
        </div>

        <!-- Password -->
        <div class="field">
          <label>รหัสผ่าน</label>

          <input
            v-model="password"
            type="password"
            class="input"
            placeholder="••••••••"
          />
        </div>

        <!-- Confirm -->
        <div class="field">
          <label>ยืนยันรหัสผ่าน</label>

          <input
            v-model="confirmPassword"
            type="password"
            class="input"
            placeholder="••••••••"
          />
        </div>

        <div
          v-if="error"
          class="error"
        >
          {{ error }}
        </div>

        <button
          class="submit-btn"
          :disabled="loading"
        >
          {{
            loading
            ? 'กำลังสมัคร...'
            : 'สมัครสมาชิก'
          }}
        </button>

      </form>

      <p class="footer">
        มีบัญชีแล้ว?

        <NuxtLink
          to="/login"
        >
          เข้าสู่ระบบ
        </NuxtLink>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  error.value = ''

  if (
    !name.value ||
    !email.value ||
    !password.value
  ) {
    error.value =
      'กรอกข้อมูลให้ครบ'

    return
  }

  if (
    password.value !==
    confirmPassword.value
  ) {
    error.value =
      'รหัสผ่านไม่ตรงกัน'

    return
  }

  try {

    loading.value = true

   await authStore.register(
    email.value,
    name.value,
    password.value
  )

    navigateTo('/login')

  } catch (e: any) {

    error.value =
      e.message ||
      'สมัครไม่สำเร็จ'

  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page{
  position:fixed;

  inset:0;

  display:flex;

  align-items:center;

  justify-content:center;

  background:
  linear-gradient(
    135deg,
    #6366f1,
    #a855f7,
    #ec4899
  );
}

.register-card{
  width:100%;

  max-width:430px;

  padding:40px;

  border-radius:24px;

  background:
  rgba(
    255,
    255,
    255,
    .15
  );

  backdrop-filter:
  blur(18px);

  color:white;
}

.icon-circle{
  width:70px;

  height:70px;

  margin:auto;

  border-radius:50%;

  background:white;

  color:#6366f1;

  display:grid;

  place-items:center;

  font-size:32px;
}

.title{
  text-align:center;

  margin-top:16px;

  font-size:32px;
}

.subtitle{
  text-align:center;

  opacity:.85;

  margin-bottom:30px;
}

.form{
  display:flex;

  flex-direction:column;

  gap:16px;
}

.field{
  display:flex;

  flex-direction:column;
}

.input{
  padding:14px;

  border:none;

  border-radius:12px;

  margin-top:6px;
}

.input:focus{
  outline:none;

  box-shadow:
  0 0 0 3px
  rgba(
    255,
    255,
    255,
    .3
  );
}

.submit-btn{
  margin-top:12px;

  padding:14px;

  border:none;

  border-radius:12px;

  background:white;

  color:#6366f1;

  font-weight:700;

  cursor:pointer;
}

.error{
  padding:12px;

  border-radius:12px;

  background:
  rgba(
    255,
    0,
    0,
    .15
  );
}

.footer{
  margin-top:20px;

  text-align:center;
}

.footer a{
  color:white;

  font-weight:700;
}
</style>