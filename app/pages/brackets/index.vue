<template>
  <ReloadButton  :loading="loading"  @reload="loadTeams"/>
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
          v-for="m in matchesByStage[stage]" :key="m.id" class="bracket-match" :class="{ finished: m.status === 'Finalizado' }"
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
  max-width: 1500px;
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
  margin-bottom: 2.5rem;
}

.header h1 {
  margin: 0;
  font-size: 2.2rem;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* ==========================
   BOTONES
========================== */

.btn-primary,
.btn-refresh {
  padding: .85rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: .25s;
  cursor: pointer;
}

.btn-primary {
  background: #355c7d;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #27455f;
}

.btn-refresh {
  background: white;
  color: #374151;
  border: 1px solid #d6dce5;
}

.btn-refresh:hover {
  background: #f3f4f6;
}

/* ==========================
   COLUMNAS
========================== */

.bracket-grid {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  align-items: flex-start;
  padding-bottom: 1rem;
}

.stage-column {
  min-width: 290px;
  background: #f8fafc;
  border-radius: 18px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.stage-column h2 {
  margin: 0 0 1rem;
  text-align: center;
  color: #355c7d;
  font-size: 1.1rem;
  font-weight: 700;
}

/* ==========================
   PARTIDOS
========================== */

.bracket-match {
  background: white;
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #dbe3ec;
  transition: .2s;
}

.bracket-match:hover {
  transform: scale(1.02);
  border-color: #355c7d;
}

.bracket-match.finished {
  background: #f9fcff;
}

.bracket-position {
  text-align: right;
  font-size: .75rem;
  color: #9ca3af;
  margin-bottom: .8rem;
}

.bracket-team {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .7rem 0;
  font-size: .95rem;
}

.bracket-team+.bracket-team {
  border-top: 1px solid #eef2f7;
}

.bracket-team span {
  font-weight: bold;
}

.bracket-team.winner {
  color: #355c7d;
  font-weight: 700;
}

.bracket-status {
  margin-top: .8rem;
  text-align: center;
  font-size: .8rem;
  color: #6b7280;
}

.bracket-edit {
  display: block;
  margin-top: 1rem;
  text-align: center;
  text-decoration: none;
  background: #eef2f7;
  color: #355c7d;
  padding: .6rem;
  border-radius: 8px;
  font-weight: 600;
  transition: .2s;
}

.bracket-edit:hover {
  background: #dde6ef;
}

/* ==========================
   MENSAJES
========================== */

.stage-empty,
.state-message {
  text-align: center;
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  border: 1px dashed #cbd5e1;
  color: #6b7280;
}

.state-message.error {
  border-style: solid;
  background: #fff1f2;
  color: #b91c1c;
  border-color: #fecdd3;
}

/* ==========================
   RESPONSIVE
========================== */

@media (max-width: 768px) {

  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-refresh {
    width: 100%;
  }

}

</style>