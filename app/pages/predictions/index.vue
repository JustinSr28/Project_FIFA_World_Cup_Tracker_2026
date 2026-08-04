<template>
  <ReloadButton  :loading="loading"  @reload="loadAvailableMatchesForPredictions"/>
    <div class="matches-container">

        <h1 class="title"> PREDICCIONES MUNDIAL 2026 </h1>
        
        
        <div v-if="loading" class="message"> Cargando partidos... </div>
        <div v-else-if="error" class="message error"> {{ error }} </div>
        <div v-else-if="resultadosFiltrados.length === 0" class="message"> No hay partidos para mostrar.</div>
        
        <div v-else class="matches-grid">
            <PredictionsCard v-for="match in resultadosFiltrados" :key="match.id" :match="match"
                :home-team="getTeam(match.homeTeam)" :away-team="getTeam(match.awayTeam)"
                :prediction="obtenerPrediccion(match.id)" @save="guardarPrediccion" @delete="eliminarPrediccion"  :editable="true" />
        </div>
    </div>
</template>

<script setup>

const {matches,loading,error,loadAvailableMatchesForPredictions} = useMatches()
const {teams,loadTeams } = useTeams()
const {predictions,loadPredictionsByUser,addPrediction,editPrediction,removesPrediction } = usePredictions()
const { user: userAuth } = useAuth()
const getTeam = (id) => {
    return teams.value.find(
        team => team.id === id
    )
}

const obtenerPrediccion = (matchId) => {
    if (!userAuth.value) {
        return null
    }

    return predictions.value.find(
        p =>
            p.matchId === matchId &&
            p.userId === userAuth.value.uid
    )

}

const guardarPrediccion = async (
    matchId,
    predictionId,
    data
) => {
    try {
        if (predictionId) {
            await editPrediction(
                predictionId,
                data
            )
        } else {
            await addPrediction({
                userId: userAuth.value.uid,
                matchId,
                ...data,
                points: 0,
                evaluated: false
            })
        }
        await loadPredictionsByUser(
            userAuth.value.uid
        )
    } catch (error) {
        console.error(error)
    }
}

const eliminarPrediccion = async (predictionId) => {
    if (!predictionId)
        return
    try {
        await removesPrediction(predictionId)
        await loadPredictionsByUser(userAuth.value.uid)
    } catch (error) {
        console.error("Error eliminando predicción:", error)
    }
}
const { busqueda, resultadosFiltrados } =useFiltro(matches,["city","stadium"])

onMounted(async () => {

    await loadTeams()

    await loadAvailableMatchesForPredictions()

    if (userAuth.value) {
        await loadPredictionsByUser(
            userAuth.value.uid
        )
    }

})
</script>

<style scoped lang="scss">
.matches-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 25px;
}

.title {
    text-align: center;
    color: #12355b;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 30px;
}

.search-container {
    margin-bottom: 20px;
}

.search-input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    font-size: 1rem;
    outline: none;

    &:focus {
        border-color: #12355b;
        box-shadow:
            0 0 0 3px rgba(18, 53, 91, .12);
    }
}

.filters {
    display: grid;
    grid-template-columns:
        repeat(auto-fit, minmax(160px, 1fr));
    gap: 15px;
    padding: 20px;
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    margin-bottom: 35px;
    box-shadow:
        0 5px 15px rgba(15, 42, 74, .06);
}

.filters select,
.filters input {
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    background: white;
    color: #334155;
    outline: none;
}

.filters button {
    border: none;
    border-radius: 10px;
    padding: 12px;
    font-weight: 700;
    cursor: pointer;
}

.btn-search {
    background: #12355b;
    color: white;

    &:hover {
        background: #0f2a4a;
    }
}

.btn-clear {
    background: #f1f5f9;
    color: #334155;
}

.matches-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 25px;
}

.stage {
    background: #eef4fb;
    color: #12355b;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: .8rem;
    font-weight: 700;
}

.status {
    background: #12355b;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: .8rem;
    font-weight: 700;
}

.message {
    width: 100%;
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    color: #64748b;
}

.error {
    color: #dc2626;
    background: #fef2f2;
    border-color: #fecaca;
}
</style>