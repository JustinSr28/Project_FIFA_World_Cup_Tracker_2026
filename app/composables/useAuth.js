import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth"


import { useUsers } from "~/composables/useUsers"

export const useAuth = () => {
  const { $auth } = useNuxtApp()
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
      console.log("Iniciando login con Google...")
      const result = await signInWithPopup($auth, provider)

      const firebaseUser = result.user
      console.log("Usuario Firebase:", firebaseUser)


      console.log("UID:", firebaseUser.uid)
      console.log("Nombre:", firebaseUser.displayName)
      console.log("Email:", firebaseUser.email)
      console.log("Foto:", firebaseUser.photoURL)


      await loadUser(firebaseUser.uid)
      console.log(
        "Usuario encontrado en Firestore:",
        firestoreUser.value
      )



      if (!firestoreUser.value) {

        await addUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          favoriteTeam: "",
          points: 0
        })
        console.log("Usuario creado correctamente")
      }
      else {
        console.log("Usuario NO creado correctamente")

      }

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
    onAuthStateChanged($auth, (firebaseUser) => {
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