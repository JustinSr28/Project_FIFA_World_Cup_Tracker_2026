<template>

    <div class="stats-container">

        <h1 class="title">
            ESTADÍSTICAS DEL MUNDIAL
        </h1>

        <div v-if="loading" class="message">
            Cargando estadísticas...
        </div>

        <div v-else-if="error" class="message error">
            {{ error }}
        </div>

        <div v-else class="stats-grid">

            <div class="stat-card">

                <h3>Máximo goleador</h3>

                <p class="value">
                    {{ player?.name }}
                </p>

                <span>{{ player?.goal }} goles</span>

            </div>

            <div class="stat-card">

                <h3>Selección con más goles</h3>

                <p class="value">
                    {{ mostGoalsTeam?.teamId }}
                </p>

                <span>{{ mostGoalsTeam?.goalsFor }} goles</span>

            </div>

            <div class="stat-card">

                <h3>Selección menos goleada</h3>

                <p class="value">
                    {{ leastConcededTeam?.teamId }}
                </p>

                <span>{{ leastConcededTeam?.goalsAgainst }} recibidos</span>

            </div>

            <div class="stat-card">

                <h3>Partidos disputados</h3>

                <p class="value">
                    {{ playedMatches }}
                </p>

            </div>

            <div class="stat-card">

                <h3>Promedio de goles</h3>

                <p class="value">
                    {{ averageGoals }}
                </p>

            </div>

            <div class="stat-card">

                <h3>Porcentaje de victorias</h3>

                <p class="value">
                    {{ winPercentage }}%
                </p>

            </div>

        </div>

    </div>

</template>
<script setup>

const {

    player,

    loading: loadingPlayers,

    error: errorPlayers,

    loadTopScorer

} = usePlayers()

const {

    standing,
    loadMostGoalsTeam,
    loadLeastGoalsTeam

} = useStandings()

const {

    playedMatches,

    averageGoals,

    winPercentage,

    loading: loadingMatches,

    error: errorMatches,

    loadPlayedMatches,

    loadAverageGoals,

    loadWinPercentage

} = useMatches()

const mostGoalsTeam = ref(null)
const leastConcededTeam = ref(null)

const loading = computed(() =>
    loadingPlayers.value || loadingMatches.value
)

const error = computed(() =>
    errorPlayers.value || errorMatches.value
)

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

<style scoped>
.stats-container {

    max-width: 1200px;

    margin: auto;

    padding: 40px 20px;

}

.title {

    text-align: center;

    margin-bottom: 40px;

    font-size: 2rem;

    font-weight: bold;

}

.stats-grid {

    display: grid;

    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

    gap: 25px;

}

.stat-card {

    background: white;

    border-radius: 12px;

    padding: 25px;

    text-align: center;

    box-shadow: 0 3px 12px rgba(0, 0, 0, .08);

}

.stat-card h3 {

    margin-bottom: 20px;

    color: #1565c0;

}

.value {

    font-size: 2rem;

    font-weight: bold;

    margin-bottom: 10px;

}

.stat-card span {

    color: #666;

}

.message {

    text-align: center;

    margin-top: 40px;

    font-size: 18px;

}

.error {

    color: red;

}
</style>