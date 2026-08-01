
export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  const { search } = getQuery(event)

  if (!search) {
    return []
  }

  const response = await $fetch(
    `https://api.restcountries.com/countries/v5?q=${search}`,
    {
      headers: {
        Authorization: `Bearer ${config.restCountriesApiKey}`
      }
    }
  )

  return response.data.objects.map(country => ({
    name: country.names.common,
    code: country.codes.alpha_2.toLowerCase()
  }))
})