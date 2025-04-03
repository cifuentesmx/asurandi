
import { pgDb } from "$lib/db.js"
import { tblPolizaOrigen } from "@asurandi/database"




export type ListPolizaOrigen = Awaited<ReturnType<typeof listPolizaOrigen>>


export const listPolizaOrigen = async () => {
    const origenes = await pgDb.select({
        id: tblPolizaOrigen.id,
        origen: tblPolizaOrigen.origen,
    })
        .from(tblPolizaOrigen)
        .orderBy(tblPolizaOrigen.origen)
    return { origenes }
}
