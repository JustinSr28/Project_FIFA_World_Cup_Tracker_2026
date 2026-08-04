<template>
  <ReloadButton  :loading="loading"  @reload="loadMatch(route.params.id)"/>
  <div class="edit-match-page">

    <h1>Editar partido</h1>

    <div v-if="loading" class="state-message">Cargando partido...</div>

    <div v-else-if="error" class="state-message error">
      Ocurrió un error al cargar el partido.
    </div>

    <div v-else-if="!match" class="state-message">
      No se encontró el partido.
    </div>

    <form v-else @submit.prevent="handleSave" class="match-form">

      <div class="match-summary">
        <strong>{{ teamName(match.homeTeam) }}</strong>
        vs
        <strong>{{ teamName(match.awayTeam) }}</strong>
        <div class="match-meta">Grupo {{ match.group }} · {{ match.stadium }}, {{ match.city }}</div>
      </div>

      <div class="form-row">
        <select v-model="editForm.status" required>
          <option value="Programado">Programado</option>
          <option value="En Vivo">En Vivo</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>

      <div class="form-row">
        <input v-model.number="editForm.homeScore" type="number" min="0" placeholder="Goles local" />
        <input v-model.number="editForm.awayScore" type="number" min="0" placeholder="Goles visitante" />
      </div>

      <button type="submit" class="btn-primary">Guardar cambios</button>
      <NuxtLink :to="match?.group ? '/matches' : '/brackets'" class="btn-refresh">Volver</NuxtLink>

    </form>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMatches } from '~/composables/useMatches'
import { useTeams } from '~/composables/useTeams'
const {updatePredictionScores} = usePredictions()

const route = useRoute()
const { match, loading, error, loadMatch, editMatch } = useMatches()
const { teams, loadTeams } = useTeams()

const editForm = ref({
  status: 'Programado',
  homeScore: null,
  awayScore: null
})

const teamName = (teamId) => {
  const found = teams.value.find(t => t.id === teamId)
  return found ? found.name : teamId
}

watch(match, (newMatch) => {
  if (newMatch) {
    editForm.value = {
      status: newMatch.status,
      homeScore: newMatch.homeScore,
      awayScore: newMatch.awayScore
    }
  }
})

const handleSave = async () => {

  const isKnockoutMatch = !match.value.group

  if (isKnockoutMatch && editForm.value.status === 'Finalizado' && editForm.value.homeScore === editForm.value.awayScore) {
    alert("Un partido de eliminatoria no puede terminar en empate")
    return
  }

  await editMatch(match.value.id, { ...match.value, ...editForm.value })
const updatedMatch = {
    ...match.value,
    ...editForm.value
}

console.log("Partido actualizado:", updatedMatch)

 updatePredictionScores(updatedMatch)

  await navigateTo(isKnockoutMatch ? '/brackets' : '/matches')
}

onMounted(async () => {
  await loadTeams()
  await loadMatch(route.params.id)
})
</script>

<style scoped>
.edit-match-page {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: sans-serif;
}

.match-form {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}

.match-summary {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
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
  text-decoration: none;
  display: inline-block;
}

.btn-refresh {
  background: #eee;
  border: 1px solid #ccc;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  color: #333;
  margin-left: 0.5rem;
}

.state-message {
  padding: 1rem;
  color: #666;
}

.state-message.error {
  color: #d1242f;
}
</style>