<template>
    <input
  v-model="busqueda"
  placeholder="Buscar país..."
>


<ul
  v-if="busqueda && countries.length"
  class="countries-list"
>

  <li
    v-for="country in countries"
    :key="country.code"
    @click="seleccionarPais(country)"
  >

    <img
      :src="`https://flagcdn.com/w40/${country.code}.png`"
      :alt="country.name"
    >

    {{ country.name }}

  </li>

</ul>


<div v-if="selectedCountry">

  <img
    :src="`https://flagcdn.com/w160/${selectedCountry.code}.png`"
    :alt="selectedCountry.name"
  >

  <h2>
    {{ selectedCountry.name }}
  </h2>

</div>
</template>
<script setup>
const busqueda = ref("")
const selectedCountry = ref(null)

const { countries, loadCountries } = useCountries()


const seleccionarPais = (country) => {
  selectedCountry.value = country
  busqueda.value = country.name
}


watch(busqueda, async (value) => {

  if (value.length < 2) {
    countries.value = []
    return
  }

  await loadCountries(value)

})
</script>
