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



export const getMatches = async () => {
  
  const { $db } = useNuxtApp()

  const snapshot = await getDocs(
    collection($db, "matches")
  )

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getMatchById = async (id) => {
   const { $db } = useNuxtApp()

  const reference = doc($db, "matches", id)

  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}


export const createMatch = async (match) => {
   const { $db } = useNuxtApp()

  const response = await addDoc(
    collection($db, "matches"),
    match
  )

  return response.id
}


export const updateMatch = async (id, match) => {
   const { $db } = useNuxtApp()

  const reference = doc($db, "matches", id)

  await updateDoc(reference, match)
}


export const deleteMatch = async (id) => {
   const { $db } = useNuxtApp()

  const reference = doc($db, "matches", id)

  await deleteDoc(reference)
}


export const getMatchesByGroup = async (group) => {
   const { $db } = useNuxtApp()
  const q = query(
    collection($db, "matches"),
    where("group", "==", group)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getMatchesByStage = async (stage) => {
   const { $db } = useNuxtApp()

  const q = query(
    collection($db, "matches"),
    where("stage", "==", stage)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getMatchesByStatus = async (status) => {
   const { $db } = useNuxtApp()

  const q = query(
    collection($db, "matches"),
    where("status", "==", status)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getMatchesByCity = async (city) => {
   const { $db } = useNuxtApp()

  const q = query(
    collection($db, "matches"),
    where("city", "==", city)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getMatchesByTeam = async (teamId) => {
   const { $db } = useNuxtApp()

  const homeQuery = query(
    collection($db, "matches"),
    where("homeTeam", "==", teamId)
  )

  const awayQuery = query(
    collection($db, "matches"),
    where("awayTeam", "==", teamId)
  )

  const [homeSnapshot, awaySnapshot] = await Promise.all([
    getDocs(homeQuery),
    getDocs(awayQuery)
  ])

  return [
    ...homeSnapshot.docs,
    ...awaySnapshot.docs
  ].map(document => ({
    id: document.id,
    ...document.data()
  }))
}