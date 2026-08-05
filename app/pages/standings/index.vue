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
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: Arial, Helvetica, sans-serif;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

/* ==========================
   GRID DE GRUPOS
========================== */

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

/* ==========================
   TARJETAS
========================== */

.group-card {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120px;

  background: #ffffff;
  border: 1px solid #dce3ea;
  border-radius: 16px;

  text-decoration: none;
  color: #1f2937;
  font-size: 1.2rem;
  font-weight: 700;

  box-shadow: 0 4px 12px rgba(0, 0, 0, .05);
  transition: all .25s ease;
}

.group-card:hover {
  transform: translateY(-4px);
  border-color: #355c7d;
  background: #f8fafc;
  box-shadow: 0 10px 24px rgba(0, 0, 0, .10);
  color: #355c7d;
}

</style>