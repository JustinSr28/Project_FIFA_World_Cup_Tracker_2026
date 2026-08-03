<script setup>
const {
    teams,
    loadTeams
} = useTeams()


onMounted(async () => {

    await loadTeams()

})
const props = defineProps({
    playerInicial: Object
})

const emit = defineEmits([
    "guardar",
    "cancelar"
])

const esEdicion = computed(() => !!props.playerInicial)

const {
    formulario,
    cargar,
    limpiar
} = useForm({
    club: "",
    goal: 0,
    name: "",
    number: 0,
    position: "",
    teamId: ""

})

const {
    errores,
    validar,
    limpiarErrores

} = useValidation(

    formulario,
    {
        club: "Ingrese el club",
        name: "Ingrese el nombre del jugador",
        number: "Ingrese el número del jugador",
        position: "Ingrese la posición del jugador",

    }
)

watch(

    () => props.playerInicial,

    (player) => {
        if (player) {

            cargar(player)

        } else {

            limpiar()

        }
        limpiarErrores()
    },

    {
        immediate: true
    }

)

const enviarFormulario = () => {

    if (!validar()) return
    emit("guardar", {

        ...formulario,

        goal: Number(formulario.goal),

        number: Number(formulario.number)

    })
}

const cancelar = () => {
    limpiar()
    limpiarErrores()
    emit("cancelar")
}

</script>
<template>

    <form @submit.prevent="enviarFormulario" class="team-form">


    <div class="form-grupo">

        <label>
            Nombre del jugador *
        </label>

        <input
            v-model="formulario.name"
            :class="{ 'input-error': errores.name }"
            type="text"
            placeholder="Ej: Kylian Mbappé"
        >

        <span v-if="errores.name" class="error">
            {{ errores.name }}
        </span>

    </div>



    <div class="form-grupo">

        <label>
            Club *
        </label>

        <input
            v-model="formulario.club"
            :class="{ 'input-error': errores.club }"
            type="text"
            placeholder="Ej: Real Madrid"
        >

        <span v-if="errores.club" class="error">
            {{ errores.club }}
        </span>

    </div>



    <div class="form-grupo">

        <label>
            Número *
        </label>

        <input
            v-model="formulario.number"
            :class="{ 'input-error': errores.number }"
            type="number"
            placeholder="Ej: 10"
        >

        <span v-if="errores.number" class="error">
            {{ errores.number }}
        </span>

    </div>



    <div class="form-grupo">

        <label>
            Posición *
        </label>

        <select
            v-model="formulario.position"
            :class="{ 'input-error': errores.position }"
        >

            <option value="">
                Seleccione posición
            </option>

            <option value="Portero">
                Portero
            </option>

            <option value="Defensa">
                Defensa
            </option>

            <option value="Mediocampista">
                Mediocampista
            </option>

            <option value="Delantero">
                Delantero
            </option>

        </select>


        <span v-if="errores.position" class="error">
            {{ errores.position }}
        </span>

    </div>



    <div class="form-grupo">

        <label>
            Goles *
        </label>

        <input
            v-model="formulario.goal"
            type="number"
            min="0"
            placeholder="Ej: 5"
        >

    </div>



    <div class="form-grupo">

    <label>
        Selección *
    </label>


    <select
        v-model="formulario.teamId"
        :class="{ 'input-error': errores.teamId }"
    >

        <option value="">
            Seleccione una selección
        </option>


        <option
            v-for="team in teams"
            :key="team.id"
            :value="team.id"
        >

            {{ team.name }}

        </option>


    </select>


    <span
        v-if="errores.teamId"
        class="error"
    >

        {{ errores.teamId }}

    </span>


</div>



    <div class="form-acciones">

        <button class="btn-primary" type="submit">

            {{ esEdicion ? 'Actualizar' : 'Crear' }}

        </button>


        <button
            type="button"
            class="btn-secondary"
            @click="cancelar"
        >

            Cancelar

        </button>


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


        width:100%;

        padding:.75rem .9rem;

        border:1px solid #cbd5e1;

        border-radius:10px;

        font-size:.95rem;

        font-family:inherit;

        outline:none;

        background:#fff;

        color:#334155;

        transition:.2s;



        &:focus {

            border-color:#12355b;

            box-shadow:
            0 0 0 3px rgba(18,53,91,.12);

        }



        &::placeholder {

            color:#94a3b8;

        }


    }


}

/* Lista de países */
.countries-list {
    margin-top:8px;
    background:white;
    border:1px solid #dbe3ec;
    border-radius:10px;
    overflow:hidden;
    box-shadow:
    0 5px 15px rgba(0,0,0,.08);
    max-height:220px;
    overflow-y:auto;
}



.country-item {


    display:flex;

    align-items:center;

    gap:12px;

    padding:12px 15px;

    cursor:pointer;

    color:#334155;

    transition:.2s;



    img {

        width:35px;

        height:25px;

        object-fit:contain;

    }



    &:hover {

        background:#f1f5f9;

        color:#12355b;

    }


}





/* Preview de selección */


.preview {


    display:flex;

    align-items:center;

    justify-content:center;

    gap:20px;

    margin:20px 0;

    padding:20px;

    background:#f8fafc;

    border:1px solid #dbe3ec;

    border-radius:14px;



    img {

        width:100px;

        height:65px;

        object-fit:contain;

    }



    strong {

        font-size:1.3rem;

        color:#12355b;

    }


}





/* Botones */


.form-acciones {


    display:flex;

    justify-content:flex-end;

    gap:.8rem;

    margin-top:25px;

    padding-top:20px;

    border-top:1px solid #e2e8f0;



}



.btn-primary {


    padding:.75rem 1.5rem;

    border-radius:10px;

    border:none;

    background:#12355b;

    color:white;

    font-weight:700;

    cursor:pointer;

    transition:.2s;



    &:hover {

        background:#0f2a4a;

    }



    &:active {

        transform:scale(.97);

    }


}



.btn-secondary {


    padding:.75rem 1.5rem;

    border-radius:10px;

    background:#f1f5f9;

    color:#334155;

    border:1px solid #cbd5e1;

    font-weight:600;

    cursor:pointer;

    transition:.2s;



    &:hover {

        background:#e2e8f0;

    }



    &:active {

        transform:scale(.97);

    }


}

.error {

    color:#dc2626;

    font-size:.85rem;

    margin-top:.25rem;

}
.input-error {
    border-color: #dc2626 !important;

    &:focus {
        border-color: #dc2626 !important;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, .12);
    }
}
@media(max-width:600px){


    .team-form {

        margin:15px;

        padding:20px;

    }

    .form-acciones {

        flex-direction:column;
        button {

            width:100%;
        }

    }
}
</style>