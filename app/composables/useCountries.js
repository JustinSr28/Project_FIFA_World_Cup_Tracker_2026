export const useCountries = () => {

  const countries = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadCountries = async (search) => {
    try {
      loading.value = true
      countries.value = await $fetch("/api/countries", {
        query: {
          search
        }
      })
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  return {
    countries,
    loading,
    error,
    loadCountries
  }
}