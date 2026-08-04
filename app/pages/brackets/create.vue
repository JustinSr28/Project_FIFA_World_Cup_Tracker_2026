<template>
  <ReloadButton  :loading="loading"  @reload="loadTeams"/>
  <div class="create-bracket-page">

    <h1>Crear partido de eliminatoria</h1>

    <div v-if="checkingGroupStage" class="state-message">
      Verificando estado de la fase de grupos...
    </div>

    <div v-else-if="!groupStageReady" class="state-message error">
      Aún no puedes crear partidos de eliminatoria — faltan partidos
      de fase de grupos por finalizar.
    </div>

    <form v-else @submit.prevent="handleCreate" class="match-form">

      <div class="form-row">
        <select v-model="form.stage" @change="handleStageChange" required>
          <option value="" disabled>Fase</option>
          <option v-for="s in stages" :key="s" :value="s">{{ s }}</option>
        </select>

        <input v-model.number="form.bracketPosition" type="number" min="1" placeholder="Posición en el bracket"/>
      </div>

      <div v-if="loadingOptions" class="state-message">
        Cargando equipos disponibles...
      </div>

      <div v-else-if="form.stage && teamOptions.length === 0" class="state-message error">
        No hay equipos disponibles todavía para esta fase —
        revisa que la ronda anterior esté completamente finalizada.
      </div>

      <div v-else-if="form.stage" class="form-row">
        <select v-model="form.homeTeam" required>
          <option value="" disabled>Equipo local</option>
          <option v-for="t in teamOptions" :key="t.teamId" :value="t.teamId">
            {{ t.teamName }}
          </option>
        </select>

        <select v-model="form.awayTeam" required>
          <option value="" disabled>Equipo visitante</option>
          <option v-for="t in teamOptions" :key="t.teamId" :value="t.teamId">
            {{ t.teamName }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <input v-model="form.stadium" placeholder="Estadio" />
        <input v-model="form.city" placeholder="Ciudad" />
      </div>

      <div class="form-row">
        <input v-model="form.kickoff" type="datetime-local" />
      </div>

      <button type="submit" class="btn-primary" :disabled="!canSubmit">
        Crear partido
      </button>
      <NuxtLink :to="`/brackets`" class="btn-primary">Volver</NuxtLink>
    </form>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMatches } from '~/composables/useMatches'
import { useStandings } from '~/composables/useStandings'
import { useTeams } from '~/composables/useTeams'

const { isGroupStageComplete, getMatchesByStage, addMatch } = useMatches()
const { getQualifiedTeams } = useStandings()
const { teams, loadTeams } = useTeams()

const teamName = (teamId) => {
  const found = teams.value.find(t => t.id === teamId)
  return found ? found.name : teamId
}

const stages = ['Dieciseisavos', 'Octavos', 'Cuartos', 'Semifinal', 'Tercer lugar', 'Final']

const previousStageMap = {
  'Octavos': 'Dieciseisavos',
  'Cuartos': 'Octavos',
  'Semifinal': 'Cuartos',
  'Tercer lugar': 'Semifinal',
  'Final': 'Semifinal'
}

const checkingGroupStage = ref(true)
const groupStageReady = ref(false)

const loadingOptions = ref(false)
const teamOptions = ref([])

const emptyForm = () => ({
  stage: '',
  bracketPosition: null,
  homeTeam: '',
  awayTeam: '',
  stadium: '',
  city: '',
  kickoff: '',
  status: 'Programado',
  homeScore: null,
  awayScore: null,
  winner: null,
  group: null  
})

const form = ref(emptyForm())

const canSubmit = computed(() => {
  return form.value.stage && form.value.homeTeam && form.value.awayTeam && form.value.bracketPosition
})

const handleStageChange = async () => {

  form.value.homeTeam = ''
  form.value.awayTeam = ''
  teamOptions.value = []

  if (!form.value.stage) return

  loadingOptions.value = true

  try {

    if (form.value.stage === 'Dieciseisavos') {
      teamOptions.value = await getQualifiedTeams()
      return
    }

    const previousStage = previousStageMap[form.value.stage]

    const previousMatches = await getMatchesByStage(previousStage)

    if (previousMatches.length === 0 || !previousMatches.every(m => m.status === 'Finalizado')) {
      teamOptions.value = []
      return
    }

    if (form.value.stage === 'Tercer lugar') {
      teamOptions.value = previousMatches.map(m => {
        const loserId = m.winner === m.homeTeam ? m.awayTeam : m.homeTeam
        return { teamId: loserId, teamName: teamName(loserId) }
      })
    } else {
      teamOptions.value = previousMatches.map(m => ({
        teamId: m.winner,
        teamName: teamName(m.winner)
      }))
    }

  } finally {
    loadingOptions.value = false
  }
}

const handleCreate = async () => {
  await addMatch({ ...form.value })
  form.value = emptyForm()
  teamOptions.value = []
  await navigateTo('/brackets')
}

onMounted(async () => {
  await loadTeams()
  checkingGroupStage.value = true
  groupStageReady.value = await isGroupStageComplete()
  checkingGroupStage.value = false
})
</script>

<style scoped>
.create-bracket-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: sans-serif;
}

.match-form {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}

.form-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.form-row input,
.form-row select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-primary {
  background: #1a7f37;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:disabled {
  background: #999;
  cursor: not-allowed;
}

.state-message {
  padding: 1rem;
  color: #666;
}

.state-message.error {
  color: #d1242f;
}
</style>