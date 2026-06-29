<template>
  <div>
    <p>Dashboard</p>
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
</script>