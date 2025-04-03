import { desc } from "drizzle-orm"

import { pgDb } from "$lib/db.js"
import { tblSubRamos } from "@asurandi/database"




export type ListSubRamos = Awaited<ReturnType<typeof listSubRamos>>


export const listSubRamos = async () => {
    const subRamos = await pgDb.select({
        id: tblSubRamos.id,
        subramo: tblSubRamos.subramo,

    })
        .from(tblSubRamos)
        .orderBy(desc(tblSubRamos.subramo))
    return { subRamos }
}
