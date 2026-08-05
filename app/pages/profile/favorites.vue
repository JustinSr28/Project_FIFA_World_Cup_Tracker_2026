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
          <NuxtLink to="/matches/filter">Ir a partidos</NuxtLink>
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
import { ref, computed, onMounted, watch } from 'vue'
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

watch(firestoreUser, async (newUser) => {
  if (newUser) {
    await loadFavoriteMatches()
  }
})

onMounted(async () => {
  await loadTeams()
  await loadFavoriteMatches()   
})

</script>
<style scoped>

.favorites-page {
  max-width: 1100px;
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

.favorite-team-section,
.favorite-matches-section {
  margin-bottom: 2.5rem;
}

.favorite-team-section h2,
.favorite-matches-section h2 {
  margin-bottom: 1rem;
  color: #374151;
  font-size: 1.4rem;
}

/* ==========================
   EQUIPO FAVORITO
========================== */

.favorite-team-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.flag {
  width: 90px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.favorite-team-card h3 {
  margin: 0;
  color: #1f2937;
}

.favorite-team-card p {
  margin-top: .4rem;
  color: #6b7280;
}

/* ==========================
   PARTIDOS FAVORITOS
========================== */

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.match-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.2rem;
  transition: .2s;
}

.match-card:hover {
  border-color: #355c7d;
}

.match-info {
  display: flex;
  align-items: center;
  gap: .5rem;
  flex-wrap: wrap;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.match-info strong {
  font-weight: 700;
}

.badge {
  margin-left: auto;
  background: #355c7d;
  color: white;
  padding: .3rem .8rem;
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 600;
}

.match-meta {
  margin-top: .8rem;
  padding-top: .8rem;
  border-top: 1px solid #eef2f7;
  color: #6b7280;
  font-size: .9rem;
}

/* ==========================
   MENSAJES
========================== */

.state-message {
  padding: 1.5rem;
  text-align: center;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #6b7280;
}

.state-message a {
  display: inline-block;
  margin-top: .8rem;
  color: #355c7d;
  font-weight: 600;
  text-decoration: none;
}

.state-message a:hover {
  text-decoration: underline;
}

/* ==========================
   RESPONSIVE
========================== */

@media (max-width: 768px) {

  .favorite-team-card {
    flex-direction: column;
    text-align: center;
  }

  .matches-grid {
    grid-template-columns: 1fr;
  }

  .match-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .badge {
    margin-left: 0;
  }

}

</style>