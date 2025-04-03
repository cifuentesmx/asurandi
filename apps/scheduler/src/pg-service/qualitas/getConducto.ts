import {
    eq,
    InferSelectModel
} from "drizzle-orm"
import { tblAgentes, tblConductos } from "@asurandi/database"
import { nexusGetConducto } from "../../nexus/polizaGetConducto.js"
import { pgDb } from "../../pg-service/db.js"

export const getConducto = async (numeroPoliza: string, agente: InferSelectModel<typeof tblAgentes>, saasId: string): Promise<InferSelectModel<typeof tblConductos> | null> => {
    if (agente?.conductoId) {
        const conducto = await pgDb.select()
            .from(tblConductos)
            .where(eq(tblConductos.id, agente.conductoId))
            .limit(1)
        return conducto[0] ?? null
    }

    const nxConducto = await nexusGetConducto(numeroPoliza)
    if (nxConducto?.idConducto) {
        const conductos = await pgDb.select()
            .from(tblConductos)
            .where(eq(tblConductos.nexusId, nxConducto.idConducto))
            .limit(1)
        if (conductos.length !== 0) return conductos[0]

        const conducto = await pgDb.insert(tblConductos).values({
            nombre: nxConducto.nombre ?? 'Desconocido',
            email: nxConducto.email,
            nexusId: nxConducto.idConducto,
            saasId
        }).returning()
            .catch(async () => {
                return await pgDb.select()
                    .from(tblConductos)
                    .where(eq(tblConductos.nexusId, nxConducto.idConducto))
                    .limit(1)
            })
        return conducto[0] ?? null
    }
    return null
}