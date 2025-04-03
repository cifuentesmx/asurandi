import { desc, eq } from "drizzle-orm"

import { pgDb } from "$lib/db.js"
import { tblAgentes } from "@asurandi/database"




export type ListAgentes = Awaited<ReturnType<typeof listAgentes>>


export const listAgentes = async ({
    saasId,
}: {
    saasId: string,
}) => {
    const agentes = await pgDb.query.tblAgentes.findMany({
        with: {
            agentesToConductos: {
                with: {
                    conducto: true
                }
            }
        },
        where: eq(tblAgentes.saasId, saasId),
        orderBy: desc(tblAgentes.alias)
    })
    return { agentes }
}
