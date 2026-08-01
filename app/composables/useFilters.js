// composables/useFiltro.js

export const useFiltro = (items, campos = []) => {

  const busqueda = ref("")

  const resultadosFiltrados = computed(() => {

    if (!busqueda.value.trim()) {
      return items.value
    }

    const texto = busqueda.value.toLowerCase()

    return items.value.filter(item =>
      campos.some(campo =>
        String(item[campo] ?? "")
          .toLowerCase()
          .includes(texto)
      )
    )

  })

  return {
    busqueda,
    resultadosFiltrados
  }

}