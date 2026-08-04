import { GoogleAuthProvider,  signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"

import { useUsers } from "~/composables/useUsers"

export const useAuth = () => {

  const { $auth } = useNuxtApp()
  const user = useState("user", () => null)
  const { user: firestoreUser,loadUser,addUser } = useUsers()

  const loginGoogle = async () => {
    try {

      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: "select_account"
      })

      const result = await signInWithPopup($auth, provider)
      const firebaseUser = result.user

      await loadUser(firebaseUser.uid)
    
      if (!firestoreUser.value) {
        await addUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          favoriteMatches: [],
          favoriteTeam: "",
          points: 0
        })
      }
      else { }
      user.value = firebaseUser
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
    }
  }

  const logout = async () => {

    const { $auth } = useNuxtApp()
    await signOut($auth)
    user.value = null
    navigateTo("/")
  }

  const initAuth = () => {
    onAuthStateChanged($auth, async (firebaseUser) => {
      user.value = firebaseUser
      if (firebaseUser) {
        await loadUser(firebaseUser.uid)
      }
    })
  }
  
  return {
    user,
    loginGoogle,
    logout,
    initAuth,
    firestoreUser,
    loadUser
  }
}