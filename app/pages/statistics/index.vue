<template>
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
    min-height: 100vh;
    background: #f1f5f9;
    max-width: 1200px;
    margin: auto;
    padding: 45px 25px;
}
.title {
    text-align: center;
    color: #0f2a4a;
    font-size: 2.2rem;
    font-weight: 900;
    margin-bottom: 50px;
}
.stats-grid {
    display: grid;
    grid-template-columns:
        repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
}
.stat-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 35px 25px;
    text-align: center;
    border: 1px solid #dbe4ee;
    box-shadow:
        0 8px 25px rgba(15, 42, 74, .08);
    transition: .25s ease;
    &:hover {
        transform: translateY(-5px);
        box-shadow:
            0 14px 35px rgba(15, 42, 74, .15);
    }
}
.stat-card h3 {
    color: #64748b;
    font-size: .85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
}
.main-value {
    color: #12355b;
    font-size: 1.6rem;
    font-weight: 900;
    margin: 15px 0;
}
.number {
    color: #0f2a4a;
    font-size: 3.5rem;
    font-weight: 900;
    margin: 15px 0;
}
.stat-card span {
    color: #64748b;
    font-weight: 700;
}
.featured {
    border-top: 5px solid #12355b;
}
.stat-card:nth-child(2) {
    border-top: 5px solid #1e3a5f;
}
.stat-card:nth-child(3) {
    border-top: 5px solid #475569;
}
.stat-card:nth-child(4) {
    border-top: 5px solid #64748b;
}
.stat-card:nth-child(5) {
    border-top: 5px solid #12355b;
}
.stat-card:nth-child(6) {
    border-top: 5px solid #334155;
}
.message {
    max-width: 450px;
    margin: 50px auto;
    padding: 30px;
    background: white;
    border-radius: 18px;
    text-align: center;
    border: 1px solid #e2e8f0;
}
.error {
    color: #dc2626;
}
</style>