<script setup>

defineProps({
  team: {
    type: Object,
    required: true
  }
})


const emit = defineEmits([
    "editar",
  "eliminar",
  "toggle-favorito"
])


</script>


<template>

  <article class="team-card">

    <!-- HEADER -->
    <div class="team-card__header">

      <img
        :src="team.flag"
        :alt="team.name"
        class="flag"
      >


      <button
        class="favorite"
        @click="$emit('toggle-favorito', team)"
      >
        ☆
      </button>

    </div>


    <!-- PAIS -->
    <h2>
      {{ team.name }}
    </h2>


    <!-- INFORMACIÓN PRINCIPAL -->

    <div class="team-info">

      <div class="info-item">

        <span>
         Grupo
        </span>

        <strong>
          {{ team.group || 'Sin asignar' }}
        </strong>

      </div>


      <div class="info-item">

        <span>
          Confederación
        </span>

        <strong>
          {{ team.confederation }}
        </strong>

      </div>


      <div class="info-item">

        <span>
           Entrenador
        </span>

        <strong>
          {{ team.coach }}
        </strong>

      </div>


      <div class="info-item ranking">

        <span>
          Ranking FIFA
        </span>

        <strong>
          #{{ team.fifaRanking }}
        </strong>

      </div>


    </div>


    <!-- ACCIONES -->

    <div class="team-actions">


      <button
        class="btn-edit"
        @click="$emit('editar', team)"
      >
        ✏️ Editar
      </button>


      <button
        class="btn-delete"
        @click="$emit('eliminar', team.id)"
      >
        🗑 Eliminar
      </button>


    </div>


  </article>

</template>


<style scoped lang="scss">

.team-card {

    background: #ffffff;

    border-radius: 18px;

    padding: 25px;

    border: 1px solid #e2e8f0;

    box-shadow:
        0 8px 25px rgba(15, 42, 74, 0.08);

    transition: all .25s ease;

    display: flex;

    flex-direction: column;

    min-height: 420px;


    &:hover {

        transform: translateY(-5px);

        box-shadow:
            0 14px 35px rgba(15, 42, 74, 0.15);

    }

}


/* HEADER */

.team-card__header {

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 15px;

}



/* BANDERA */

.flag {

    width: 120px;

    height: 75px;

    object-fit: contain;

    border-radius: 8px;

}



/* FAVORITO */

.favorite {

    width: 42px;

    height: 42px;

    border-radius: 50%;

    border: 1px solid #cbd5e1;

    background: #f8fafc;

    color: #12355b;

    font-size: 23px;

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



/* NOMBRE */

h2 {

    text-align: center;

    color: #12355b;

    font-size: 1.5rem;

    margin: 15px 0 20px;

    font-weight: 800;

}



/* INFORMACION */

.team-info {

    display: flex;

    flex-direction: column;

    gap: 12px;

    flex: 1;

}



.info-item {

    display: flex;

    justify-content: space-between;

    align-items: center;

    padding: 12px 15px;

    background: #f8fafc;

    border: 1px solid #e2e8f0;

    border-radius: 12px;


    span {

        color: #64748b;

        font-size: .9rem;

        font-weight: 600;

    }


    strong {

        color: #12355b;

        font-size: .95rem;

        font-weight: 700;

        text-align: right;

    }

}



/* RANKING FIFA */

.ranking {

    background: #eef4fb;


    strong {

        font-size: 1.2rem;

        color: #0f2a4a;

    }

}



/* BOTONES */

.team-actions {

    display: flex;

    gap: 12px;

    margin-top: 25px;

}



/* BOTON EDITAR */

.btn-edit {

    flex: 1;

    padding: 11px 15px;

    border-radius: 10px;

    border: 1px solid #cbd5e1;

    background: #e8eef7;

    color: #12355b;

    font-weight: 700;

    cursor: pointer;

    transition: all .2s;


    &:hover {

        background: #12355b;

        color: white;

        border-color: #12355b;

    }


    &:active {

        transform: scale(.96);

    }

}



/* BOTON ELIMINAR */

.btn-delete {

    flex: 1;

    padding: 11px 15px;

    border-radius: 10px;

    border: 1px solid #fecaca;

    background: #fff1f2;

    color: #dc2626;

    font-weight: 700;

    cursor: pointer;

    transition: all .2s;


    &:hover {

        background: #dc2626;

        color:white;

        border-color:#dc2626;

    }


    &:active {

        transform: scale(.96);

    }

}



/* RESPONSIVE */

@media(max-width:600px) {


    .team-card {

        padding:20px;

    }


    .flag {

        width:90px;

        height:60px;

    }


    .team-actions {

        flex-direction: column;

    }


    .info-item {

        flex-direction: column;

        align-items:flex-start;

        gap:5px;


        strong {

            text-align:left;

        }

    }

}

</style>