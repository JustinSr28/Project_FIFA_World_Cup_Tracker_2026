<template>

  <div v-if="route.path === `/teams/${route.params.id}`">

    <div v-if="loading" class="message"> Cargando... </div>

    <div v-else-if="!team" class="message"> Selección no encontrada. </div>

    <div v-else class="team-detail">
      <div class="contenido-detalle">
        <div class="header">

          <img :src="team.flag" :alt="team.name" class="flag">

          <h1> {{ team.name }} </h1>

        </div>

        <div class="detalle">
          <div class="info">

            <span>Grupo</span>
            <strong>{{ team.group }}</strong>

          </div>

          <div class="info">

            <span>Confederación</span>
            <strong>{{ team.confederation }}</strong>

          </div>

          <div class="info">

            <span>Entrenador</span>
            <strong>{{ team.coach }}</strong>

          </div>

          <div class="info">

            <span>Ranking FIFA</span>
            <strong>#{{ team.fifaRanking }}</strong>

          </div>

        </div>

        <NuxtLink to="/teams" class="btn-back"> ← Volver </NuxtLink>

      </div>
    </div>
  </div>

  <NuxtPage />

</template>

<script setup>

const route = useRoute()

const { team, loading, error, loadTeam } = useTeams()

onMounted(async () => {
  await loadTeam(route.params.id)
})

</script>

<style scoped lang="scss">

.team-detail {
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.contenido-detalle {
  width: 100%;
  max-width: 450px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(15, 42, 74, .08);
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.flag {
  width: 110px;
  height: 70px;
  object-fit: contain;
  margin-bottom: 12px;
}

.header h1 {
  color: #12355b;
  font-size: 1.8rem;
  margin: 0;
}

.detalle {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.info span {
  color: #64748b;
  font-weight: 600;
}

.info strong {
  color: #12355b;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 25px;
  padding: 10px 18px;
  background: #12355b;
  color: white;
  text-decoration: none;
  font-weight: 700;
  border-radius: 10px;
  transition: all .2s ease;
  box-shadow: 0 4px 12px rgba(18, 53, 91, .18);
}

.btn-back:hover {
  background: #0f2a4a;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(18, 53, 91, .25);
}

.btn-back:active {
  transform: scale(.98);
}

.message {
  width: 100%;
  max-width: 450px;
  margin: auto;
  text-align: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 30px;
}

</style>