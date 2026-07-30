import {
  getStandings,
  createStanding,
  getStandingById,
  getStandingsByGroup,
  getStandingByTeam,
  deleteStanding,
  updateStanding
} from "~/services/standingsService"

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
    removeStanding
    

  }

}