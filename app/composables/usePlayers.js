import {
  getPlayers,
  createPlayer,
  getPlayerById,
  getPlayersByTeam,
  getPlayersByPosition,
  deletePlayer,
  updatePlayer,
  getTopScorer
} from "~/services/playersService"

export const usePlayers = () => {

  const players = ref([])
  const player = ref(null)

  const loading = ref(false)
  const error = ref("")

  const loadPlayers = async () => {

    try {

      loading.value = true
      error.value = ""

      players.value = await getPlayers()

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadPlayer = async (id) => {

    try {

      loading.value = true
      error.value = ""

      player.value = await getPlayerById(id)
     

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const addPlayer = async (data) => {

    await createPlayer(data)

    await loadPlayers()

  }
  const editPlayer = async (id, data) => {
      try {
  
        await updatePlayer(id, data)
  
        await loadPlayers()
  
      } catch(err) {
        error.value = err.message
      }
    }
  
    const removePlayer = async (id) => {
      try {
  
        await deletePlayer(id)
  
        await loadPlayers()
  
      } catch(err) {
        error.value = err.message
      }
    }

  const loadPlayersByTeam = async (teamId) => {

    try {

      loading.value = true
      error.value = ""

      players.value = await getPlayersByTeam(teamId)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadPlayersByPosition = async (position) => {

    try {

      loading.value = true
      error.value = ""

      players.value = await getPlayersByPosition(position)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  //stats
const loadTopScorer = async () => {

  try {

    loading.value = true
    error.value = ""

    player.value = await getTopScorer()

  } catch (err) {

    error.value = err.message

  } finally {

    loading.value = false

  }

}

  return {

    players,
    player,

    loading,
    error,

    loadPlayers,
    loadPlayer,
    addPlayer,
    loadPlayersByTeam,
    loadPlayersByPosition,
    removePlayer,
    editPlayer,
    loadTopScorer

  }

}