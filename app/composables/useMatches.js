import {
  getMatches,
  createMatch,
  getMatchById,
  getMatchesByGroup,
  getMatchesByStage,
  getMatchesByStatus,
  getMatchesByCity,
  getMatchesByTeam,
  deleteMatch,
  updateMatch,
  filterMatches,
  getPlayedMatches,
  getWinPercentage ,
  getAverageGoals,
  getPendingMatches,
  getTotalGoals,
  getQualifiedTeams
} from "~/services/matchesService"

import { useStandings } from "~/composables/useStandings"

export const useMatches = () => {

  const matches = ref([])
  const match = ref(null)

  const playedMatches = ref(0)

  const pendingMatches = ref(0)

const totalGoals = ref(0)

const qualifiedTeams = ref(0)

  const loading = ref(false)
  const error = ref("")

   const { recalculateGroupStandings } = useStandings()

  const loadMatches = async () => {

    try {

      loading.value = true
      error.value = ""

      matches.value = await getMatches()

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadMatch = async (id) => {

    try {

      loading.value = true
      error.value = ""

      match.value = await getMatchById(id)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const addMatch = async (data) => {

    await createMatch(data)

    await loadMatches()

  }

  const loadMatchesByGroup = async (group) => {

    try {

      loading.value = true
      error.value = ""

      matches.value = await getMatchesByGroup(group)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadMatchesByStage = async (stage) => {

    try {

      loading.value = true
      error.value = ""

      matches.value = await getMatchesByStage(stage)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadMatchesByStatus = async (status) => {

    try {

      loading.value = true
      error.value = ""

      matches.value = await getMatchesByStatus(status)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadMatchesByCity = async (city) => {

    try {

      loading.value = true
      error.value = ""

      matches.value = await getMatchesByCity(city)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadMatchesByTeam = async (teamId) => {

    try {

      loading.value = true
      error.value = ""

      matches.value = await getMatchesByTeam(teamId)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  
  const editMatch = async (id, data) => {
    try {

      const previous = await getMatchById(id)
      const wasFinished = previous?.status === "Finalizado"
      const isFinished = data.status === "Finalizado"

      if (isFinished) {

        if (data.homeScore === data.awayScore) {
          data.winner = null
        } else if (data.homeScore > data.awayScore) {
          data.winner = data.homeTeam
        } else {
          data.winner = data.awayTeam
        }

      } else {
        data.winner = null
      }

      await updateMatch(id, data)

      if ((isFinished || wasFinished) && data.group) {
        await recalculateGroupStandings(data.group)
      }

      await loadMatches()

    } catch(err) {
      error.value = err.message
    }
  }

  const removeMatch = async (id) => {
    try {

      const matchToDelete = await getMatchById(id)
      await deleteMatch(id)


      if (matchToDelete?.status === "Finalizado" && matchToDelete?.group) {
        await recalculateGroupStandings(matchToDelete.group)
      }

      await loadMatches()

    } catch(err) {
      error.value = err.message
    }
  }

  const loadFilteredMatches = async (filters = {}) => {

    try {

        loading.value = true
        error.value = ""

        matches.value = await filterMatches(filters)

    } catch (err) {

        error.value = err.message

    } finally {

        loading.value = false

    }

}

//stats


const loadPlayedMatches = async () => {

  try {

    loading.value = true
    error.value = ""

    playedMatches.value = await getPlayedMatches()

  } catch (err) {

    error.value = err.message

  } finally {

    loading.value = false

  }

}

const averageGoals = ref(0)

const loadAverageGoals = async () => {

  try {

    loading.value = true
    error.value = ""

    averageGoals.value = await getAverageGoals()

  } catch (err) {

    error.value = err.message

  } finally {

    loading.value = false

  }

}

const winPercentage = ref(0)

const loadWinPercentage = async () => {

  try {

    loading.value = true
    error.value = ""

    winPercentage.value = await getWinPercentage()

  } catch (err) {

    error.value = err.message

  } finally {

    loading.value = false

  }

  }

  const isGroupStageComplete = async () => {

    const groupStageMatches = await getMatchesByStage("Fase de grupos")

    if (groupStageMatches.length === 0) {
      return false
    }

    return groupStageMatches.every(match => match.status === "Finalizado")

  }

//DASHBOARD


const loadPendingMatches = async () => {

  try {

    loading.value = true
    error.value = ""

    pendingMatches.value = await getPendingMatches()

  } catch (err) {

    error.value = err.message

  } finally {

    loading.value = false

  }

}

const loadTotalGoals = async () => {

  try {

    loading.value = true
    error.value = ""

    totalGoals.value = await getTotalGoals()

  } catch (err) {

    error.value = err.message

  } finally {

    loading.value = false

  }

}

const loadQualifiedTeams = async (previousStage) => {

  try {

    loading.value = true
    error.value = ""

    qualifiedTeams.value = await getQualifiedTeams(previousStage)

  } catch (err) {

    error.value = err.message

  } finally {

    loading.value = false

  }

}

  return {
    matches,
    match,
    playedMatches,
    averageGoals,
    winPercentage,
  pendingMatches,
  totalGoals,
  qualifiedTeams,
    

    loading,
    error,
    loadMatches,
    loadMatch,
    addMatch,
    loadMatchesByGroup,
    loadMatchesByStage,
    loadMatchesByStatus,
    loadMatchesByCity,
    loadMatchesByTeam,
    removeMatch,
    editMatch,
    loadFilteredMatches,
    loadPlayedMatches,
    loadAverageGoals,
    loadWinPercentage,
    isGroupStageComplete,
    getMatchesByStage,
    loadPendingMatches,
    loadTotalGoals,
    loadQualifiedTeams,

  }

}