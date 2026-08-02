import {
  getPredictions,
  createPrediction,
  getPredictionById,
  getPredictionsByMatch,
  getPredictionsByWinner,
  deletePrediction,
  updatePrediction,
  getPredictionsCountByUser
} from "~/services/predictionsService"

export const usePredictions = () => {

  const predictions = ref([])
  const prediction = ref(null)

  const predictionsCount = ref(0)
  const loading = ref(false)
  const error = ref("")

  const loadPredictions = async () => {

    try {

      loading.value = true
      error.value = ""

      predictions.value = await getPredictions()

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadPrediction = async (id) => {

    try {

      loading.value = true
      error.value = ""

      prediction.value = await getPredictionById(id)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const addPrediction = async (data) => {

    await createPrediction(data)

    await loadPredictions()

  }
  const editPrediction = async (id, data) => {
        try {
    
          await updatePrediction(id, data)
    
          await loadPredictions()
    
        } catch(err) {
          error.value = err.message
        }
      }
    
      const removesPrediction = async (id) => {
        try {
    
          await deletePrediction(id)
    
          await loadPredictions()
    
        } catch(err) {
          error.value = err.message
        }
      }
  

  

  const loadPredictionsByMatch = async (matchId) => {

    try {

      loading.value = true
      error.value = ""

      predictions.value = await getPredictionsByMatch(matchId)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  const loadPredictionsByWinner = async (teamId) => {

    try {

      loading.value = true
      error.value = ""

      predictions.value = await getPredictionsByWinner(teamId)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }

  //DASBOARD
 
const loadPredictionsCountByUser = async (userId) => {

    try {

      loading.value = true
      error.value = ""

      predictionsCount.value = await getPredictionsCountByUser(userId)
        console.log("Cantidad de predicciones:", predictionsCount.value)

    } catch (err) {

      error.value = err.message

    } finally {

      loading.value = false

    }

  }
  return {

    predictions,
    prediction,
    predictionsCount,

    loading,
    error,

    loadPredictions,
    loadPrediction,
    addPrediction,
    loadPredictionsByMatch,
    loadPredictionsByWinner,
    removesPrediction,
    editPrediction,
    loadPredictionsCountByUser

  }

}