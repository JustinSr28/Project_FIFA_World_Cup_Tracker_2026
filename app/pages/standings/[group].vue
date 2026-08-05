<template>
  <ReloadButton  :loading="loading"  @reload="load"/>
  <div class="standings-page">

    <div class="header">
      <NuxtLink to="/standings" class="btn-refresh">← Todos los grupos</NuxtLink>
      <h1>Grupo {{ group }}</h1>
      <button @click="load" class="btn-refresh">Actualizar</button>
    </div>

    <div v-if="loading" class="state-message">Cargando tabla...</div>

    <div v-else-if="error" class="state-message error">
      Ocurrió un error al cargar la tabla de posiciones.
    </div>

    <div v-else-if="sortedStandings.length === 0" class="state-message">
      Aún no hay datos para este grupo.
    </div>

    <table v-else class="standings-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Equipo</th>
          <th>PJ</th>
          <th>G</th>
          <th>E</th>
          <th>P</th>
          <th>GF</th>
          <th>GC</th>
          <th>DG</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, index) in sortedStandings" :key="s.id">
          <td>{{ index + 1 }}</td>
          <td>{{ teamName(s.teamId) }}</td>
          <td>{{ s.played }}</td>
          <td>{{ s.wins }}</td>
          <td>{{ s.draws }}</td>
          <td>{{ s.losses }}</td>
          <td>{{ s.goalsFor }}</td>
          <td>{{ s.goalsAgainst }}</td>
          <td>{{ s.goalDifference }}</td>
          <td><strong>{{ s.points }}</strong></td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getStandingsByGroup } from '~/services/standingsService'
import { useTeams } from '~/composables/useTeams'

const route = useRoute()
const group = route.params.group

const { teams, loadTeams } = useTeams()

const standings = ref([])
const loading = ref(false)
const error = ref('')

const teamName = (teamId) => {
  const found = teams.value.find(t => t.id === teamId)
  return found ? found.name : teamId
}

const sortedStandings = computed(() => {
  return [...standings.value].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return b.goalDifference - a.goalDifference
  })
})

const load = async () => {
  try {
    loading.value = true
    error.value = ''
    standings.value = await getStandingsByGroup(group)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadTeams()
  await load()
})
</script>
<style scoped>

.standings-page {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: Arial, Helvetica, sans-serif;
}

/* ==========================
   HEADER
========================== */

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
}

.btn-refresh {
  padding: .75rem 1.2rem;
  border-radius: 10px;
  border: 1px solid #cfd8e3;
  background: #eef2f7;
  color: #374151;
  text-decoration: none;
  font-weight: 600;
  transition: .25s;
}

.btn-refresh:hover {
  background: #dde6ef;
}

/* ==========================
   TABLA
========================== */

.standings-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 14px;
  background: white;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .08);
}

.standings-table thead {
  background: #355c7d;
  color: white;
}

.standings-table th {
  padding: 1rem .8rem;
  font-size: .9rem;
  font-weight: 600;
  text-align: center;
}

.standings-table td {
  padding: .9rem .8rem;
  text-align: center;
  border-bottom: 1px solid #eef2f7;
  color: #374151;
}

.standings-table tbody tr {
  transition: .2s;
}

.standings-table tbody tr:hover {
  background: #f8fafc;
}

.standings-table td:nth-child(2) {
  text-align: left;
  font-weight: 600;
  color: #1f2937;
}

.standings-table tbody tr:last-child td {
  border-bottom: none;
}

/* ==========================
   MENSAJES
========================== */

.state-message {
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border: 1px solid #dbe3ec;
  border-radius: 12px;
  color: #6b7280;
}

.state-message.error {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #b91c1c;
}

/* ==========================
   RESPONSIVE
========================== */

@media (max-width: 900px) {

  .standings-page {
    overflow-x: auto;
  }

  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .header h1 {
    text-align: center;
  }

  .standings-table {
    min-width: 760px;
  }

}

</style>