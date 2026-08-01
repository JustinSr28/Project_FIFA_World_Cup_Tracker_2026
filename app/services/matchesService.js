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

//---------FILTERS

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

export async function filterMatches(filters = {}) {
  const { $db } = useNuxtApp()

    let q = collection($db, "matches")

    const constraints = []

    if (filters.group) {
        constraints.push(where("group", "==", filters.group))
    }

    if (filters.stage) {
        constraints.push(where("stage", "==", filters.stage))
    }

    if (filters.status) {
        constraints.push(where("status", "==", filters.status))
    }

    if (filters.date) {
        constraints.push(where("kickoff", "==", filters.date))
    }

    if (constraints.length > 0) {
        q = query(q, ...constraints)
    }

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

//stats
//total de part jugadosd
export const getPlayedMatches = async () => {

  const matches = await getMatches()
  console.log(matches)

  return matches.filter(match =>
    match.status === "Finalizado"
  ).length

}

//promedio de goles
export const getAverageGoals = async () => {

  const matches = await getMatches()

  const played = matches.filter(match =>
    match.status === "Finalizado"
  )
  console.log("jugados:",played)

  if (!played.length) {
    return 0
  }

  const totalGoals = played.reduce((total, match) => {

    return total + match.homeScore + match.awayScore

  }, 0)
  console.log("jugados:",totalGoals)
  console.log("hola")

  return (totalGoals / played.length).toFixed(2)

}

//porcentaje de victorias
export const getWinPercentage = async () => {

  const matches = await getMatches()

  const played = matches.filter(match =>
    match.status === "Finalizado"
  )

  if (!played.length) {
    return 0
  }

  const wins = played.filter(match =>
    match.homeScore !== match.awayScore
  ).length

  return ((wins / played.length) * 100).toFixed(2)

}