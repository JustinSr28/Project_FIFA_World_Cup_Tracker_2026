<template>
  <header class="app-header">

    <NuxtLink
      to="/"
      class="logo"
    >
      ⚽ FIFA World Cup 2026
    </NuxtLink>

    <nav>

      <NuxtLink to="/">
        Dashboard
      </NuxtLink>

      <NuxtLink to="/teams">
        Equipos
      </NuxtLink>

      <NuxtLink to="/matches">
        Partidos
      </NuxtLink>

      <NuxtLink to="/groups">
        Fase de grupos
      </NuxtLink>

      <NuxtLink to="/brackets">
        Brackets
      </NuxtLink>

      <NuxtLink to="/predictions">
        Predicciones
      </NuxtLink>

      <NuxtLink to="/statistics">
        Estadísticas
      </NuxtLink>

     
      

    </nav>

    <div class="profile">

      <button
        class="profile-button"
        @click="showMenu = !showMenu"
      >

        <img
          :src="user.photoURL"
          class="avatar"
        >

        <div class="info">
          <span>{{ user.displayName }}</span>
        </div>

        ▼

      </button>

      <div
        v-if="showMenu"
        class="dropdown"
      >

        <NuxtLink to="/profile">
          ✏️ Editar perfil
        </NuxtLink>

        <NuxtLink to="/favorites">
          ❤️ Favoritos
        </NuxtLink>

        <button @click="logout">
          🚪 Cerrar sesión
        </button>

      </div>

    </div>

  </header>
</template>

<script setup>

const showMenu = ref(false)

const favoritesCount = ref(4)

const user = {
  displayName: "Sheyla",
  photoURL: "https://i.pravatar.cc/100"
}

const logout = () => {
  console.log("Cerrar sesión")
}

</script>

<style scoped>
.app-header {
    height: 72px;
    background: #081F4D;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 2rem;

    color: white;

    box-shadow: 0 4px 15px rgba(0,0,0,.15);
}

.logo{
    color:white;
    text-decoration:none;
    font-size:1.3rem;
    font-weight:bold;
}

nav{

    display:flex;
    align-items:center;

    a{

        color:#d6d6d6;
        text-decoration:none;

        padding:.9rem 1.1rem;

        transition:.25s;

        position:relative;

        &:hover{

            color:#3ddc84;
            background:rgba(61,220,132,.08);

        }

        &.router-link-active{

            color:#3ddc84;

            border-bottom:3px solid #3ddc84;

        }

    }

}

.favorites{

    display:flex;
    align-items:center;
    gap:.4rem;

}

.badge{

    width:20px;
    height:20px;

    border-radius:50%;

    background:#ff4d4d;

    display:flex;
    align-items:center;
    justify-content:center;

    font-size:.7rem;
    color:white;
    font-weight:bold;

}

.profile{

    position:relative;

}

.profile-button{

    border:none;
    background:none;

    color:white;

    display:flex;
    align-items:center;
    gap:.75rem;

    cursor:pointer;

}

.avatar{

    width:42px;
    height:42px;

    border-radius:50%;

    border:2px solid #3ddc84;

}

.info{

    display:flex;
    flex-direction:column;
    text-align:left;

    span{

        font-weight:600;

    }

}

.dropdown{

    position:absolute;

    right:0;
    top:60px;

    width:220px;

    background:white;

    border-radius:10px;

    overflow:hidden;

    box-shadow:0 15px 30px rgba(0,0,0,.2);

    display:flex;
    flex-direction:column;

    z-index:1000;

    a,
    button{

        padding:1rem;

        text-align:left;

        border:none;
        background:white;

        cursor:pointer;

        text-decoration:none;

        color:#333;

        transition:.2s;

        &:hover{

            background:#f4f4f4;

        }

    }

}
</style>