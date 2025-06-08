import { pgDb } from "database/db.js"
import { tblAgentes } from "@asurandi/database"
import { and, eq, InferSelectModel } from "drizzle-orm"

export const getAgente = async (agenteStr: string, saasId: string): Promise<InferSelectModel<typeof tblAgentes> | null> => {
    const [agente] = await pgDb.select()
        .from(tblAgentes)
        .where(and(
            eq(tblAgentes.anaId, agenteStr),
            eq(tblAgentes.saasId, saasId)
        ))
    if (agente) return agente

    const [newAgente] = await pgDb.insert(tblAgentes).values({
        nombre: agenteStr,
        anaId: agenteStr,
        saasId,
    }).returning()

    return newAgente
}
