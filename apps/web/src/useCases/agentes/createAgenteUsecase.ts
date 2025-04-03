import { and, eq, type InferSelectModel } from "drizzle-orm"
import { tblAgentes, tblConductos } from "@asurandi/database"
import { AppError } from "$lib/ApplicationError"
import { pgDb } from "$lib/db.js"

type inputParams = {
    name: string
    alias?: string
    email: string
    tel?: string
    qualitasId?: string
    anaId?: string
    createAditional: boolean
    saasId: string
}

export const createAgenteUsecase = async (params: inputParams):
    Promise<InferSelectModel<typeof tblAgentes>> => {
    if (!params.name) throw new AppError('El nombre del agente es requerido.')
    if (!params.email) throw new AppError("El correo electrónico del agente es requerido");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) throw new AppError("El correo electrónico no es válido.");

    const agentes = await pgDb.select()
        .from(tblAgentes)
        .where(
            and(
                eq(tblAgentes.email, params.email),
                eq(tblAgentes.saasId, params.saasId)
            )
        )
    if (agentes.length > 0) throw new AppError('Ya existe un agente registrado con este mismo correo electrónico.')

    let conducto: InferSelectModel<typeof tblConductos> | undefined = undefined
    if (params.createAditional) {
        [conducto] = await pgDb.select()
            .from(tblConductos)
            .where(
                and(
                    eq(tblConductos.email, params.email),
                    eq(tblConductos.saasId, params.saasId)
                )
            )
        if (!conducto) {
            [conducto] = await pgDb.insert(tblConductos).values({
                nombre: params.name,
                email: params.name,
                saasId: params.saasId
            }).returning()

        }
    }


    const newAgente = {
        nombre: params.name,
        alias: params.alias ?? params.name,
        anaId: params.anaId ?? null,
        qualitasId: params.qualitasId ?? null,
        conductoId: conducto?.id ?? null,
        email: params.email,
        phone: params.tel ?? null,
        saasId: params.saasId,
    }

    const [agente] = await pgDb.insert(tblAgentes).values(newAgente).returning()
    if (!agente) throw new AppError('No se pudo encontrar el agente')
    return agente

}