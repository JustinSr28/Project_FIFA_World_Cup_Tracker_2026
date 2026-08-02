<template>

  <div class="dashboard-container">

    <h1 class="title">
      DASHBOARD MUNDIAL 2026
    </h1>

    <div
      v-if="loading"
      class="message"
    >
      Cargando indicadores...
    </div>

    <div
      v-else-if="error"
      class="message error"
    >
      {{ error }}
    </div>

    <div
      v-else
      class="dashboard-grid"
    >

      <div class="card">

        <h3>🏟 Partidos jugados</h3>

        <p class="value">
          {{ playedMatches }}
        </p>

      </div>

      <div class="card">

        <h3>⏳ Partidos pendientes</h3>

        <p class="value">
          {{ pendingMatches }}
        </p>

      </div>

      <div class="card">

        <h3>⚽ Goles anotados</h3>

        <p class="value">
          {{ totalGoals }}
        </p>

      </div>

      <div class="card">

        <h3>🏆 Selecciones clasificadas</h3>

        <p class="value">
          {{ qualifiedTeams }}
        </p>

      </div>

      <div class="card">

        <h3>👤 Usuario con mayor puntaje</h3>

        <p class="value">
          {{ user?.name }}
        </p>

        <span>
          {{ user?.points }} puntos
        </span>

      </div>

      <div class="card">

        <h3>🎯 Predicciones realizadas</h3>

        <p class="value">
          {{ predictionsCount }}
        </p>

      </div>

    </div>

  </div>

</template>

<script setup>

const {

  playedMatches,

  pendingMatches,

  totalGoals,

  qualifiedTeams,

  loading: loadingMatches,

  error: errorMatches,

  loadPlayedMatches,

  loadPendingMatches,

  loadTotalGoals,

  loadQualifiedTeams

} = useMatches()

const {

  user,

  loading: loadingUsers,

  error: errorUsers,

  loadTopUser

} = useUsers()

const {

  predictionsCount,

  loading: loadingPredictions,

  error: errorPredictions,

  loadPredictionsCountByUser

} = usePredictions()

const { user: authUser } = useAuth()

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

onMounted(async () => {

  await loadPlayedMatches()

  await loadPendingMatches()

  await loadTotalGoals()

  await loadQualifiedTeams("Dieciseisavos")

  await loadTopUser()
console.log("Usuario autenticado:", authUser.value)
console.log("UID del usuario:", authUser.value.uid)

await loadPredictionsCountByUser(authUser.value.uid)


})

</script>
<style scoped>

.dashboard-container{

  max-width:1100px;

  margin:auto;

  padding:40px 20px;

}

.title{

  text-align:center;

  font-size:2rem;

  font-weight:bold;

  margin-bottom:35px;

  color:#222;

}

.dashboard-grid{

  display:grid;

  grid-template-columns:
  repeat(auto-fit,minmax(250px,1fr));

  gap:20px;

}

.card{

  background:white;

  border-radius:12px;

  padding:25px;

  text-align:center;

  box-shadow:0 4px 12px rgba(0,0,0,.08);

  transition:.2s;

}

.card:hover{

  transform:translateY(-3px);

}

.card h3{

  margin-bottom:15px;

  color:#1565c0;

}

.value{

  font-size:2rem;

  font-weight:bold;

  margin-bottom:8px;

}

.card span{

  color:#666;

}

.message{

  text-align:center;

  font-size:18px;

  padding:40px;

}

.error{

  color:red;

}

</style>