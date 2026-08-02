<template>
  <div class="bracket-page">

    <div class="header">
      <h1>Llaves eliminatorias</h1>
      <div class="header-actions">
        <button @click="loadAllStages" class="btn-refresh">Actualizar</button>
        <NuxtLink to="/brackets/create" class="btn-primary">Crear partido</NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="state-message">Cargando llaves...</div>

    <div v-else-if="error" class="state-message error">
      Ocurrió un error al cargar las llaves eliminatorias.
    </div>

    <div v-else-if="totalMatches === 0" class="state-message">
      Todavía no hay partidos de eliminatoria registrados.
    </div>

    <div v-else class="bracket-grid">
      <div v-for="stage in stages" :key="stage" class="stage-column">
        <h2>{{ stage }}</h2>

        <div v-if="matchesByStage[stage].length === 0" class="stage-empty">
          Sin partidos todavía
        </div>

        <div
          v-else
          v-for="m in matchesByStage[stage]"
          :key="m.id"
          class="bracket-match"
          :class="{ finished: m.status === 'Finalizado' }"
        >
          <div class="bracket-position">#{{ m.bracketPosition }}</div>

          <div class="bracket-team" :class="{ winner: m.winner === m.homeTeam }">
            {{ teamName(m.homeTeam) }}
            <span v-if="m.homeScore !== null">{{ m.homeScore }}</span>
          </div>

          <div class="bracket-team" :class="{ winner: m.winner === m.awayTeam }">
            {{ teamName(m.awayTeam) }}
            <span v-if="m.awayScore !== null">{{ m.awayScore }}</span>
          </div>

          <div class="bracket-status">{{ m.status }}</div>

          <NuxtLink :to="`/matches/${m.id}`" class="bracket-edit">Editar</NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMatchesByStage } from '~/services/matchesService'
import { useTeams } from '~/composables/useTeams'

const { teams, loadTeams } = useTeams()

const stages = ['Dieciseisavos', 'Octavos', 'Cuartos', 'Semifinal', 'Tercer lugar', 'Final']

const matchesByStage = ref({})
const loading = ref(false)
const error = ref('')

const totalMatches = computed(() => {
  return Object.values(matchesByStage.value).reduce((sum, arr) => sum + arr.length, 0)
})

const teamName = (teamId) => {
  const found = teams.value.find(t => t.id === teamId)
  return found ? found.name : teamId
}

const loadAllStages = async () => {
  try {
    loading.value = true
    error.value = ''

    const result = {}

    for (const stage of stages) {
      const matches = await getMatchesByStage(stage)
      result[stage] = matches.sort((a, b) => (a.bracketPosition ?? 0) - (b.bracketPosition ?? 0))
    }

    matchesByStage.value = result

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadTeams()
  await loadAllStages()
})
</script>

<style scoped>
.bracket-page {
  max-width: 1100px;
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

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.bracket-grid {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}

.stage-column {
  min-width: 220px;
  flex-shrink: 0;
}

.stage-column h2 {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.75rem;
}

.stage-empty {
  color: #999;
  font-size: 0.85rem;
  text-align: center;
  padding: 1rem 0;
}

.bracket-match {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.6rem;
  margin-bottom: 1rem;
  background: #fafafa;
}

.bracket-match.finished {
  background: #f0fff4;
  border-color: #b7e4c7;
}

.bracket-position {
  font-size: 0.7rem;
  color: #999;
  margin-bottom: 0.3rem;
}

.bracket-team {
  display: flex;
  justify-content: space-between;
  padding: 0.15rem 0;
  font-size: 0.9rem;
}

.bracket-team.winner {
  font-weight: bold;
  color: #1a7f37;
}

.bracket-status {
  font-size: 0.7rem;
  color: #888;
  margin-top: 0.3rem;
}

.bracket-edit {
  display: block;
  font-size: 0.75rem;
  text-align: right;
  margin-top: 0.3rem;
  color: #555;
}

.state-message {
  padding: 1rem;
  color: #666;
}

.state-message.error {
  color: #d1242f;
}
</style>