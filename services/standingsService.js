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

export const getStandings = async () => {

  const snapshot = await getDocs(
    collection(db, "standings")
  )

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getStandingById = async (id) => {

  const reference = doc(db, "standings", id)

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

  const response = await addDoc(
    collection(db, "standings"),
    standing
  )

  return response.id
}


export const updateStanding = async (id, standing) => {

  const reference = doc(db, "standings", id)

  await updateDoc(reference, standing)
}


export const deleteStanding = async (id) => {

  const reference = doc(db, "standings", id)

  await deleteDoc(reference)
}


export const getStandingsByGroup = async (group) => {

  const q = query(
    collection(db, "standings"),
    where("group", "==", group)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getStandingByTeam = async (teamId) => {

  const q = query(
    collection(db, "standings"),
    where("teamId", "==", teamId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}