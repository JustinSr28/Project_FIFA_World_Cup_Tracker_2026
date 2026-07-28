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


import { db } from "~app/plugins/firebase"


export const getUsers = async () => {

  const snapshot = await getDocs(
    collection(db, "users")
  )

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getUserById = async (id) => {

  const reference = doc(db, "users", id)

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

  await setDoc(
    doc(db, "users", user.uid),
    user
  )

  return user.uid
}

export const updateUser = async (id, user) => {

  const reference = doc(db, "users", id)

  await updateDoc(reference, user)
}


export const deleteUser = async (id) => {

  const reference = doc(db, "users", id)

  await deleteDoc(reference)
}


export const getUserByUid = async (uid) => {

  const q = query(
    collection(db, "users"),
    where("uid", "==", uid)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}


export const getUsersByFavoriteTeam = async (teamId) => {

  const q = query(
    collection(db, "users"),
    where("favoriteTeam", "==", teamId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }))
}