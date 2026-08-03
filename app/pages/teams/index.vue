<template>
  <div class="teams-page">

    <h1 class="title"> SELECCIONES </h1>
    
    <div class="actions">

      <button @click="mostrarFormulario = !mostrarFormulario" class="btn-primary">
        {{ mostrarFormulario ? 'Cancelar' : '+ Nueva selección' }}
      </button>

    </div>
    
    <Transition name="fade">

      <div v-if="mostrarFormulario" class="formulario-seccion">
        <TeamsForm :team-inicial="teamEnEdicion" @guardar="guardarTeam" @cancelar="cancelarFormulario" />
      </div>

    </Transition>
    
    <div class="toolbar">
    
      <input v-model="busqueda" class="search-input" type="text" placeholder="🔍 Buscar selección...">
    
      <select v-model="group">
        <option value=""> Grupo </option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
        <option>E</option>
        <option>F</option>
        <option>G</option>
        <option>H</option>
      </select>
    
      <button @click="applyFilter" class="btn-search"> Buscar </button>
      <button @click="clearFilters" class="btn-clear"> Limpiar </button>
    
    </div>
    
    <!-- ESTADOS -->

    <p v-if="loading" class="message"> Cargando selecciones... </p>
    
    <p v-else-if="error" class="message error"> {{ error }} </p>
    
    <p v-else-if="resultadosFiltrados.length === 0" class="message"> No se encontraron selecciones. </p>
    
    <div v-else class="teams-grid">
      <div v-for="team in resultadosFiltrados" :key="team.id" class="team-item">
        <TeamsCard :team="team" @eliminar="confirmarEliminar(team.id)" @editar="iniciarEdicion(team)" @ver="verEquipo" @ver-jugadores="verJugadores" />
      </div>
    </div>
    
    <div class="teams-stats">
      <span> Total: {{ teams.length }} selecciones </span>
      <span> Mostradas: {{ resultadosFiltrados.length }} </span>
    </div>
  
  </div>
</template>

<script setup>
import { useTeams } from "~/composables/useTeams"

const router = useRouter()

const { teams, loading,error,loadTeams,addTeam,editTeam,removeTeam,loadTeamsByGroup } = useTeams()
const mostrarFormulario = ref(false)
const teamEnEdicion = ref(null)
const group = ref("")


const { busqueda,resultadosFiltrados } = useFiltro( teams, ["name"] )

const verJugadores = (id) => {
  router.push(`/teams/${id}/players`)
}

const verEquipo = (id) => {
  router.push(`/teams/${id}`)
}

const iniciarEdicion = (team) => {
  teamEnEdicion.value = team
  console.log("Equipo recibido:", team)
  mostrarFormulario.value = true
}

const cancelarFormulario = () => {
  teamEnEdicion.value = null
  mostrarFormulario.value = false
}

const guardarTeam = async (data) => {
  try {
    if (teamEnEdicion.value) {
      await editTeam(
        teamEnEdicion.value.id,
        data
      )
    } else {
      await addTeam(data)
    }
    cancelarFormulario()
  } catch (error) {
    console.log(error)
  }
}

const confirmarEliminar = async (id) => { await removeTeam(id) }

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

const refetch = () => {
  cargarPosts();
};

onMounted(async () => { await loadTeams() })
</script>

<style scoped lang="scss">
.teams-page {
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
  letter-spacing: .5px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;
}
.btn-primary {
  background: #12355b;
  color: white;
  border: none;
  padding: .75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
  &:hover {
    background: #0f2a4a;
    transform: translateY(-2px);
  }
}

.formulario-seccion {
  margin-bottom: 35px;
}
.fade-enter-active,
.fade-leave-active {
  transition: .3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.toolbar {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  margin-bottom: 30px;
  box-shadow:
    0 5px 15px rgba(15, 42, 74, .06);
}
.search-input {
  flex: 1;
  padding: .75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: .95rem;
  outline: none;
  &:focus {
    border-color: #12355b;
    box-shadow:
      0 0 0 3px rgba(18, 53, 91, .12);
  }
}
.toolbar select {
  padding: .75rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
  cursor: pointer;
}
.btn-search {
  background: #12355b;
  color: white;
  border: none;
  border-radius: 10px;
  padding: .75rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #0f2a4a;
  }
}
.btn-clear {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: .75rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #e2e8f0;
  }
}
.teams-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}
.team-item {
  transition: .25s;
  &:hover {
    transform: translateY(-4px);
  }
}
.message {
  text-align: center;
  padding: 40px;
  background: #fff;
  border-radius: 14px;
  color: #64748b;
  border: 1px solid #e2e8f0;
  margin-top: 20px;
}
.error {
  color: #dc2626;
  border-color: #fecaca;
  background: #fef2f2;
}
.teams-stats {
  margin-top: 35px;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
}
</style>