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

import { getMatchById } from "./matchesService"

import {getTeamById} from "~/services/teamsService"

export const getPredictions = async () => {
  const { $db } = useNuxtApp()
  const snapshot = await getDocs( collection($db, "predictions") )
  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}

export const getPredictionById = async (id) => {
  const { $db } = useNuxtApp()
  const reference = doc($db, "predictions", id)
  const snapshot = await getDoc(reference)
  if (!snapshot.exists()) {
    return null
  }
  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}

export const createPrediction = async (prediction) => {
  const { $db } = useNuxtApp()
  const response = await addDoc(
    collection($db, "predictions"),
    prediction
  )
  return response.id
}

export const updatePrediction = async (id, prediction) => {
  const { $db } = useNuxtApp()
  const reference = doc($db, "predictions", id)
  await updateDoc(reference, prediction)
}

export const deletePrediction = async (id) => {
  const { $db } = useNuxtApp()
  const reference = doc($db, "predictions", id)
  await deleteDoc(reference)
}

export const getPredictionsByUser = async (userId) => {
  const { $db } = useNuxtApp()
  const q = query(
    collection($db, "predictions"),
    where("userId", "==", userId)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}

export const getPredictionsByMatch = async (matchId) => {
  const { $db } = useNuxtApp()
  const q = query(
    collection($db, "predictions"),
    where("matchId", "==", matchId)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}

export const getPredictionsByWinner = async (teamId) => {
  const { $db } = useNuxtApp()
  const q = query(
    collection($db, "predictions"),
    where("predictedWinner", "==", teamId)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}

//DASHBOARD
export const getPredictionsCountByUser = async (userId) => {
  const predictions = await getPredictionsByUser(userId)
  return predictions.length
}

export const getTopPredictionUser = async () => {
  const { $db } = useNuxtApp()
  const predictionsSnapshot = await getDocs(
    collection($db, "predictions")
  )
  const totals = {}
  predictionsSnapshot.docs.forEach(document => {
    const prediction = document.data()
    if (!totals[prediction.userId]) {
      totals[prediction.userId] = 0
    }
    totals[prediction.userId] += prediction.points || 0
  })
  let topUserId = null
  let maxPoints = 0
  for (const userId in totals) {
    if (totals[userId] > maxPoints) {
      maxPoints = totals[userId]
      topUserId = userId
    }
  }
  return {
    userId: topUserId,
    points: maxPoints
  }
}


export const getPredictionHistoryByUser = async (userId) => {
  const predictions = await getPredictionsByUser(userId)
  const history = []
  for (const prediction of predictions) {
    const match = await getMatchById(prediction.matchId)
    const homeTeam = await getTeamById(match.homeTeam)
    const awayTeam = await getTeamById(match.awayTeam)
    history.push({
      prediction,
      match,
      homeTeam,
      awayTeam
    })
  }
  return history
}