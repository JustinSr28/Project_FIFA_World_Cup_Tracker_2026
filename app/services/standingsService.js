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



export const getStandings = async () => {
  const { $db } = useNuxtApp()

  const snapshot = await getDocs(
    collection($db, "standings")
  )

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getStandingById = async (id) => {
  const { $db } = useNuxtApp()

  const reference = doc($db, "standings", id)

  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}


export const createStanding = async (standing) => {
  const { $db } = useNuxtApp()

  const response = await addDoc(
    collection($db, "standings"),
    standing
  )

  return response.id
}


export const updateStanding = async (id, standing) => {
  const { $db } = useNuxtApp()

  const reference = doc($db, "standings", id)

  await updateDoc(reference, standing)
}


export const deleteStanding = async (id) => {
  const { $db } = useNuxtApp()

  const reference = doc($db, "standings", id)

  await deleteDoc(reference)
}


export const getStandingsByGroup = async (group) => {
  const { $db } = useNuxtApp()

  const q = query(
    collection($db, "standings"),
    where("group", "==", group)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getStandingByTeam = async (teamId) => {
  const { $db } = useNuxtApp()

  const q = query(
    collection($db, "standings"),
    where("teamId", "==", teamId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}

//stats
export const getMostGoalsTeam = async () => {

  const standings = await getStandings()

  if (!standings.length) {
    return null
  }

  return standings.sort(
    (a, b) => b.goalsFor - a.goalsFor
  )[0]

}

export const getLeastGoalTeam = async () => {

  const standings = await getStandings()

  if (!standings.length) {
    return null
  }

  return standings.sort(
    (a, b) => a.goalsAgainst - b.goalsAgainst
  )[0]

}