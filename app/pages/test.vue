<script setup>
const {
    loadStanding,
    loadStandings,
    editStanding,
    removeStanding,
    addStanding,
    standing,
    standings
} = useStandings()

const crear = async () => {

 await addStanding({
  group: "C",
  teamId: "ID_DEL_EQUIPO",
  played: 1,
  wins: 1,
  draws: 0,
  losses: 0,
  goalsFor: 2,
  goalsAgainst: 1,
  goalDifference: 1,
  points: 3
})
}

const listar = async () => {

    await loadStandings()

    console.log(standings.value)
    

}

const obtenerUno = async () => {

    await loadStanding("NYIr0AjiIet3ehm6pjwc")


    console.log("x:", standing.value)
}

const editar = async () => {

    await editStanding("NYIr0AjiIet3ehm6pjwc", {

        wins: 3
  

    })

}

const borrar = async () => {

    await removeStanding("NYIr0AjiIet3ehm6pjwc")

}
</script>

<template>

    <button @click="crear">
        Crear
    </button>

    <button @click="listar">
        Listar
    </button>

    <button @click="obtenerUno">
        Obtener
    </button>

    <button @click="editar">
        Actualizar
    </button>

    <button @click="borrar">
        Eliminar
    </button>

    <pre>
{{ standings }}
    </pre>

</template>