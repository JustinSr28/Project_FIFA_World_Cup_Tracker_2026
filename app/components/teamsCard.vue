<script setup>

defineProps({
  team: {
    type: Object,
    required: true
  },
  esFavorito: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["editar", "eliminar", "ver", "toggle-favorito", "ver-jugadores"])

</script>

<template>
  <article class="team-card">

    <div class="team-card__header">

      <img :src="team.flag" :alt="team.name" class="flag">

      <button class="favorite"  :class="{ 'favorite--active': esFavorito }" @click="$emit('toggle-favorito', team)">{{ esFavorito ? '⭐' : '☆' }} </button>

    </div>
    
    <h2> {{ team.name }} </h2>
    
    <div class="team-info">
      <div class="info-item">

        <span> Grupo </span>
        <strong>{{ team.group || 'Sin asignar' }} </strong>
      
      </div>
    </div>
    
    <div class="team-actions">
      <button class="btn-view" @click="$emit('ver', team.id)"> 👁️ </button>
      <button class="btn-edit" @click="$emit('editar', team)"> ✏️ </button>
      <button class="btn-delete" @click="$emit('eliminar', team.id)">🗑️ </button>
    </div>

    <button class="btn-players" @click="$emit('ver-jugadores', team.id)"> 👥 Ver jugadores </button>

  </article>
</template>

<style scoped lang="scss">

.team-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 8px 25px rgba(15, 42, 74, .08);
  transition: .25s ease;
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 14px 35px rgba(15, 42, 74, .15);
  }
}

.team-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.flag {
  width: 75px;
  height: 50px;
  object-fit: contain;
  border-radius: 8px;
}

.favorite {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #12355b;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .2s;
  &:hover {
    background: #12355b;
    color: white;
    transform: scale(1.08);
  }
}

h2 {
  text-align: left;
  color: #12355b;
  font-size: 1.35rem;
  margin: 10px 0;
  font-weight: 800;
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  span {
    color: #64748b;
    font-size: .85rem;
    font-weight: 600;
  }
  strong {
    color: #12355b;
    font-size: .9rem;
    font-weight: 700;
    text-align: right;
  }
}

.ranking {
  display: none;
}

.team-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.team-actions button {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  font-size: .9rem;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}

.btn-view {
  background: #f2f8ff;
  color: rgb(11, 4, 39);
  border: 1px solid #1f334a;
  &:hover {
    background: #1d4ed8;
  }
}

.btn-edit {
  background: #e8eef7;
  color: #12355b;
  border: 1px solid #cbd5e1;
  &:hover {
    background: #12355b;
    color: white;
  }
}

.btn-delete {
  background: #fff1f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  &:hover {
    background: #dc2626;
    color: white;
  }
}

.btn-players {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: #ebeef3;
  border-radius: #030d2e 2px;
  color: rgb(2, 8, 34);
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}
.btn-players:hover {
 
  transform: translateY(-2px);
}
</style>