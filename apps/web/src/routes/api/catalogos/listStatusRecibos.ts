import { pgDb } from "$lib/db.js"
import { tblEndosos } from "@asurandi/database"

export type ListReciboEstado = Awaited<ReturnType<typeof listReciboEstado>>

export const listReciboEstado = async () => {
    const estatus = await pgDb.selectDistinct({
        estado: tblEndosos.estado
    })
        .from(tblEndosos).orderBy(tblEndosos.estado)
    const statuses = estatus.map((e) => {
        const estado = e.estado as string
        return {
            id: estado,
            estado: estado?.length === 0 ? 'Vacío' : estado
        }
    })
    return { statuses }
}
