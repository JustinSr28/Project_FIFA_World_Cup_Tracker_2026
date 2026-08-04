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

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

html,
body {
  font-family: 'Inter', sans-serif;
}
</style>