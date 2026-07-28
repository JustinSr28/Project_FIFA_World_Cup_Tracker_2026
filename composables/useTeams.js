import {
  getTeams,
  createTeam,
  getTeamById,
  getTeamsByGroup,
  getTeamsByConfederation
} from "~/services/teamsService"

export const useTeams = () => {

  const teams = ref([])
  const team = ref(null)

  const loading = ref(false)
  const error = ref("")

  const loadTeams = async () => {

    try {

      loading.value = true
      error.value = ""

      teams.value = await getTeams()

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadTeam = async (id) => {

    try {

      loading.value = true
      error.value = ""

      team.value = await getTeamById(id)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const addTeam = async (data) => {

    await createTeam(data)

    await loadTeams()

  }

  const loadTeamsByGroup = async (group) => {

    try {

      loading.value = true
      error.value = ""

      teams.value = await getTeamsByGroup(group)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadTeamsByConfederation = async (confederation) => {

    try {

      loading.value = true
      error.value = ""

      teams.value = await getTeamsByConfederation(confederation)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  return {

    teams,
    team,

    loading,
    error,

    loadTeams,
    loadTeam,
    addTeam,
    loadTeamsByGroup,
    loadTeamsByConfederation

  }

}