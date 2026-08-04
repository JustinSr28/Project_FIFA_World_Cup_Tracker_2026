import { reactive } from "vue"

export const useForm = (initialValues) => {

    const formulario = reactive({
        ...initialValues
    })

    const cargar = (data) => {
        Object.assign(
            formulario,
            data || initialValues
        )
    }

    const limpiar = () => {
        Object.assign(
            formulario,
            initialValues
        )
    }
    
    return {
        formulario,
        cargar,
        limpiar
    }
}