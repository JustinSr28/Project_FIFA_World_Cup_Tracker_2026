<template>

  <div class="teams-container">

    <h1 class="title">
      SELECCIONES
    </h1>

    <div class="search-container">

      <input
        v-model="busqueda"
        class="search-input"
        type="text"
        placeholder="🔍 Buscar selección..."
      >

    </div>

    <div class="filters">

      <select v-model="group">

        <option value="">
          Grupo
        </option>

        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
        <option>E</option>
        <option>F</option>
        <option>G</option>
        <option>H</option>

      </select>

      <button
        class="btn-search"
        @click="applyFilter"
      >
        Buscar
      </button>

      <button
        class="btn-clear"
        @click="clearFilters"
      >
        Limpiar
      </button>

    </div>

    <div
      v-if="loading"
      class="message"
    >
      Cargando selecciones...
    </div>

    <div
      v-else-if="error"
      class="message error"
    >
      {{ error }}
    </div>

    <div
      v-else-if="resultadosFiltrados.length === 0"
      class="message"
    >
      No se encontraron selecciones.
    </div>

    <div
      v-else
      class="teams-grid"
    >

     <div
  v-for="team in resultadosFiltrados"
  :key="team.id"
  class="team-card"
>

  <img
    :src="team.flag"
    :alt="team.name"
    class="flag"
  >

  <h3>
    {{ team.name }}
  </h3>

  <p>
    <strong>Grupo:</strong>
    {{ team.group }}
  </p>

  <p>
    <strong>Entrenador:</strong>
    {{ team.coach }}
  </p>

  <p>
    <strong>Confederación:</strong>
    {{ team.confederation }}
  </p>

  <p>
    <strong>Ranking FIFA:</strong>
    {{ team.fifaRanking }}
  </p>

</div>

    </div>

  </div>

</template>

<script setup>

const {
  teams,
  loading,
  error,
  loadTeams,
  loadTeamsByGroup

} = useTeams()

const group = ref("")

const {

  busqueda,

  resultadosFiltrados

} = useFiltro(

  teams,

  ["name"]

)

onMounted(async () => {

  await loadTeams()
    console.log("Teams:", teams.value)

})

async function applyFilter() {

  if (!group.value) {

    await loadTeams()

    return

  }

  await loadTeamsByGroup(group.value)

}

async function clearFilters() {

  busqueda.value = ""

  group.value = ""

  await loadTeams()

}

</script>

<style scoped>

.teams-container{

    max-width:1100px;

    margin:auto;

    padding:40px 20px;

}

.title{

    text-align:center;

    font-size:2rem;

    font-weight:bold;

    margin-bottom:35px;

}

.search-container{

    margin-bottom:20px;

}

.search-input{

    width:100%;

    padding:14px 18px;

    border:1px solid #ddd;

    border-radius:10px;

    font-size:16px;

}

.search-input:focus{

    outline:none;

    border-color:#1976d2;

}

.filters{

    display:grid;

    grid-template-columns:1fr auto auto;

    gap:15px;

    background:white;

    padding:20px;

    border-radius:10px;

    box-shadow:0 3px 10px rgba(0,0,0,.08);

    margin-bottom:30px;

}

.filters select{

    padding:12px;

    border:1px solid #ccc;

    border-radius:8px;

    font-size:15px;

}

.filters button{

    padding:12px 20px;

    border:none;

    border-radius:8px;

    cursor:pointer;

    color:white;

    font-weight:bold;

}

.btn-search{

    background:#1976d2;

}

.btn-search:hover{

    background:#1565c0;

}

.btn-clear{

    background:#757575;

}

.btn-clear:hover{

    background:#616161;

}

.teams-grid{

    display:grid;

    grid-template-columns:repeat(auto-fill,minmax(250px,1fr));

    gap:20px;

}

.message{

    text-align:center;

    padding:40px;

}

.error{

    color:#d32f2f;

}

@media(max-width:768px){

    .filters{

        grid-template-columns:1fr;

    }

}

</style>