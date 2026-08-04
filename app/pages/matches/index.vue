<template>
  <div class="matches-page">

    <div class="header">
      <h1>Partidos</h1>
      <button @click="loadMatchesByStage('Fase de grupos')" class="btn-refresh">Actualizar</button>
    </div>

    <!-- Formulario de creación -->
    <form @submit.prevent="handleCreate" class="match-form">
      <h2>Nuevo partido</h2>


      <div class="form-row">
        <select v-model="form.homeTeam" required>
          <option value="" disabled>Equipo local</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>

        <select v-model="form.awayTeam" required>
          <option value="" disabled>Equipo visitante</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <select v-model="form.group" required>
          <option value="" disabled>Grupo</option>
          <option v-for="g in groups" :key="g" :value="g">Grupo {{ g }}</option>
        </select>
      </div>

      <div class="form-row">
        <input v-model="form.stadium" placeholder="Estadio" />
        <input v-model="form.city" placeholder="Ciudad" />
      </div>

      <div class="form-row">
        <input v-model="form.kickoff" type="datetime-local" />
      </div>

      <button type="submit" class="btn-primary">Crear partido</button>
    </form>

    <div class="matches-list">
      <h2>Partidos registrados</h2>

      <div v-if="loading" class="state-message">Cargando partidos...</div>

      <div v-else-if="error" class="state-message error">
        Ocurrió un error al cargar los partidos.
      </div>

      <div v-else-if="!matches || matches.length === 0" class="state-message">
        No hay partidos registrados todavía.
      </div>

      <div v-else class="match-card" v-for="m in matches" :key="m.id">
        
        <div class="match-info">
          <strong>{{ teamName(m.homeTeam) }} {{ m.homeScore ?? '-' }}</strong>
          vs
          <strong>{{ m.awayScore ?? '-' }} {{ teamName(m.awayTeam) }}</strong>
          <span class="badge">{{ m.status }}</span>

          <button
            class="favorite"
            :class="{ 'favorite--active': esFavoritoMatch(m.id) }"
            @click="handleToggleFavoriteMatch(m.id)"
          >
            {{ esFavoritoMatch(m.id) ? '⭐' : '☆' }}
          </button>
        </div>
        <div class="match-meta">
          Grupo {{ m.group }} · {{ m.stadium }}, {{ m.city }}
        </div>

        <div class="match-actions">
          <NuxtLink :to="`/matches/${m.id}`" class="btn-primary">Editar</NuxtLink>
          <button @click="deleteMatch(m.id)" class="btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMatches } from '~/composables/useMatches'
import { useTeams } from '~/composables/useTeams'
import { useAuth } from '~/composables/useAuth'
import { useUsers } from '~/composables/useUsers'



const { matches, loading, error, addMatch, removeMatch, loadMatchesByStage } = useMatches()
const { teams, loadTeams } = useTeams()
const { user, firestoreUser } = useAuth()
const { toggleFavoriteMatchAndSave, loadUser } = useUsers()


const emptyForm = () => ({
  homeTeam: '',
  awayTeam: '',
  group: '',
  stage: 'Fase de grupos',
  stadium: '',
  city: '',
  kickoff: '',
  date: '',
  status: 'Programado',
  homeScore: null,
  awayScore: null,
  winner: null
})

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']


const form = ref(emptyForm())

const handleCreate = async () => {

  const matchData = {
    ...form.value,
    date: form.value.kickoff
      ? form.value.kickoff.split("T")[0]
      : ""
  }
  await addMatch(matchData)
  await loadMatchesByStage('Fase de grupos')
  form.value = emptyForm()
}

const deleteMatch =  async (teamId) => {
  await removeMatch(teamId)
  await loadMatchesByStage('Fase de grupos')

}

const teamName = (teamId) => {
  const found = teams.value.find(t => t.id === teamId)
  return found ? found.name : teamId
}

onMounted(async () => {
  await loadTeams()
  await loadMatchesByStage('Fase de grupos')
})

const esFavoritoMatch = (matchId) => {
  return firestoreUser.value?.favoriteMatches?.includes(matchId) || false
}

const handleToggleFavoriteMatch = async (matchId) => {

  if (!user.value) {
    alert("Debes iniciar sesión para marcar favoritos")
    return
  }

  const current = firestoreUser.value?.favoriteMatches || []

  await toggleFavoriteMatchAndSave(user.value.uid, current, matchId)

  const { loadUser } = useUsers()
  await loadUser(user.value.uid)
}

</script>

<style scoped>
.matches-page {
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

.match-form {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
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

.btn-refresh {
  background: #eee;
  border: 1px solid #ccc;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background: #d1242f;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.state-message {
  padding: 1rem;
  color: #666;
}

.state-message.error {
  color: #d1242f;
}

.match-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
}

.match-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  margin-left: auto;
  background: #f0f0f0;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.match-meta {
  color: #888;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.match-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>