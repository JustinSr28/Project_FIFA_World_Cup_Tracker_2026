import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore"

export const getTeams = async () => {
  const { $db } = useNuxtApp()
  const snapshot = await getDocs(
    collection($db, "teams")
  )
  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}

export const getTeamById = async (id) => {
  const { $db } = useNuxtApp()
  const reference = doc($db, "teams", id)
  const snapshot = await getDoc(reference)
  if (!snapshot.exists()) {
    return null
  }
  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}

export const createTeam = async (team) => {
  const { $db } = useNuxtApp()
  const response = await addDoc(
    collection($db, "teams"),
    team
  )
  return response.id
}

export const updateTeam = async (id, team) => {
  const { $db } = useNuxtApp()
  const reference = doc($db, "teams", id)
  await updateDoc(reference, team)
}

export const deleteTeam = async (id) => {
  const { $db } = useNuxtApp()
  const reference = doc($db, "teams", id)
  await deleteDoc(reference)
}

export const getTeamsByConfederation = async (confederation) => {
  const { $db } = useNuxtApp()
  const q = query(
    collection($db, "teams"),
    where("confederation", "==", confederation)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}

//FILTERS----------
export const getTeamsByGroup = async (group) => {
  const { $db } = useNuxtApp()
  const q = query(
    collection($db, "teams"),
    where("group", "==", group)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}