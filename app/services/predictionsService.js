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


export const getPredictions = async () => {
  const { $db } = useNuxtApp()

  const snapshot = await getDocs(
    collection($db, "predictions")
  )

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