import { reactive } from "vue"

export const useValidation = (
    formulario,
    reglas
) => {
    
    const errores = reactive({})
    Object.keys(reglas).forEach(campo => {
        errores[campo] = ""
    })
    
    const limpiarErrores = () => {
        Object.keys(errores).forEach(campo => {
            errores[campo] = ""
        })
    }
    
    const validar = () => {
        limpiarErrores()
        let valido = true
        Object.keys(reglas).forEach(campo => {
            const valor = formulario[campo]
            if (
                valor === "" ||
                valor === null ||
                valor === undefined
            ) {
                errores[campo] = reglas[campo]
                valido = false
                return
            }
            if (
                typeof valor === "string" &&
                !valor.trim()
            ) {
                errores[campo] = reglas[campo]
                valido = false
            }
        })
        return valido
    }
    
    return {
        errores,
        validar,
        limpiarErrores
    }
}