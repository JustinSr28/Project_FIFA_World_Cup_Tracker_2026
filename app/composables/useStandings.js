import {
  getStandings,
  createStanding,
  getStandingById,
  getStandingsByGroup,
  getStandingByTeam,
  deleteStanding,
  updateStanding,
  getMostGoalsTeam,
  getLeastGoalTeam
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

    } catch (err) {
      error.value = err.message
    }
  }

  const removeStanding = async (id) => {
    try {

      await deleteStanding(id)

      await loadStandings()

    } catch (err) {
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

    finishedMatches.forEach(match => {

      const home = standingsMap[match.homeTeam]
      const away = standingsMap[match.awayTeam]


      if (!home || !away) return


      home.played++
      away.played++


      home.goalsFor += match.homeScore
      home.goalsAgainst += match.awayScore

      away.goalsFor += match.awayScore
      away.goalsAgainst += match.homeScore

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


    Object.values(standingsMap).forEach(standing => {
      standing.goalDifference = standing.goalsFor - standing.goalsAgainst
    })

    return Object.values(standingsMap)
  }

  const recalculateGroupStandings = async (group) => {


    const teams = await getTeamsByGroup(group)


    const allMatches = await getMatchesByGroup(group)
    const finishedMatches = allMatches.filter(m => m.status === "Finalizado")


    const newStandings = calculateGroupStandings(teams, finishedMatches)


    for (const standing of newStandings) {

      const existing = await getStandingByTeam(standing.teamId)

      if (existing.length > 0) {

        await updateStanding(existing[0].id, standing)
      } else {

        await createStanding(standing)
      }
    }
  }


  //stats
  const loadMostGoalsTeam = async () => {

    try {

      loading.value = true
      error.value = ""

      standing.value = await getMostGoalsTeam()

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadLeastGoalsTeam = async () => {

    try {

      loading.value = true
      error.value = ""

      standing.value = await getLeastGoalTeam()

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

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
    recalculateGroupStandings,
    loadMostGoalsTeam,
    loadLeastGoalsTeam,



  }

}