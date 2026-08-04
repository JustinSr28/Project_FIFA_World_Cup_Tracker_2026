<template>
    <ReloadButton  :loading="loading"  @reload="loadFavoriteMatches"/>
  <div class="favorites-page">

    <h1>Mis favoritos</h1>

    <div v-if="!user" class="state-message">
      Debes iniciar sesión para ver tus favoritos.
    </div>

    <template v-else>

      <section class="favorite-team-section">
        <h2>Equipo favorito</h2>

        <div v-if="!favoriteTeam" class="state-message">
          Aún no has marcado un equipo favorito.
          <NuxtLink to="/teams">Ir a equipos</NuxtLink>
        </div>

        <div v-else class="favorite-team-card">
          <img :src="favoriteTeam.flag" :alt="favoriteTeam.name" class="flag" />
          <div>
            <h3>{{ favoriteTeam.name }}</h3>
            <p>Grupo {{ favoriteTeam.group }}</p>
          </div>
        </div>
      </section>

      <section class="favorite-matches-section">
        <h2>Partidos favoritos</h2>

        <div v-if="loading" class="state-message">Cargando partidos...</div>

        <div v-else-if="favoriteMatchesList.length === 0" class="state-message">
          Aún no has marcado partidos como favoritos.
          <NuxtLink to="/matches">Ir a partidos</NuxtLink>
        </div>

        <div v-else class="matches-grid">
          <div v-for="m in favoriteMatchesList" :key="m.id" class="match-card">
            <div class="match-info">
              <strong>{{ teamName(m.homeTeam) }} {{ m.homeScore ?? '-' }}</strong>
              vs
              <strong>{{ m.awayScore ?? '-' }} {{ teamName(m.awayTeam) }}</strong>
              <span class="badge">{{ m.status }}</span>
            </div>
            <div class="match-meta">
              {{ m.group ? `Grupo ${m.group}` : m.stage }} · {{ m.stadium }}, {{ m.city }}
            </div>
          </div>
        </div>
      </section>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useTeams } from '~/composables/useTeams'
import { getMatchById } from '~/services/matchesService'

const { user, firestoreUser } = useAuth()
const { teams, loadTeams } = useTeams()

const loading = ref(false)
const favoriteMatchesList = ref([])

const teamName = (teamId) => {
  const found = teams.value.find(t => t.id === teamId)
  return found ? found.name : teamId
}

const favoriteTeam = computed(() => {
  if (!firestoreUser.value?.favoriteTeam) return null
  return teams.value.find(t => t.id === firestoreUser.value.favoriteTeam) || null
})

const loadFavoriteMatches = async () => {

  const ids = firestoreUser.value?.favoriteMatches || []

  if (ids.length === 0) {
    favoriteMatchesList.value = []
    return
  }

  loading.value = true

  const results = await Promise.all(
    ids.map(id => getMatchById(id))
  )

  favoriteMatchesList.value = results.filter(m => m !== null)

  loading.value = false
}

onMounted(async () => {
  await loadTeams()
  await loadFavoriteMatches()
})
</script>

<style scoped>
.favorites-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: sans-serif;
}

.favorite-team-section {
  margin-bottom: 2rem;
}

.favorite-team-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  max-width: 300px;
}

.flag {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.match-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.badge {
  margin-left: 0.5rem;
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

.state-message {
  padding: 1rem;
  color: #666;
}
</style>