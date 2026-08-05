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
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: Arial, Helvetica, sans-serif;
}

h1 {
  margin-bottom: 2rem;
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
}

/* ==========================
   FORMULARIO
========================== */

.match-form {
  background: #ffffff;
  border: 1px solid #d6dce5;
  border-radius: 14px;
  padding: 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .08);
}

/* ==========================
   RESUMEN DEL PARTIDO
========================== */

.match-summary {
  background: #f8fafc;
  border: 1px solid #dbe3ec;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  margin-bottom: 1.5rem;
}

.match-summary strong {
  color: #1f2937;
  font-size: 1.1rem;
}

.match-meta {
  margin-top: .6rem;
  color: #6b7280;
  font-size: .9rem;
}

/* ==========================
   CAMPOS
========================== */

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.form-row input,
.form-row select {
  flex: 1;
  padding: .85rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: white;
  font-size: .95rem;
  transition: .25s;
}

.form-row input:focus,
.form-row select:focus {
  outline: none;
  border-color: #355c7d;
  box-shadow: 0 0 0 3px rgba(53, 92, 125, .15);
}

/* ==========================
   BOTONES
========================== */

.btn-primary,
.btn-refresh {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: .8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: .25s;
}

.btn-primary {
  background: #355c7d;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #28465f;
}

.btn-refresh {
  background: #eef2f7;
  color: #374151;
  border: 1px solid #cfd8e3;
  margin-left: .8rem;
}

.btn-refresh:hover {
  background: #dde6ef;
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

@media (max-width: 768px) {

  .edit-match-page {
    padding: 0 1rem;
  }

  .form-row {
    flex-direction: column;
  }

  .btn-primary,
  .btn-refresh {
    width: 100%;
    margin: 0;
  }

  .btn-refresh {
    margin-top: .8rem;
  }

}

</style>