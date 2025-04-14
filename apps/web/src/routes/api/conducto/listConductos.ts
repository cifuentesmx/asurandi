import { desc, eq } from "drizzle-orm"

import { pgDb } from "$lib/db.js"
import { tblConductos } from "@asurandi/database"

export type ListConductos = Awaited<ReturnType<typeof listConductos>>


export const listConductos = async ({
    saasId,
}: {
    saasId: string,
}) => {


    const conductos = await pgDb.select({
        id: tblConductos.id,
        nombre: tblConductos.nombre,
        email: tblConductos.email,
        phone: tblConductos.phone,
        alias: tblConductos.alias,
        sendTareas: tblConductos.sendTareas
    })
        .from(tblConductos)
        .where(
            eq(tblConductos.saasId, saasId),

        )
        .orderBy(desc(tblConductos.nombre))
    return { conductos }
}
