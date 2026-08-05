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
        <input v-model="form.stadium" placeholder="Estadio" required />
        <input v-model="form.city" placeholder="Ciudad" required />
      </div>

      <div class="form-row">
        <input v-model="form.kickoff" type="datetime-local" required />
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
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: Arial, Helvetica, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0;
  font-weight: 700;
}

/* ==========================
   FORMULARIO
========================== */

.match-form {
  background: #ffffff;
  border: 1px solid #d6dce5;
  border-radius: 14px;
  padding: 1.8rem;
  margin-bottom: 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .08);
}

.match-form h2 {
  margin: 0 0 1.2rem;
  color: #374151;
  font-size: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row input,
.form-row select {
  flex: 1;
  padding: .85rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: .95rem;
  background: #fff;
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
.btn-refresh,
.btn-danger {
  transition: .25s;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background: #355c7d;
  color: white;
  border: none;
  padding: .8rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background: #28465f;
}

.btn-refresh {
  background: #eef2f7;
  color: #374151;
  border: 1px solid #cfd8e3;
  padding: .7rem 1.2rem;
  border-radius: 10px;
}

.btn-refresh:hover {
  background: #dde6ef;
}

.btn-danger {
  background: #d9534f;
  color: white;
  border: none;
  padding: .7rem 1.2rem;
  border-radius: 10px;
}

.btn-danger:hover {
  background: #bf3d39;
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
  color: #b91c1c;
  background: #fff1f2;
  border-color: #fecdd3;
}

/* ==========================
   LISTA
========================== */

.matches-list h2 {
  margin-bottom: 1.3rem;
  color: #374151;
}

/* ==========================
   TARJETAS
========================== */

.match-card {
  background: white;
  border: 1px solid #dce3ea;
  border-radius: 14px;
  padding: 1.2rem 1.4rem;
  margin-bottom: 1rem;
  transition: .25s;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0,0,0,.10);
}

.match-info {
  display: flex;
  align-items: center;
  gap: .7rem;
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
  flex-wrap: wrap;
}

.badge {
  margin-left: auto;
  background: #355c7d;
  color: white;
  padding: .35rem .8rem;
  border-radius: 999px;
  font-size: .8rem;
  font-weight: 600;
}

.favorite {
  margin-left: .5rem;
  border: none;
  background: transparent;
  font-size: 1.35rem;
  cursor: pointer;
  transition: .2s;
}

.favorite:hover {
  transform: scale(1.15);
}

.favorite--active {
  color: #f4b400;
}

.match-meta {
  margin-top: .8rem;
  color: #6b7280;
  font-size: .9rem;
}

.match-actions {
  display: flex;
  justify-content: flex-end;
  gap: .8rem;
  margin-top: 1.2rem;
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

  .form-row {
    flex-direction: column;
  }

  .match-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .badge {
    margin-left: 0;
  }

  .match-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-danger,
  .btn-refresh {
    width: 100%;
  }
}

</style>