import {
  getStandings,
  createStanding,
  getStandingById,
  getStandingsByGroup,
  getStandingByTeam,
  deleteStanding,
  updateStanding
} from "~/services/standingsService"

import { getTeamsByGroup } from "~/services/teamsService"
import { getMatchesByGroup } from "~/services/matchesService"

export const useStandings = () => {

  const standings = ref([])
  const standing = ref(null)

  const loading = ref(false)
  const error = ref("")

  const loadStandings = async () => {

    try {

      loading.value = true
      error.value = ""

      standings.value = await getStandings()

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadStanding = async (id) => {

    try {

      loading.value = true
      error.value = ""

      standing.value = await getStandingById(id)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const addStanding = async (data) => {

    await createStanding(data)

    await loadStandings()

  }

  const editStanding = async (id, data) => {
        try {
    
          await updateStanding(id, data)
    
          await loadStandings()
    
        } catch(err) {
          error.value = err.message
        }
      }
    
      const removeStanding= async (id) => {
        try {
    
          await deleteStanding(id)
    
          await loadStandings()
    
        } catch(err) {
          error.value = err.message
        }
      }
  

  const loadStandingsByGroup = async (group) => {

    try {

      loading.value = true
      error.value = ""

      standings.value = await getStandingsByGroup(group)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadStandingByTeam = async (teamId) => {

    try {

      loading.value = true
      error.value = ""

      standings.value = await getStandingByTeam(teamId)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

 function calculateGroupStandings(teams, finishedMatches) {
  const standingsMap = {}

  teams.forEach(team => {
    standingsMap[team.id] = {
      teamId: team.id,
      group: team.group,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    }
  })

  // Paso 2: recorrer cada partido finalizado y actualizar a los DOS equipos
  finishedMatches.forEach(match => {

    const home = standingsMap[match.homeTeam]
    const away = standingsMap[match.awayTeam]

    // Si por algún motivo el equipo no está en el mapa (no debería pasar,
    // pero por seguridad), lo saltamos en vez de que truene el código.
    if (!home || !away) return

    // Ambos jugaron un partido más
    home.played++
    away.played++

    // Ambos suman los goles correspondientes
    home.goalsFor += match.homeScore
    home.goalsAgainst += match.awayScore

    away.goalsFor += match.awayScore
    away.goalsAgainst += match.homeScore

    // Decidir victoria / empate / derrota comparando el marcador
    if (match.homeScore > match.awayScore) {
      home.wins++
      home.points += 3
      away.losses++
    } else if (match.homeScore < match.awayScore) {
      away.wins++
      away.points += 3
      home.losses++
    } else {
      home.draws++
      away.draws++
      home.points += 1
      away.points += 1
    }
  })

  // Paso 3: calcular goalDifference ahora que ya tenemos los totales finales
  Object.values(standingsMap).forEach(standing => {
    standing.goalDifference = standing.goalsFor - standing.goalsAgainst
  })

  // Paso 4: convertir el objeto a array (más fácil de recorrer después
  // para guardar cada uno con updateStanding, y también para mostrarlo
  // ordenado en la tabla)
  return Object.values(standingsMap)
  }

  const recalculateGroupStandings = async (group) => {

      // 1. Traer los 4 equipos del grupo
      const teams = await getTeamsByGroup(group)

      // 2. Traer los partidos del grupo, y quedarnos solo con los finalizados
      const allMatches = await getMatchesByGroup(group)
      const finishedMatches = allMatches.filter(m => m.status === "Finalizado")

      // 3. Calcular los standings nuevos con la función pura
      const newStandings = calculateGroupStandings(teams, finishedMatches)

      // 4. Guardar cada uno en Firestore
      for (const standing of newStandings) {

        const existing = await getStandingByTeam(standing.teamId)

        if (existing.length > 0) {
          // Ya existe un documento de standing para este equipo -> actualizarlo
          await updateStanding(existing[0].id, standing)
        } else {
          // No existe todavía -> crearlo
          await createStanding(standing)
        }
      }
    }

  return {

    standings,
    standing,

    loading,
    error,

    loadStandings,
    loadStanding,
    addStanding,
    loadStandingsByGroup,
    loadStandingByTeam,
    editStanding,
    removeStanding,
    calculateGroupStandings,
    recalculateGroupStandings
    

  }

}