<template>
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
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;
}

.standings-table th,
.standings-table td {
  padding: 0.5rem;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.standings-table th {
  background: #f5f5f5;
  font-size: 0.85rem;
}

.standings-table td:nth-child(2) {
  text-align: left;
}

.state-message {
  padding: 1rem;
  color: #666;
}

.state-message.error {
  color: #d1242f;
}
</style>