<script setup>

const props = defineProps({
    teamInicial: Object
})

const emit = defineEmits([ "guardar", "cancelar" ])
const esEdicion = computed(() => !!props.teamInicial)

const { countries, loadCountries } = useCountries()

const busqueda = ref("")
const selectedCountry = ref(null)

const { formulario, cargar,limpiar } = useForm({name: "",group: "",flag: "",coach: "",confederation: "",fifaRanking: "" })

const { errores, validar,limpiarErrores } = useValidation(
    formulario,
    {
        name: "Seleccione una selección",
        group: "Seleccione un grupo",
        coach: "Ingrese el entrenador",
        confederation: "Ingrese la confederación",
        fifaRanking: "Ingrese el ranking FIFA"
    }
)

watch(
    () => props.teamInicial,
    (team) => {
        cargar(team)
        busqueda.value = team?.name ?? ""
        selectedCountry.value = team ?? null
        limpiarErrores()
    },
    {
        immediate: true
    }
)

watch(busqueda, async (value) => {
    if (value.length < 2) {
        countries.value = []
        return
    }
    await loadCountries(value)
})

const seleccionarPais = (country) => {
    selectedCountry.value = country
    busqueda.value = country.name
    formulario.name = country.name
    formulario.flag = `https://flagcdn.com/w160/${country.code}.png`
}

const enviarFormulario = () => {
    if (!validar()) return
    emit("guardar", {
        ...formulario,
        fifaRanking: Number(formulario.fifaRanking)
    })
}

const cancelar = () => {
    limpiar()
    limpiarErrores()
    busqueda.value = ""
    selectedCountry.value = null
    emit("cancelar")
}

</script>

<template>
    <form @submit.prevent="enviarFormulario" class="team-form">

        <div class="form-grupo">
            <label> Selección</label>
            <input v-model="busqueda" :class="{ 'input-error': errores.name }" type="text" placeholder="Buscar selección...">
            <span v-if="errores.name" class="error"> {{ errores.name }} </span>

            <div v-if="countries.length" class="countries-list">
                <div v-for="country in countries" :key="country.code" class="country-item" @click="seleccionarPais(country)">
                    <img :src="`https://flagcdn.com/w40/${country.code}.png`" :alt="country.name"> {{ country.name }}
                </div>
            </div>
        </div>

        <div class="preview" v-if="selectedCountry">
            <img :src="formulario.flag" :alt="formulario.name">
            <strong> {{ formulario.name }} </strong>
        </div>

        <div class="form-grupo">
            <label> Grupo </label>
            <select v-model="formulario.group" :class="{ 'input-error': errores.group }">
                <option value="">Seleccione grupo </option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>E</option>
                <option>F</option>
                <option>G</option>
                <option>H</option>
                <option>I</option>
                <option>J</option>
                <option>K</option>
                <option>L</option>
            </select>
            <span v-if="errores.group" class="error">{{ errores.group }} </span>
        </div>

        <div class="form-grupo">
            <label> Entrenador </label>
            <input v-model="formulario.coach" :class="{ 'input-error': errores.coach }" placeholder="Ej: Miguel Herrera">
            <span v-if="errores.group" class="error">{{ errores.coach }} </span>
        </div>

        <div class="form-grupo">
            <label>Confederación </label>
            <input v-model="formulario.confederation" :class="{ 'input-error': errores.confederation }" placeholder="Ej: Concacaf">
            <span v-if="errores.group" class="error">{{ errores.confederation }} </span>
        </div>

        <div class="form-grupo">
            <label>Ranking FIFA </label>
            <input v-model="formulario.fifaRanking" :class="{ 'input-error': errores.fifaRanking }" type="number"  min="0" placeholder="Ej: 40">
            <span v-if="errores.group" class="error">{{ errores.fifaRanking }} </span>
        </div>

        <div class="form-acciones">
            <button class="btn-primary" type="submit"> {{ esEdicion ? 'Actualizar' : 'Crear' }} </button>
            <button type="button" class="btn-secondary" @click="cancelar"> Cancelar </button>
        </div>

    </form>
</template>

<style scoped lang="scss">
.team-form {
    max-width: 600px;
    margin: 30px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow:
        0 8px 25px rgba(15, 42, 74, 0.08);
}

.form-grupo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.3rem;

    label {
        font-weight: 700;
        color: #1e293b;
        font-size: .95rem;
    }

    input,
    select {
        width: 100%;
        padding: .75rem .9rem;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        font-size: .95rem;
        font-family: inherit;
        outline: none;
        background: #fff;
        color: #334155;
        transition: .2s;

        &:focus {
            border-color: #12355b;
            box-shadow:
                0 0 0 3px rgba(18, 53, 91, .12);
        }

        &::placeholder {
            color: #94a3b8;
        }
    }
}

.countries-list {
    margin-top: 8px;
    background: white;
    border: 1px solid #dbe3ec;
    border-radius: 10px;
    overflow: hidden;
    box-shadow:
        0 5px 15px rgba(0, 0, 0, .08);
    max-height: 220px;
    overflow-y: auto;
}

.country-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    cursor: pointer;
    color: #334155;
    transition: .2s;

    img {
        width: 35px;
        height: 25px;
        object-fit: contain;
    }

    &:hover {
        background: #f1f5f9;
        color: #12355b;
    }
}

.preview {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
    padding: 20px;
    background: #f8fafc;
    border: 1px solid #dbe3ec;
    border-radius: 14px;

    img {
        width: 100px;
        height: 65px;
        object-fit: contain;
    }

    strong {
        font-size: 1.3rem;
        color: #12355b;
    }
}

.form-acciones {
    display: flex;
    justify-content: flex-end;
    gap: .8rem;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
}

.btn-primary {
    padding: .75rem 1.5rem;
    border-radius: 10px;
    border: none;
    background: #12355b;
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition: .2s;

    &:hover {
        background: #0f2a4a;
    }

    &:active {
        transform: scale(.97);
    }
}

.btn-secondary {
    padding: .75rem 1.5rem;
    border-radius: 10px;
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #cbd5e1;
    font-weight: 600;
    cursor: pointer;
    transition: .2s;

    &:hover {
        background: #e2e8f0;
    }

    &:active {
        transform: scale(.97);
    }
}

.error {
    color: #dc2626;
    font-size: .85rem;
    margin-top: .25rem;
}

.input-error {
    border-color: #dc2626 !important;

    &:focus {
        border-color: #dc2626 !important;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, .12);
    }
}
</style>