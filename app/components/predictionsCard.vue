<template>
    <div class="match-card">

        <div class="match-header">
            <span class="stage">{{ match.stage }}</span>
            <span class="status">{{ match.status }}</span>
        </div>

        <div class="teams">

            <div class="team">
                <img v-if="homeTeam" :src="homeTeam.flag" :alt="homeTeam.name" class="team-flag">
                <strong>{{ homeTeam?.name }}</strong>
                <input v-if="mostrarFormulario" class="score-input" type="number" min="0" v-model.number="form.homePrediction" @input="calcularGanador">
            </div>

            <div class="vs-container">
                <span class="vs"> VS </span>
            </div>

            <div class="team">
                <img v-if="awayTeam" :src="awayTeam.flag" :alt="awayTeam.name" class="team-flag">
                <strong>{{ awayTeam?.name }}</strong>
                <input v-if="mostrarFormulario" class="score-input" type="number" min="0" v-model.number="form.awayPrediction" @input="calcularGanador">
            </div>
        </div>

        <div class="match-date"> 📅 {{ match.date }} </div>

        <button v-if="!prediction && !mostrarFormulario" class="prediction-btn" @click="abrirFormulario" > + Hacer predicción </button>

        <div v-if="mostrarFormulario" class="prediction-panel">
            <p class="winner">
                Ganador:
                <strong>
                    {{
                        form.predictedWinner === "draw"
                            ? "Empate"
                            :
                            getWinnerName()
                    }}
                </strong>
            </p>

            <div class="prediction-actions">
                <button class="save-btn" @click="guardar"> Guardar </button>
                <button class="cancel-btn" @click="cancelar">Cancelar </button>
            </div>

        </div>

        <div v-if="prediction && !mostrarFormulario" class="prediction-summary">
            <h4>Tu predicción</h4>
            <p> Marcador: {{ prediction.homePrediction }}-{{ prediction.awayPrediction }} </p>
            <p>
                Ganador:
                {{
                    prediction.predictedWinner === "draw"
                        ? "Empate"
                        :
                        getTeamName(prediction.predictedWinner)
                }}
            </p>

            <div class="prediction-actions">
               
                <button  class="edit-btn" @click="abrirFormulario" >Editar</button>
                <button class="delete-btn" @click="eliminar"> Eliminar </button>
            </div>
        </div>
    </div>

</template>

<script setup>
const props = defineProps({
    match: {
        type: Object,
        required: true
    },
    homeTeam: {
        type: Object,
        default: null
    },
    awayTeam: {
        type: Object,
        default: null
    },
    prediction: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(["save", "edit", "delete"])

const mostrarFormulario = ref(false)
const form = reactive({ homePrediction: 0, awayPrediction: 0, predictedWinner: "" })

const abrirFormulario = () => {

    if(props.prediction){
        form.homePrediction = props.prediction.homePrediction
        form.awayPrediction = props.prediction.awayPrediction
        form.predictedWinner = props.prediction.predictedWinner
    }
    mostrarFormulario.value = true
}

const cancelar = () => {
    mostrarFormulario.value = false
}

const calcularGanador = () => {

    if (form.homePrediction == form.awayPrediction) { form.predictedWinner = "draw" }
    else if (form.homePrediction > form.awayPrediction) { form.predictedWinner = props.match.homeTeam }
    else { form.predictedWinner = props.match.awayTeam }
}
const guardar = () => {
    emit(
        "save",
        props.match.id,
        props.prediction?.id,
        {
            ...form
        }
    )
    mostrarFormulario.value = false
}

const eliminar = () => {
    emit(
        "delete",
       props.prediction.id
    )
}

const getWinnerName = () => {
    if (form.predictedWinner === "draw")  return "Empate"
    return getTeamName(form.predictedWinner)
}

const getTeamName = (id) => {
    if (id === props.match.homeTeam) return props.homeTeam?.name
    if (id === props.match.awayTeam) return props.awayTeam?.name
    return ""
}

</script>

<style scoped lang="scss">
.match-card {
    width: 320px;
    background: white;
    border-radius: 18px;
    padding: 25px;
    border: 1px solid #e2e8f0;
    box-shadow:
        0 8px 25px rgba(15, 42, 74, .08);
}

.match-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
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
}

.teams {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.team {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #12355b;
}

.team-flag {
    width: 70px;
    height: 45px;
    object-fit: contain;
    margin-bottom: 10px;
}

.vs {
    font-weight: 900;
    color: #64748b;
}

.score-input {
    width: 60px;
    height: 40px;
    margin-top: 15px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 800;
    color: #12355b;
    border: 2px solid #cbd5e1;
    border-radius: 10px;
    outline: none;

    &:focus {
        border-color: #12355b;
        box-shadow:
            0 0 0 3px rgba(18, 53, 91, .12);
    }
}

.match-date {
    text-align: center;
    margin: 20px 0;
    color: #64748b;
}

.prediction-btn,
.save-btn,
.cancel-btn,
.edit-btn,
.delete-btn {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 700;
}

.prediction-btn,
.save-btn {
    background: #12355b;
    color: white;
}

.cancel-btn {
    background: #e2e8f0;
    color: #334155;
}

.edit-btn {
    background: #eef4fb;
    color: #12355b;
}

.delete-btn {
    background: #fee2e2;
    color: #991b1b;
}

.prediction-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.prediction-summary {
    margin-top: 20px;
    padding: 15px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.prediction-summary h4 {
    color: #12355b;
}

.winner {
    text-align: center;
    color: #334155;
}
</style>