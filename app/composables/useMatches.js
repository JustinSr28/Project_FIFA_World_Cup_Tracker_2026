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
  updateMatch
} from "~/services/matchesService"

import { useStandings } from "~/composables/useStandings"

export const useMatches = () => {

  const matches = ref([])
  const match = ref(null)

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

      await updateMatch(id, data)

      
      if (data.status === "Finalizado" && data.group) {
        await recalculateGroupStandings(data.group)
      }

      await loadMatches()

    } catch(err) {
      error.value = err.message
    }
  }

  const removeMatch = async (id) => {
    try {

      await deleteMatch(id)

      await loadMatches()

    } catch(err) {
      error.value = err.message
    }
  }


  return {
    matches,
    match,

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
    editMatch
  }

}