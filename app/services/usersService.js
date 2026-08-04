import {
  collection,
  getDocs,
  getDoc,
  addDoc,
   setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore"



export const getUsers = async () => {
  const { $db } = useNuxtApp()

  const snapshot = await getDocs(
    collection($db, "users")
  )

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getUserById = async (id) => {
  const { $db } = useNuxtApp()

  const reference = doc($db, "users", id)

  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}



export const createUser = async (user) => {
  const { $db } = useNuxtApp()

  await setDoc(
    doc($db, "users", user.uid),
    user
  )
   console.log("llego a createuser del servve")

  return user.uid
}

export const updateUser = async (id, user) => {
  const { $db } = useNuxtApp()

  const reference = doc($db, "users", id)

  await updateDoc(reference, user)
}


export const deleteUser = async (id) => {
  const { $db } = useNuxtApp()

  const reference = doc($db, "users", id)

  await deleteDoc(reference)
}





export const getUsersByFavoriteTeam = async (teamId) => {
  const { $db } = useNuxtApp()

  const q = query(
    collection($db, "users"),
    where("favoriteTeam", "==", teamId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}

//DASBOARD
export const getTopUser = async () => {

  const users = await getUsers()

  if (!users.length) {
    return null
  }

  return users.sort(
    (a, b) => b.points - a.points
  )[0]

}


export const getUserNameById = async (userId) => {

    const { $db } = useNuxtApp()

    const userDocument = await getDoc(
        doc($db, "users", userId)
    )

    if (!userDocument.exists()) {
        return null
    }

    return userDocument.data().name

}