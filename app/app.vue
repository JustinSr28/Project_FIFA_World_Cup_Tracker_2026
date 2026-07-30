<script setup>
const { initAuth } = useAuth()

onMounted(() => {
  initAuth()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>