<script setup>

const { playedMatches, pendingMatches,totalGoals,qualifiedTeams,loading: loadingMatches, error: errorMatches, loadPlayedMatches,
        loadPendingMatches, loadTotalGoals,loadQualifiedTeams,currentStage,loadCurrentStage} = useMatches()

const {loading: loadingUsers, error: errorUsers,loadNameUserbyId } = useUsers()

const { predictionsCount,loading: loadingPredictions,error: errorPredictions,loadPredictionsCountByUser,loadTopPredictionUser,topPredictionUser} = usePredictions()
const { user: authUser } = useAuth()

const tournamentStage = ref("")
const topUserName = ref("")

const loading = computed(() =>
  loadingMatches.value ||
  loadingUsers.value ||
  loadingPredictions.value
)

const error = computed(() =>
  errorMatches.value ||
  errorUsers.value ||
  errorPredictions.value
)

const loadTopUser = async () => {
  await loadTopPredictionUser()
  if (topPredictionUser.value) {
    topUserName.value =
      await loadNameUserbyId(
        topPredictionUser.value.userId
      )
  }
}

onMounted(async () => {

  await loadPlayedMatches()
  await loadPendingMatches()
  await loadTotalGoals()
  await loadTopUser()
  await loadPredictionsCountByUser(authUser.value.uid)
  await loadCurrentStage()
  await loadCurrentStage()
  tournamentStage.value = currentStage.value
  await loadQualifiedTeams(
    tournamentStage.value
  )
})

</script>

<template>
  <ReloadButton :loading="loading" @reload="loadPlayedMatches" />
  <h1 class="title"> FIFA WORLD CUP 2026 </h1>

  <p class="subtitle">Panel de control del torneo</p>

  <div v-if="loading" class="message">Cargando indicadores...</div>
  <div v-else-if="error" class="message error">{{ error }}</div>
  <div v-else class="dashboard">
    
    <section class="main-card">
      <div class="stats">

        <div class="stat-item">
          <span> Partidos jugados </span>
          <strong>{{ playedMatches }}</strong>
        </div>
       
        <div class="stat-item">
          <span>Partidos pendientes </span>
          <strong>{{ pendingMatches }}</strong>
        </div>

        <div class="stat-item">
          <span> Goles anotados</span>
          <strong>{{ totalGoals }}</strong>
        </div>

      </div>
    </section>
    
    <div class="cards-grid">

      <div class="card">
        <div class="icon">🏟 </div>
        <h3>Ronda actual</h3>
        <strong>{{ tournamentStage }}</strong>
      </div>

      <div class="card">
        <div class="icon">🏆</div>
        <h3>Selecciones clasificadas</h3>
        <strong>{{ qualifiedTeams }}</strong>
      </div>

      <div class="card">
        <div class="icon">🎯</div>
        <h3>Predicciones realizadas </h3>
        <strong>{{ predictionsCount }}</strong>
      </div>
    </div>

    <section class="user-card">
      <div class="user-icon">👤</div>
      <div>
        <h2>Usuario con mayor puntaje</h2>
        <p>{{ topUserName }}</p>
        <span>⭐ {{ topPredictionUser?.points || 0 }} puntos </span>
      </div>
    </section>
  </div>

</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: auto;
  padding: 35px 25px;
  font-family: 'Inter', sans-serif;
}

.title {
  text-align: center;
  color: #111827;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -.5px;
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 35px;
}

.message {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 20px;
  border-radius: 14px;
  text-align: center;
  color: #64748b;
}

.error {
  color: #dc2626;
  border-color: #fecaca;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.main-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, .05);
}

.main-card h2 {
  margin: 0 0 20px;
  color: #111827;
  font-size: 1.2rem;
  font-weight: 700;
}

.stats,
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.stat-item,
.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 22px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: .25s;
}

.stat-item::before,
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #17304e;
}

.stat-item:hover,
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(15, 23, 42, .08);
  border-color: #cbd5e1;
}

.icon {
  width: 55px;
  height: 55px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1f5f9;
  font-size: 1.6rem;
}

.stat-item span,
.card h3 {
  display: block;
  color: #64748b;
  font-size: .85rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.stat-item strong,
.card strong {
  display: block;
  color: #111827;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, .05);
}

.user-icon {
  width: 60px;
  height: 60px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.user-card h2 {
  margin: 0;
  color: #64748b;
  font-size: .75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.user-card p {
  margin: 6px 0;
  color: #111827;
  font-size: 1.35rem;
  font-weight: 800;
}

.user-card span {
  color: #2563eb;
  font-size: .95rem;
  font-weight: 600;
}


.reload-btn:hover {
  background: #1f2937;
}

</style>