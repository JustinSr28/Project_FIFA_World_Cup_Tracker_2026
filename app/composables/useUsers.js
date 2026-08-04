import {
  getUsers,
  createUser,
  getUserById,
  getUsersByFavoriteTeam,
  updateUser,
  getTopUser,
  getUserNameById
} from "~/services/usersService"

export const useUsers = () => {

  const users = ref([])
  const user = useState("firestoreUser", () => null)

  const loading = ref(false)
  const error = ref("")



  const loadUsers = async () => {

    try {

      loading.value = true
      error.value = ""

      users.value = await getUsers()

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadUser = async (id) => {

    try {

      loading.value = true
      error.value = ""

      user.value = await getUserById(id)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

   const loadNameUserbyId = async (id) => {

    try {

        loading.value = true
        error.value = ""

        user.value = await getUserNameById(id)

        return user.value

    } catch (err) {

        error.value = err.message

    } finally {

        loading.value = false

    }

}

  const addUser = async (data) => {

    await createUser(data)

    await loadUsers()

  }

  const editUser = async (id, data) => {
        try {
    
          await updateUser(id, data)
    
          await loadUsers()
    
        } catch(err) {
          error.value = err.message
        }
      }
    
    

  const loadUsersByFavoriteTeam = async (teamId) => {

    try {

      loading.value = true
      error.value = ""

      users.value = await getUsersByFavoriteTeam(teamId)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  //DASHBOARD
  const loadTopUser = async () => {

    try {

      loading.value = true
      error.value = ""

      user.value = await getTopUser()

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

   const toggleFavoriteMatch = (currentFavorites, matchId) => {
    const alreadyFavorite = currentFavorites.includes(matchId)

    if (alreadyFavorite) {
      return currentFavorites.filter(id => id !== matchId)
    } else {
      return [...currentFavorites, matchId]
    }
  }


  const toggleFavoriteMatchAndSave = async (uid, currentFavorites, matchId) => {
    const updated = toggleFavoriteMatch(currentFavorites, matchId)
    await updateUser(uid, { favoriteMatches: updated })
    return updated
  }

  return {

    users,
    user,

    loading,
    error,

    loadUsers,
    loadUser,
    addUser,
   
    loadUsersByFavoriteTeam,
    editUser,
    loadTopUser,
    toggleFavoriteMatchAndSave,
    toggleFavoriteMatch,
    loadNameUserbyId

  }

}