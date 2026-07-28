import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth"


import { useUsers } from "~/composables/useUsers"

//import { db } from "~/firebase" 



import { auth } from "~/auth/auth.js"
import firebase from "firebase/compat/app"
export const useAuth = () => {
  const user = useState("user", () => null)
   const {
    user: firestoreUser,
    loadUser,
    addUser
  } = useUsers()


    const loginGoogle = async () => {

    try {

      const provider = new GoogleAuthProvider()

      provider.setCustomParameters({
        prompt: "select_account"
      })

      const result = await signInWithPopup(auth, provider)

      const firebaseUser = result.user


      await loadUser(firebaseUser.uid)

     
      if (!firestoreUser.value) {

        await addUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          favoriteTeam: "",
          points: 0
        })

      }

      user.value = firebaseUser

    } catch (error) {

      console.error("Error al iniciar sesión:", error)

    }

  }
  

  const logout = async () => {
    await signOut(auth)

    user.value = null

    navigateTo("/auth/login")
  }

  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
    })
  }

  return {
    user,
    loginGoogle,
    logout,
    initAuth
  }
}