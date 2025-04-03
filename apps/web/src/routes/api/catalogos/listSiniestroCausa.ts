import { desc } from "drizzle-orm"

import { pgDb } from "$lib/db.js"
import { tblSiniestroCausas } from "@asurandi/database"




export type ListSiniestroCausa = Awaited<ReturnType<typeof listSiniestroCausa>>


export const listSiniestroCausa = async () => {
    const siniestroCausas = await pgDb.select({
        id: tblSiniestroCausas.id,
        causa: tblSiniestroCausas.causa,

    })
        .from(tblSiniestroCausas)
        .orderBy(desc(tblSiniestroCausas))
    return { siniestroCausas }
}
