import { and, eq, type InferSelectModel } from "drizzle-orm"
import { pgDb } from "$lib/db.js"
import { tblConductos } from "@asurandi/database"
import { AppError } from "$lib/ApplicationError"

type inputParams = {
    id: number,
    name?: string
    alias?: string
    email?: string
    tel?: string
    saasId: string
}

export const updateConductoUsecase = async (params: inputParams):
    Promise<InferSelectModel<typeof tblConductos>> => {
    const [conducto] = await pgDb.select()
        .from(tblConductos)
        .where(
            and(
                eq(tblConductos.id, params.id),
                eq(tblConductos.saasId, params.saasId))
        )

    if (!conducto) throw new AppError('No se pudo encontrar el conducto que se intenta actualizar.')

    conducto.nombre = params.name ?? conducto.nombre
    conducto.alias = params.alias ?? conducto.alias
    conducto.phone = params.tel ?? conducto.phone
    conducto.email = params.email ?? conducto.email

    const [response] = await pgDb.update(tblConductos).set(conducto).where(eq(tblConductos.id, conducto.id)).returning()
    return response
}