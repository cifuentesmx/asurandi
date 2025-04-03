import { desc } from "drizzle-orm"

import { pgDb } from "$lib/db.js"
import { tblServicios } from "@asurandi/database"




export type ListServicios = Awaited<ReturnType<typeof listServicios>>


export const listServicios = async () => {
    const servicios = await pgDb.select({
        id: tblServicios.id,
        servicio: tblServicios.servicio,

    })
        .from(tblServicios)
        .orderBy(desc(tblServicios.servicio))
    return { servicios }
}
