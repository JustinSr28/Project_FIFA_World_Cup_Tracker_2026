import {
  getUsers,
  createUser,
  getUserById,
  getUserByUid,
  getUsersByFavoriteTeam,
  updateUser
} from "~/services/usersService"

export const useUsers = () => {

  const users = ref([])
  const user = ref(null)

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
    
      

  const loadUserByUid = async (uid) => {

    try {

      loading.value = true
      error.value = ""

      user.value = await getUserByUid(uid)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

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

  return {

    users,
    user,

    loading,
    error,

    loadUsers,
    loadUser,
    addUser,
    loadUserByUid,
    loadUsersByFavoriteTeam,
    editUser

  }

}