<template>
    <div class="matches-container">

        <h1 class="title"> PARTIDOS MUNDIAL 2026 </h1>

        <div class="search-container">
            <input v-model="busqueda" class="search-input" type="text" placeholder="🔍 Buscar estadio o ciudad...">
        </div>

        <div class="filters">

            <select v-model="filters.group">
                <option value=""> Grupo </option>
                <option v-for="group in groups" :key="group" :value="group"> Grupo {{ group }} </option>
            </select>

            <select v-model="filters.stage">
                <option value="">Fase</option>
                <option v-for="stage in stages" :key="stage" :value="stage"> {{ stage }} </option>
            </select>

            <select v-model="filters.status">
                <option value=""> Estado </option>
                <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
            </select>

            <input v-model="filters.date" type="date">

            <button class="btn-search" @click="applyFilters"> Buscar </button>
            <button class="btn-clear" @click="clearFilters"> Limpiar</button>
        </div>

        <div v-if="loading" class="message"> Cargando partidos... </div>
        <div v-else-if="error" class="message error"> {{ error }} </div>
        <div v-else-if="resultadosFiltrados.length === 0" class="message"> No hay partidos para mostrar. </div>
       
        <div v-else class="matches-grid">
            <div v-for="match in resultadosFiltrados" :key="match.id" class="match-card">
                
                <div class="match-header">
                    <span class="stage"> {{ match.stage }} </span>
                    <span class="status"> {{ match.status }} </span>
                </div>

                <div class="teams">

                    <div class="team">
                        <img v-if="getTeam(match.homeTeam)" :src="getTeam(match.homeTeam).flag"
                            :alt="getTeam(match.homeTeam).name" class="team-flag">
                        <strong> {{ getTeam(match.homeTeam)?.name || match.homeTeam }} </strong>
                    </div>

                    <span class="vs"> VS </span>

                    <div class="team">
                        <img v-if="getTeam(match.awayTeam)" :src="getTeam(match.awayTeam).flag"
                            :alt="getTeam(match.awayTeam).name" class="team-flag">
                        <strong> {{ getTeam(match.awayTeam)?.name || match.awayTeam }} </strong>
                    </div>

                </div>

                <div class="match-details">

                    <div class="detail-item">
                        <span class="icon">📍</span>
                        <div>
                            <small>Ciudad</small>
                            <strong>{{ match.city }}</strong>
                        </div>
                    </div>

                    <div class="detail-item">
                        <span class="icon">🏟️</span>
                        <div>
                            <small>Estadio</small>
                            <strong>{{ match.stadium }}</strong>
                        </div>
                    </div>

                    <div class="detail-item">
                        <span class="icon">📅</span>
                        <div>
                            <small>Fecha</small>
                            <strong>{{ match.date }}</strong>
                        </div>
                    </div>

                    <div class="detail-item">
                        <span class="icon">🏆</span>
                        <div>
                            <small>Grupo</small>
                            <strong>Grupo {{ match.group }}</strong>
                        </div>
                    </div>
                </div>
                <button class="favorite-btn">⭐</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const { matches, loading, error, loadFilteredMatches } = useMatches()
const { teams, team, loadTeams, loadTeam } = useTeams()

const getTeam = (id) => {
    const result = teams.value.find(
        team => team.id === id
    )
    return result
}

const stages = ["Fase de grupos", "Dieciseisavos", "Octavos", "Cuartos", "Semifinal", "Tercer Lugar", "Final"]
const statuses = ["Programado", "En Vivo", "Finalizado"]
const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

const filters = reactive({ group: "", stage: "", status: "", date: "" })
const { busqueda, resultadosFiltrados } = useFiltro(matches, ["city", "stadium"])

onMounted(async () => {
    await loadTeams()
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
.filters select:focus,
.filters input:focus {
    border-color: #12355b;
}
/* BOTONES FILTRO */
.filters button {
    border: none;
    border-radius: 10px;
    padding: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: .2s;
}
.btn-search {
    background: #12355b;
    color: white;
    &:hover {
        background: #0f2a4a;
        transform: translateY(-2px);
    }
}
.btn-clear {
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #cbd5e1 !important;
    &:hover {
        background: #e2e8f0;
    }
}
.matches-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 25px;
}
.match-card {
    width: 320px;
    background: white;
    border-radius: 18px;
    padding: 25px;
    border: 1px solid #e2e8f0;
    box-shadow:
        0 8px 25px rgba(15, 42, 74, .08);
    transition: .25s ease;
    &:hover {
        transform: translateY(-5px);
        box-shadow:
            0 14px 35px rgba(15, 42, 74, .15);
    }
}
.match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    font-weight: 700;
}
.teams {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
}
.team {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #12355b;
    font-weight: 800;
}
.team-flag {
    width: 75px;
    height: 50px;
    object-fit: contain;
    border-radius: 8px;
    margin-bottom: 10px;
}
.vs {
    color: #64748b;
    font-weight: 900;
    font-size: 1.2rem;
}
.match-details {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.detail-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}
.icon {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef4fb;
    border-radius: 50%;
    font-size: 18px;
}
.detail-item div {
    display: flex;
    flex-direction: column;
}
.detail-item small {
    color: #64748b;
    font-size: .8rem;
    font-weight: 600;
}
.detail-item strong {
    color: #12355b;
    font-size: .95rem;
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
.favorite-btn {
    width:100%;
    margin-top:20px;
    padding:12px;
    border-radius:12px;
    border:1px solid #cbd5e1;
    background:#f8fafc;
    color:#12355b;
    font-weight:700;
    cursor:pointer;
    transition:.25s ease;
    &:hover {
        background:#12355b;
        color:white;
        transform:translateY(-2px);
    }
    &:active {
        transform:scale(.98);
    }
}
</style>