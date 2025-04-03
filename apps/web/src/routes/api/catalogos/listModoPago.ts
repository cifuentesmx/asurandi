import { desc } from "drizzle-orm"

import { pgDb } from "$lib/db.js"
import { tblModoPagos } from "@asurandi/database"




export type ListModoPagos = Awaited<ReturnType<typeof listModoPagos>>


export const listModoPagos = async () => {
    const modoPagos = await pgDb.select({
        id: tblModoPagos.id,
        modoPago: tblModoPagos.modoPago,
    })
        .from(tblModoPagos)
        .orderBy(desc(tblModoPagos.modoPago))
    return { modoPagos }
}
