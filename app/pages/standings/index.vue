<template>
  <div class="standings-index-page">

    <h1>Tabla de posiciones</h1>

    <div class="groups-grid">
      <NuxtLink
        v-for="g in groups" :key="g" :to="`/standings/${g}`" class="group-card">
        Grupo {{ g }}
      </NuxtLink>
    </div>

  </div>
</template>

<script setup>
const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
</script>

<style scoped>
.standings-index-page {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: sans-serif;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.group-card {
  display: block;
  text-align: center;
  padding: 1.2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.group-card:hover {
  background: #f5f5f5;
}
</style>
