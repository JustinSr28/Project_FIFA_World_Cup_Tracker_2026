<template>
    <ReloadButton  :loading="loading"  @reload="loadTopScorer"/>
    <div class="stats-container">

        <h1 class="title"> ESTADÍSTICAS DEL MUNDIAL 2026</h1>

        <div v-if="loading" class="message"> Cargando estadísticas...  </div>
       
        <div v-else-if="error" class="message error"> {{ error }} </div>
        
        <div v-else class="stats-grid">

            <div class="stat-card featured">
                <h3> Máximo goleador </h3>
                <p class="main-value"> {{ player?.name || 'Sin datos' }} </p>
                <span> {{ player?.goal || 0 }} goles </span>
            </div>

            <div class="stat-card">
                <h3>Selección con más goles </h3>
                <p class="main-value">{{ mostGoalsTeam?.team?.name || 'Sin datos' }}</p>
                <span> {{ mostGoalsTeam?.goalsFor || 0 }} goles </span>
            </div>

            <div class="stat-card">
                <h3>  Selección menos goleada</h3>
                <p class="main-value"> {{ leastConcededTeam?.team?.name || 'Sin datos' }}</p>
                <span>{{ leastConcededTeam?.goalsAgainst || 0 }} goles recibidos</span>
            </div>

            <div class="stat-card">
                <h3>Partidos disputados </h3>
                <p class="number">{{ playedMatches }}</p>
                <span>partidos</span>
            </div>

            <div class="stat-card">
                <h3>Promedio de goles</h3>
                <p class="number">{{ averageGoals }} </p>
                <span> goles por partido </span>
            </div>

            <div class="stat-card">
                <h3>Porcentaje de victorias</h3>
                <p class="number">{{ winPercentage }}%</p>
                <span>efectividad</span>
            </div>

        </div>
    </div>
</template>

<script setup>

const { player, loading: loadingPlayers, error: errorPlayers, loadTopScorer } = usePlayers()
const {standing,loadMostGoalsTeam,loadLeastGoalsTeam} = useStandings()
const {playedMatches,averageGoals,winPercentage,loading: loadingMatches,error: errorMatches,loadPlayedMatches,loadAverageGoals,loadWinPercentage} = useMatches()

const mostGoalsTeam = ref(null)
const leastConcededTeam = ref(null)

const loading = computed(() => loadingPlayers.value || loadingMatches.value )
const error = computed(() =>  errorPlayers.value || errorMatches.value )

onMounted(async () => {
    await loadTopScorer()
    await loadMostGoalsTeam()
    mostGoalsTeam.value = standing.value
    await loadLeastGoalsTeam()
    leastConcededTeam.value = standing.value
    await loadPlayedMatches()
    await loadAverageGoals()
    await loadWinPercentage()
})

</script>

<style scoped lang="scss">
.stats-container {
    max-width: 1150px;
    margin: auto;
    padding: 35px 20px;
}

.title {
    text-align: center;
    color: #111827;
    font-size: 2.1rem;
    font-weight: 800;
    margin-bottom: 35px;
    letter-spacing: .5px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.stat-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 25px 20px;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 150px;
    transition: .25s ease;
    position: relative;
    overflow: hidden;
}
.stat-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: #cbd5e1;
}
.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, .08);
}

.stat-card h3 {
    color: #6b7280;
    font-size: .85rem;
    font-weight: 700;
    text-transform: uppercase;
    margin: 0 0 15px;
    letter-spacing: .6px;
}

.main-value {
    color: #111827;
    font-size: 1.35rem;
    font-weight: 800;
    margin: 0 0 10px;
}

.number {
    color: #111827;
    font-size: 2.8rem;
    font-weight: 900;
    margin: 0 0 8px;
}

.stat-card span {
    color: #9ca3af;
    font-size: .9rem;
    font-weight: 600;
}

.featured::before {
    background: #111827;
}
.stat-card:nth-child(2)::before {
    background: #374151;
}
.stat-card:nth-child(3)::before {
    background: #6b7280;
}
.stat-card:nth-child(4)::before {
    background: #9ca3af;
}
.stat-card:nth-child(5)::before {
    background: #4b5563;
}
.stat-card:nth-child(6)::before {
    background: #1f2937;
}

.message {
    max-width: 420px;
    margin: 40px auto;
    padding: 22px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    text-align: center;
    color: #6b7280;
}
.error {
    color: #b91c1c;
    border-color: #fecaca;
}

</style>