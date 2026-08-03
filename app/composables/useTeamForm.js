import { reactive } from "vue"

export const useTeamForm = () => {

    const formularioInicial = {
        name: "",
        group: "",
        flag: "",
        coach: "",
        confederation: "",
        fifaRanking: ""
    }

    const formulario = reactive({
        ...formularioInicial
    })

    const errores = reactive({
        name: "",
        group: "",
        coach: "",
        confederation: "",
        fifaRanking: ""
    })

    const limpiarErrores = () => {

        errores.name = ""
        errores.group = ""
        errores.coach = ""
        errores.confederation = ""
        errores.fifaRanking = ""
    }
    
    const cargarFormulario = (team) => {

        Object.assign(
            formulario,
            team || formularioInicial
        )
    }

    const limpiarFormulario = () => {
        Object.assign(
            formulario,
            formularioInicial
        )
        limpiarErrores()
    }

    const validar = () => {
        limpiarErrores()
        let valido = true
        if (!formulario.name) {
            errores.name = "Seleccione una selección"
            valido = false
        }
        if (!formulario.group) {
            errores.group = "Seleccione un grupo"
            valido = false
        }
        if (!formulario.coach.trim()) {
            errores.coach = "Ingrese el entrenador"
            valido = false
        }
        if (!formulario.confederation.trim()) {
            errores.confederation = "Ingrese la confederación"
            valido = false
        }
        if (!formulario.fifaRanking) {
            errores.fifaRanking = "Ingrese el ranking FIFA"
            valido = false
        }
        return valido
    }

    return {
        formulario,
        errores,
        validar,
        cargarFormulario,
        limpiarFormulario
    }

}