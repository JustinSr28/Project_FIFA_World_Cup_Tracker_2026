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


export const getTeams = async () => {

  const snapshot = await getDocs(
    collection(db, "teams")
  )

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getTeamById = async (id) => {

  const reference = doc(db, "teams", id)

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

  const response = await addDoc(
    collection(db, "teams"),
    team
  )

  return response.id
}


export const updateTeam = async (id, team) => {

  const reference = doc(db, "teams", id)

  await updateDoc(reference, team)
}


export const deleteTeam = async (id) => {

  const reference = doc(db, "teams", id)

  await deleteDoc(reference)
}


export const getTeamsByGroup = async (group) => {

  const q = query(
    collection(db, "teams"),
    where("group", "==", group)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getTeamsByConfederation = async (confederation) => {

  const q = query(
    collection(db, "teams"),
    where("confederation", "==", confederation)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}