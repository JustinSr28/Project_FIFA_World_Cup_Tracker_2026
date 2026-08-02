<template>
    <div class="app">
        <AppHeader/>
        
        <main class="app__container">
            <slot />
        </main>
        <footer class="app__footer">
            <p>&copy; 2024 My Nuxt App. All rights reserved.</p>
        </footer>
    </div>
</template>

<script setup>
import AppHeader from '~/components/appHeader.vue';

</script>


