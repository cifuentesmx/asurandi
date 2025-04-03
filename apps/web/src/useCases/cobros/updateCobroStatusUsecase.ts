import { tblCobros } from "@asurandi/database"
import { and, eq } from "drizzle-orm"
import { pgDb } from "$lib/db.js"

type Type = {
    saasId: string
    id: number
    newStatus: 'PENDIENTE' | 'PAGADA' | 'VENCIDA' | 'CANCELADA'
}

export const updateCobroStatusUsecase = async (
    { saasId, newStatus, id }: Type) => {
    const [cobro] = await pgDb.update(tblCobros)
        .set({
            estado: newStatus,
        })
        .where(and(
            eq(tblCobros.saasId, saasId),
            eq(tblCobros.id, id),
        ))
    return cobro
}