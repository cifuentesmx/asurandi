// import { fixOrigenPolizas } from "./fixOrigenPolizas.js"
// import { fixDuplicatedFleetRecords } from "./fixDuplicatedFleetRecords.js"
// import { fixContactos } from "./fixContactos.js"
import { updateCobranzaRetroactiva } from "./updateCobranzaRetroactiva.js"
import { updateRenovaciones } from "./updateRenovaciones.js"
export const updateAll = async (saasId: string) => {
    console.time('Update all:')
    try {
        // corregir origen de las polizas
        // await fixOrigenPolizas(saasId)

        // corregir registros duplicados de polizas
        // await fixDuplicatedFleetRecords(saasId)

        // actualizar contactos
        // await fixContactos(saasId)

        // Actualizar datos Cobranza retroactiva
        await updateCobranzaRetroactiva(saasId)

        // actualizar renovaciones
        await updateRenovaciones(saasId)

    } catch (error) {
        console.error(error)
    } finally {
        console.timeEnd('Update all:')
    }
}