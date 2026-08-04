<template>
    <div class="app">

        <AppHeader/>

        <main class="app__container">
            <slot />
        </main>

        <footer class="app__footer">
            <p>&copy; FIFA WORLD CUP 2026. All rights reserved.</p>
        </footer>

    </div>
</template>

<script setup>
import AppHeader from '~/components/appHeader.vue';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.app {
  min-height:100vh;
  display:flex;
  flex-direction:column;
  font-family:'Inter', sans-serif;
  background:#f8fafc;
}
.app__container {
  flex:1;
  width:100%;
}
.app__footer {
  height:65px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#111827;
  color:#cbd5e1;
  border-top:1px solid rgba(255,255,255,.08);
  font-size:.9rem;
  font-weight:500;
}
.app__footer p {
  margin:0;
}
</style>