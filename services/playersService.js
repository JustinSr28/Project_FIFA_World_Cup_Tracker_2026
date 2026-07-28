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

import { db } from "~/auth/auth"
import { db } from "~app/plugins/firebase"

export const getPlayers = async () => {

  const snapshot = await getDocs(
    collection(db, "players")
  )

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getPlayerById = async (id) => {

  const reference = doc(db, "players", id)

  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}


export const createPlayer = async (player) => {

  const response = await addDoc(
    collection(db, "players"),
    player
  )

  return response.id
}


export const updatePlayer = async (id, player) => {

  const reference = doc(db, "players", id)

  await updateDoc(reference, player)
}


export const deletePlayer = async (id) => {

  const reference = doc(db, "players", id)

  await deleteDoc(reference)
}


export const getPlayersByTeam = async (teamId) => {

  const q = query(
    collection(db, "players"),
    where("teamId", "==", teamId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getPlayersByPosition = async (position) => {

  const q = query(
    collection(db, "players"),
    where("position", "==", position)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}