import { aseguradosToContactos, tblAsegurados, tblConductos, tblContactos } from "@asurandi/database"
import { and, eq } from "drizzle-orm"
import { AppError } from "src/lib/AppError.js"
import { pgDb } from "src/lib/db.js"
import { NewContactoRequest, NewContactoResponse } from "@asurandi/types"
export const newContacto = async ({
    saasId,
    uid,
    nombre,
    email,
    telefono,
    direccion,
    fechaNacimiento,
    rfc,
    aseguradoId
}: NewContactoRequest & { uid: string, saasId: string }): Promise<NewContactoResponse> => {

    let bday: string | null = null
    // Validar fechaNacimiento si está presente
    if (typeof fechaNacimiento === 'string' && fechaNacimiento !== '') {
        const date = new Date(fechaNacimiento);
        if (Number.isNaN(date.getTime())) {
            throw new AppError('La fecha de nacimiento debe ser una fecha válida en formato ISO');
        }
        bday = fechaNacimiento
    }
    return pgDb.transaction(async (tx) => {
        const [conducto] = await tx.select({ id: tblConductos.id })
            .from(tblConductos)
            .where(and(
                eq(tblConductos.saasId, saasId),
                eq(tblConductos.uid, uid)
            )
            )
        if (!conducto) {
            throw new AppError('No se encontró el conducto para asociar el contacto');
        }

        const [asegurado] = await tx.select({ id: tblAsegurados.id }).from(tblAsegurados).where(
            and(
                eq(tblAsegurados.saasId, saasId),
                eq(tblAsegurados.id, aseguradoId)
            )
        )
        if (!asegurado) {
            throw new AppError('No se encontró el asegurado para asociar el contacto');
        }

        const [contacto] = await tx.insert(tblContactos).values({
            saasId,
            nombre,
            email: email ?? null,
            telefono: telefono ?? null,
            direccion: direccion ?? null,
            rfc: rfc ?? null,
            fechaNacimiento: bday,
            conductoId: conducto.id,
        }).returning()

        await tx.insert(aseguradosToContactos).values({
            aseguradoId: asegurado.id,
            contactoId: contacto.id
        })

        return contacto
    })
}