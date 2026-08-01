<template>

    <div class="matches-container">

        <h1 class="title">
            PARTIDOS MUNDIAL 2026
        </h1>

        <!-- Buscador reactivo -->
        <div class="search-container">

            <input v-model="busqueda" class="search-input" type="text" placeholder="🔍 Buscar estadio o ciudad...">

        </div>

        <!-- Filtros -->
        <div class="filters">

            <select v-model="filters.group">

                <option value="">Grupo</option>

                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>E</option>
                <option>F</option>
                <option>G</option>
                <option>H</option>

            </select>

            <select v-model="filters.stage">

                <option value="">Fase</option>

                <option>Grupos</option>
                <option>Dieciseisavos</option>
                <option>Octavos</option>
                <option>Cuartos</option>
                <option>Semifinal</option>
                <option>Tercer Lugar</option>
                <option>Final</option>

            </select>

            <select v-model="filters.status">

                <option value="">Estado</option>

                <option>Programado</option>
                <option>En Vivo</option>
                <option>Finalizado</option>

            </select>

            <input v-model="filters.date" type="date">

            <button class="btn-search" @click="applyFilters">
                Buscar
            </button>

            <button class="btn-clear" @click="clearFilters">
                Limpiar
            </button>

        </div>

        <!-- Loading -->
        <div v-if="loading" class="message">
            Cargando partidos...
        </div>

        <!-- Error -->
        <div v-else-if="error" class="message error">
            {{ error }}
        </div>

        <!-- Empty -->
        <div v-else-if="resultadosFiltrados.length === 0" class="message">
            No hay partidos para mostrar.
        </div>

        <!-- Cards -->
        <div v-else class="matches-grid">

            <div v-for="match in resultadosFiltrados" :key="match.id" class="match-card">

                <h3>
                    {{ match.homeTeam }} vs {{ match.awayTeam }}
                </h3>

                <p> {{ match.stage }} </p>

                <p>{{ match.city }} </p>

                <p> {{ match.stadium }} </p>

                <p>{{ match.kickoff }} </p>

                <p> Estado: <strong>{{ match.status }} </strong> </p>

            </div>

        </div>

    </div>

</template>

<script setup>

const {

    matches,
    loading,
    error,
    loadFilteredMatches
} = useMatches()

const filters = reactive({
    group: "",
    stage: "",
    status: "",
    date: ""
})

const {
    busqueda,
    resultadosFiltrados
} = useFiltro(
    matches, [ "city","stadium" ]
)

onMounted(async () => {
    await loadFilteredMatches()
})

async function applyFilters() {
    await loadFilteredMatches(filters)
}

async function clearFilters() {
    busqueda.value = ""
    filters.group = ""
    filters.stage = ""
    filters.status = ""
    filters.date = ""
    await loadFilteredMatches()
}

</script>

<style scoped>
.matches-container {

    max-width: 1200px;

    margin: auto;

    padding: 40px 20px;

}

.title {

    text-align: center;

    font-size: 2rem;

    margin-bottom: 30px;

}

.search-container {

    margin-bottom: 20px;

}

.search-input {

    width: 100%;

    padding: 14px;

    border: 1px solid #ddd;

    border-radius: 10px;

    font-size: 16px;

}

.search-input:focus {

    outline: none;

    border-color: #1976d2;

}

.filters {

    display: grid;

    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));

    gap: 15px;

    padding: 20px;

    margin-bottom: 30px;

    background: white;

    border-radius: 10px;

    box-shadow: 0 3px 10px rgba(0, 0, 0, .08);

}

.filters select,
.filters input {

    padding: 12px;

    border-radius: 8px;

    border: 1px solid #ccc;

}

.filters button {

    border: none;

    border-radius: 8px;

    cursor: pointer;

    color: white;

    font-weight: bold;

}

.btn-search {

    background: #1976d2;

}

.btn-search:hover {

    background: #1565c0;

}

.btn-clear {

    background: #757575;

}

.btn-clear:hover {

    background: #616161;

}

.matches-grid {

    display: grid;

    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

    gap: 20px;

}

.match-card {

    background: white;

    border-radius: 10px;

    padding: 20px;

    box-shadow: 0 3px 10px rgba(0, 0, 0, .08);

}

.match-card h3 {

    margin-bottom: 15px;

}

.match-card p {

    margin: 8px 0;

}

.message {

    text-align: center;

    padding: 40px;

}

.error {

    color: red;

}

@media(max-width:768px) {

    .filters {

        grid-template-columns: 1fr;

    }

}
</style>