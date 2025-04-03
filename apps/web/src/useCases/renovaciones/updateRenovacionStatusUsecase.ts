import { and, eq } from "drizzle-orm"
import { pgDb } from "$lib/db.js"
import { tblRenovaciones } from "@asurandi/database"

type Type = {
    saasId: string
    id: number
    newStatus: 'PENDIENTE' | 'RENOVADA' | 'NO RENOVADA'
}

export const updateRenovacionStatusUsecase = async (
    { saasId, newStatus, id }: Type) => {
    const [renovacion] = await pgDb.update(tblRenovaciones)
        .set({
            estado: newStatus,
        })
        .where(and(
            eq(tblRenovaciones.saasId, saasId),
            eq(tblRenovaciones.id, id),
        ))
    return renovacion
}