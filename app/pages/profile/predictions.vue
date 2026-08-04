<template>
  <ReloadButton  :loading="loading"  @reload="loadPredictionsByUser"/>
    <div class="matches-container">

        <h1 class="title"> MIS PREDICCIONES MUNDIAL 2026 </h1>
        
        
        <div v-if="loading" class="message"> Cargando partidos... </div>
        <div v-else-if="error" class="message error"> {{ error }} </div>
        <div v-else-if="prediccionesEvaluadas.length === 0" class="message"> No hay predicciones para mostrar.</div>
        
        <div v-else class="matches-grid">
            
           <PredictionsCard
        v-for="item in prediccionesEvaluadas"
        :key="item.prediction.id"
        :match="item.match"
        :home-team="item.homeTeam"
        :away-team="item.awayTeam"
        :prediction="item.prediction"
        :editable="false"
    />
        </div>
    </div>
</template>
<script setup>
const { loading, error, loadMatch} = useMatches()

const {loadTeam } = useTeams()

const { predictions, loadPredictionsByUser } = usePredictions()

const { user: userAuth } = useAuth()
const prediccionesEvaluadas = ref([])

watch(
    predictions,
    async (nuevasPredicciones) => {

        if (!nuevasPredicciones.length) {
            return
        }

        const resultado = []

        for (const prediction of nuevasPredicciones) {

            const match = await loadMatch(prediction.matchId)
            if (!match) {
                console.log("No se encontró el partido")
                continue
            }

            const homeTeam = await loadTeam(match.homeTeam)

            const awayTeam = await loadTeam(match.awayTeam)

            resultado.push({
                prediction,
                match,
                homeTeam,
                awayTeam
            })

            
        }
        prediccionesEvaluadas.value = resultado

    },
    {
        immediate: true
    }
)
watch(
    userAuth,
    async (user) => {
        if (!user) return

        console.log("Usuario listo:", user.uid)

        await loadPredictionsByUser(user.uid)
    },
    { immediate: true }
)
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