import { and, eq, type InferSelectModel } from "drizzle-orm"
import { pgDb } from "$lib/db.js"
import { tblAgentes } from "@asurandi/database"

type inputParams = {
    id: number,
    name?: string
    alias?: string
    email?: string
    tel?: string
    newQualitasId?: string
    newAnaId?: string
    conductoId?: number
    saasId: string
}

export const updateAgenteUsecase = async (params: inputParams):
    Promise<InferSelectModel<typeof tblAgentes> | null> => {
    try {
        const [agente] = await pgDb.select()
            .from(tblAgentes)
            .where(
                and(
                    eq(tblAgentes.id, params.id),
                    eq(tblAgentes.saasId, params.saasId))
            )

        if (!agente) throw ('No se pudo encontrar el agente')

        agente.nombre = params.name ?? agente.nombre
        agente.alias = params.alias ?? agente.alias
        agente.phone = params.tel ?? agente.phone
        agente.email = params.email ?? agente.email

        agente.anaId = agente.anaId
            && typeof agente.anaId === 'string'
            && agente.anaId.length > 0
            ? agente.anaId
            : params.newAnaId ?? null

        agente.qualitasId = agente.qualitasId
            && typeof agente.qualitasId === 'string'
            && agente.qualitasId.length > 0
            ? agente.qualitasId
            : params.newQualitasId ?? null

        agente.conductoId = params.conductoId !== 0 ? params.conductoId ?? null : null

        const [response] = await pgDb.update(tblAgentes).set(agente).where(eq(tblAgentes.id, agente.id)).returning()
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}