<template>
  <div class="login-page">
    <div class="login-card">

      <div class="icon-circle">
        <svg class="icon" viewBox="0 0 24 24" fill="none">
          <path
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <h1 class="title">ยินดีต้อนรับ</h1>
      <p class="subtitle">เข้าสู่ระบบเพื่อใช้งานบัญชีของคุณ</p>

      <form @submit.prevent="handleLogin">

        <!-- Email -->
        <div class="field">
          <label>อีเมล</label>

          <div class="input-wrap">
            <input
              v-model="email"
              type="email"
              placeholder="example@email.com"
              autocomplete="email"
              :disabled="loading"
              class="input"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="field">
          <div class="row">
            <label>รหัสผ่าน</label>
            <a href="#" class="forgot">
              ลืมรหัสผ่าน?
            </a>
          </div>

          <div class="input-wrap">

            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              :disabled="loading"
              class="input"
            />

            <button
              type="button"
              class="eye-btn"
              @click="showPassword=!showPassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>

          </div>
        </div>

        <Transition name="fade">
          <div v-if="error" class="error-box">
            {{ error }}
          </div>
        </Transition>

        <button
          type="submit"
          class="submit-btn"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner"></span>

          {{
            loading
              ? 'กำลังเข้าสู่ระบบ...'
              : 'เข้าสู่ระบบ'
          }}
        </button>

      </form>

      <div class="footer">ยังไม่มีบัญชี?
      <NuxtLink to="/register"class="link-strong">สมัครสมาชิก</NuxtLink>
</div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'กรุณากรอกข้อมูลให้ครบ'
    return
  }

  try {
    loading.value = true

    await authStore.login(
      email.value,
      password.value
    )

    navigateTo('/dashboard')

  } catch (e: any) {
    error.value =
      e?.message ||
      'เข้าสู่ระบบไม่สำเร็จ'

  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
*{
  box-sizing:border-box;
}

.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  background:
    linear-gradient(
      135deg,
      #6366f1,
      #a855f7,
      #ec4899
    );
}
.login-card{
  width:100%;
  max-width:420px;

  padding:40px;

  border-radius:24px;

  background:
  rgba(255,255,255,.15);

  backdrop-filter:
  blur(20px);

  border:
  1px solid rgba(
    255,
    255,
    255,
    .25
  );

  box-shadow:
  0 30px 80px rgba(
    0,
    0,
    0,
    .2
  );
}

.icon-circle{
  width:72px;
  height:72px;

  margin:auto;

  border-radius:50%;

  background:white;

  display:grid;
  place-items:center;
}

.icon{
  width:36px;
  color:#4f46e5;
}

.title{
  text-align:center;

  font-size:32px;

  margin:18px 0 6px;

  color:white;
}

.subtitle{
  text-align:center;

  color:
  rgba(255,255,255,.8);

  margin-bottom:32px;
}

.field{
  margin-bottom:18px;
}

label{
  color:white;

  display:block;

  margin-bottom:8px;
}

.row{
  display:flex;

  justify-content:
  space-between;
}

.forgot{
  color:white;

  font-size:14px;
}

.input-wrap{
  position:relative;
}

.input{
  width:100%;

  padding:14px;

  border:none;

  border-radius:14px;

  background:
  rgba(
    255,
    255,
    255,
    .9
  );

  transition:.25s;
}

.input:focus{
  outline:none;

  transform:
  translateY(-1px);

  box-shadow:
  0 0 0 4px
  rgba(
    255,
    255,
    255,
    .25
  );
}

.eye-btn{
  position:absolute;

  right:12px;
  top:50%;

  transform:
  translateY(-50%);

  border:none;

  background:none;

  cursor:pointer;
}

.submit-btn{
  width:100%;

  padding:14px;

  border:none;

  border-radius:14px;

  background:white;

  color:#4f46e5;

  font-weight:700;

  cursor:pointer;

  transition:.25s;
}

.submit-btn:hover{
  transform:
  translateY(-2px);
}

.submit-btn:disabled{
  opacity:.6;
}

.error-box{
  margin-bottom:16px;

  background:
  rgba(
    239,
    68,
    68,
    .15
  );

  color:white;

  padding:12px;

  border-radius:12px;
}

.footer{
  margin-top:20px;

  text-align:center;

  color:white;
}

.footer a{
  color:white;

  font-weight:700;
}

.spinner{
  width:18px;
  height:18px;

  border:
  3px solid #ddd;

  border-top:
  3px solid #4f46e5;

  border-radius:50%;

  animation:
  spin 1s linear infinite;

  display:inline-block;
}

.fade-enter-active,
.fade-leave-active{
  transition:.3s;
}

.fade-enter-from,
.fade-leave-to{
  opacity:0;
}

@keyframes spin{
to{
transform:rotate(360deg)
}
}
</style>