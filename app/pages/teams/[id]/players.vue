<template>
  
   <ReloadButton  :loading="loading"  @reload="loadPlayersByTeam(route.params.id)"/>

  <div class="players-page">

    <NuxtLink to="/teams" class="btn-back"> ← Volver a selecciones </NuxtLink>

    <h1 class="title"> Jugadores de la selección {{ team?.name }} </h1>


    <div v-if="loading" class="message"> Cargando jugadores... </div>

    <div v-else-if="error" class="message error"> {{ error }} </div>

    <div v-else-if="players.length === 0" class="message"> Esta selección no tiene jugadores registrados. </div>

    <div v-else class="players-grid">

      <PlayersCard v-for="player in players" :key="player.id" :player="player" :show-actions="false" />

    </div>

  </div>

</template>

<script setup>

const route = useRoute()

const { players, loading, error, loadPlayersByTeam } = usePlayers()

const { team, loadTeam } = useTeams()

onMounted(async () => {
  await loadPlayersByTeam(route.params.id)
  await loadTeam(route.params.id)
})

</script>

<style scoped lang="scss">
.players-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 25px;
}

.title {
  text-align: center;
  color: #12355b;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 50px;
}

.players-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.players-grid>* {
  width: 320px;
  flex: 0 0 320px;
}

.message {
  max-width: 500px;
  margin: 40px auto;
  padding: 25px;
  text-align: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  color: #64748b;
}

.error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 25px;
  padding: 10px 18px;
  background: #f8fafc;
  color: #12355b;
  text-decoration: none;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  transition: .2s;
}

.btn-back:hover {
  background: #12355b;
  color: white;
  border-color: #12355b;
  transform: translateY(-2px);
}

</style>