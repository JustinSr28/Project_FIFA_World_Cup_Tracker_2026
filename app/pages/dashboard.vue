<template>

  <div class="dashboard-container">


    <h1 class="title">
      ⚽ FIFA WORLD CUP 2026
    </h1>

    <p class="subtitle">
      Panel de control del torneo
    </p>



    <div
      v-if="loading"
      class="message"
    >
      Cargando indicadores...
    </div>



    <div
      v-else-if="error"
      class="message error"
    >
      {{ error }}
    </div>



    <div
      v-else
      class="dashboard"
    >


      <section class="main-card">


        <h2>
          🏟 Estado del torneo
        </h2>


        <div class="stats">


          <div class="stat-item">

            <span>
              Partidos jugados
            </span>

            <strong>
              {{ playedMatches }}
            </strong>

          </div>



          <div class="stat-item">

            <span>
              Partidos pendientes
            </span>

            <strong>
              {{ pendingMatches }}
            </strong>

          </div>



          <div class="stat-item">

            <span>
              Goles anotados
            </span>

            <strong>
              {{ totalGoals }}
            </strong>

          </div>


        </div>


      </section>





      <!-- Indicadores secundarios -->

      <div class="cards-grid">



        <div class="card">


          <div class="icon">
            🏆
          </div>


          <h3>
            Selecciones clasificadas
          </h3>


          <strong>
            {{ qualifiedTeams }}
          </strong>


        </div>





        <div class="card">


          <div class="icon">
            🎯
          </div>


          <h3>
            Predicciones realizadas
          </h3>


          <strong>
            {{ predictionsCount }}
          </strong>


        </div>




      </div>






      <!-- Usuario destacado -->


      <section class="user-card">


        <div class="user-icon">
          👤
        </div>


        <div>

          <h2>
            Usuario con mayor puntaje
          </h2>


          <p>
            {{topUserName }}
          </p>


          <span>
            ⭐ {{ topPredictionUser?.points }} puntos
          </span>

        </div>


      </section>



    </div>


  </div>


</template>

<script setup>
const topUserName = ref("")
const {

  playedMatches,

  pendingMatches,

  totalGoals,

  qualifiedTeams,

  loading: loadingMatches,

  error: errorMatches,

  loadPlayedMatches,

  loadPendingMatches,

  loadTotalGoals,

  loadQualifiedTeams

} = useMatches()

const {

  user,

  loading: loadingUsers,

  error: errorUsers,

  loadNameUserbyId

} = useUsers()



const {

  predictionsCount,

  loading: loadingPredictions,
  error: errorPredictions,

  loadPredictionsCountByUser,
  loadTopPredictionUser,
  topPredictionUser
   

} = usePredictions()

const { user: authUser } = useAuth()

const loading = computed(() =>

  loadingMatches.value ||

  loadingUsers.value ||

  loadingPredictions.value

)

const error = computed(() =>

  errorMatches.value ||

  errorUsers.value ||

  errorPredictions.value

)

const loadTopUser = async () => {

    await loadTopPredictionUser()

    if(topPredictionUser.value){

        topUserName.value =
            await loadNameUserbyId(
                topPredictionUser.value.userId
            )
            console.log(topUserName.value)

    }

}

onMounted(async () => {

  await loadPlayedMatches()

  await loadPendingMatches()

  await loadTotalGoals()

  await loadQualifiedTeams("Dieciseisavos")

  await loadTopUser()
await loadPredictionsCountByUser(authUser.value.uid)


})

</script>
<style scoped>


.dashboard-container {

  max-width:1200px;

  margin:auto;

  padding:40px 25px;

}



/* Título */

.title {

  text-align:center;

  color:#0f2a4a;

  font-size:2.4rem;

  font-weight:800;

  margin-bottom:5px;

}



.subtitle {

  text-align:center;

  color:#64748b;

  margin-bottom:40px;

  font-size:1.1rem;

}



/* Layout */

.dashboard {

  display:flex;

  flex-direction:column;

  gap:25px;

}

.main-card {
  background:white;
  border-radius:20px;
  padding:35px;
  border:1px solid #dbe3ec;
  box-shadow:
  0 8px 20px rgba(15,42,74,.10);
}


.main-card h2 {

  color:#0f2a4a;

  margin-bottom:30px;

  font-size:1.3rem;

}





/* Estadísticas */

.stats {

  display:grid;

  grid-template-columns:
  repeat(3,1fr);

  gap:20px;

}



.stat-item {


  background:#f8fafc;

  border-radius:15px;

  padding:25px;

  text-align:center;

  border:1px solid #e2e8f0;


}



.stat-item span {

  display:block;

  color:#64748b;

  font-size:.95rem;

  margin-bottom:12px;

}



.stat-item strong {

  color:#0f2a4a;

  font-size:2.5rem;

  font-weight:800;

}





/* Cards pequeñas */

.cards-grid {

  display:grid;

  grid-template-columns:
  repeat(2,1fr);

  gap:25px;

}



.card {


  background:white;

  border-radius:18px;

  padding:30px;

  text-align:center;

  border:1px solid #dbe3ec;

  box-shadow:
  0 6px 18px rgba(15,42,74,.08);

  transition:.3s;

}



.card:hover {

  transform:translateY(-5px);

  box-shadow:
  0 12px 25px rgba(15,42,74,.15);

}



.icon {

  font-size:2rem;

  margin-bottom:15px;

}



.card h3 {

  color:#475569;

  font-size:1rem;

  margin-bottom:15px;

}



.card strong {

  color:#0f2a4a;

  font-size:2.5rem;

}





/* Usuario */


.user-card {


  display:flex;

  align-items:center;

  gap:25px;


  background:#0f2a4a;

  color:white;


  border-radius:20px;

  padding:30px;


}



.user-icon {

  font-size:3rem;

  background:white;

  border-radius:50%;

  width:70px;

  height:70px;

  display:flex;

  justify-content:center;

  align-items:center;

}



.user-card h2 {

  margin:0 0 10px;

  font-size:1.2rem;

}



.user-card p {

  margin:0;

  font-size:1.4rem;

  font-weight:700;

}



.user-card span {

  color:#bfdbfe;

}





/* Mensajes */

.message {

  background:#f8fafc;

  border:1px solid #dbe3ec;

  padding:25px;

  border-radius:15px;

  text-align:center;

  color:#475569;

}



.error {

  background:#fef2f2;

  color:#b91c1c;

  border-color:#fecaca;

}




/* Responsive */

@media(max-width:768px){


  .stats {

    grid-template-columns:1fr;

  }



  .cards-grid {

    grid-template-columns:1fr;

  }



  .user-card {

    flex-direction:column;

    text-align:center;

  }


}



</style>