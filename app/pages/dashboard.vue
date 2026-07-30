<script setup>

const {
  users,
  loadUsers,
  loading,
  error
} = useUsers()


await loadUsers()

const { user, logout } = useAuth()



</script>


<template>

  <h1>Usuarios</h1>

<div v-if="user" class="current-user">
  <h2>Bienvenida, {{ user.displayName }}</h2>

  <p>{{ user.email }}</p>

  <img
    v-if="user.photoURL"
    :src="user.photoURL"
    :alt="user.displayName"
    width="80"
  >
</div>

<p v-if="loading">
  Cargando usuarios...
</p>

<button
  @click="logout"
  class="logout-btn"
>
  🚪 Cerrar sesión
</button>

<p v-if="error">
  {{ error }}
</p>

<div
  v-for="userItem in users"
  :key="userItem.id"
>
  <h3>
    {{ userItem.name }}
  </h3>

  <p>
    Email: {{ userItem.email }}
  </p>

  <img
    v-if="userItem.photo"
    :src="userItem.photo"
    width="80"
  >

  <hr>
</div>

</template>