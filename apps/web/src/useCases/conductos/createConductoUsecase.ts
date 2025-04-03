import { and, eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm"
import { tblConductos } from "@asurandi/database"
import { AppError } from "$lib/ApplicationError"
import { pgDb } from "$lib/db.js"

type inputParams = {
    name: string
    alias?: string
    email: string
    tel?: string
    saasId: string
}

export const createConductoUsecase = async (params: inputParams):
    Promise<InferSelectModel<typeof tblConductos>> => {
    if (!params.name) throw new AppError('El nombre del conducto es requerido.')
    if (!params.email) throw new AppError("El correo electrónico del conducto es requerido");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) throw new AppError("El correo electrónico no es válido.");

    const conductos = await pgDb.select()
        .from(tblConductos)
        .where(
            and(
                eq(tblConductos.email, params.email),
                eq(tblConductos.saasId, params.saasId)
            )
        )
    if (conductos.length > 0) throw new AppError('Ya existe un conducto registrado con este mismo correo electrónico.')

    const newConducto: InferInsertModel<typeof tblConductos> = {
        nombre: params.name,
        alias: params.alias ?? params.name,
        email: params.email,
        phone: params.tel ?? null,
        saasId: params.saasId,
    }

    const [conducto] = await pgDb.insert(tblConductos).values(newConducto).returning()
    if (!conducto) throw new AppError('No se pudo encontrar el conducto recién creado.')
    return conducto
}