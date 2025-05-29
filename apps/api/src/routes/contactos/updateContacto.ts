import { tblAgentes, tblConductos, tblContactos, aseguradosToContactos, tblPolizas, tblAsegurados } from "@asurandi/database"
import { and, eq, or } from "drizzle-orm"
import { AppError } from "src/lib/AppError.js"
import { pgDb } from "src/lib/db.js"
import { UpdateContactoRequest, UpdateContactoResponse } from "@asurandi/types"
export const updateContacto = async ({
    saasId,
    uid,
    id,
    nombre,
    email,
    telefono,
    direccion,
    fechaNacimiento,
    rfc
}: UpdateContactoRequest & { id: number, uid: string, saasId: string }): Promise<UpdateContactoResponse> => {

    // Validar fechaNacimiento si está presente
    if (fechaNacimiento && typeof fechaNacimiento === 'string') {
        const date = new Date(fechaNacimiento);
        if (isNaN(date.getTime())) {
            throw new AppError('La fecha de nacimiento debe ser una fecha válida en formato ISO');
        }
    }

    return pgDb.transaction(async (tx) => {
        const [contacto] = await tx.select({
            id: tblContactos.id,
            nombre: tblContactos.nombre,
            email: tblContactos.email,
            telefono: tblContactos.telefono,
            fechaNacimiento: tblContactos.fechaNacimiento,
            direccion: tblContactos.direccion,
            rfc: tblContactos.rfc,
            agenteId: tblAgentes.id,
            conductoId: tblConductos.id
        })
            .from(aseguradosToContactos)
            .leftJoin(tblContactos, eq(aseguradosToContactos.contactoId, tblContactos.id))
            .leftJoin(tblPolizas, eq(aseguradosToContactos.aseguradoId, tblPolizas.asegurado_id))
            .leftJoin(tblConductos, eq(tblPolizas.conductoId, tblConductos.id))
            .leftJoin(tblAgentes, eq(tblPolizas.agenteId, tblAgentes.id))
            .where(
                and(
                    eq(tblContactos.saasId, saasId),
                    eq(tblContactos.id, id),
                    or(
                        eq(tblAgentes.uid, uid),
                        eq(tblConductos.uid, uid)
                    )
                )
            )


        if (!contacto) {
            throw new AppError('No se encontró el contacto que desea actualizar, o no tienes permisos para actualizarlo.')
        }

        const [updatedContacto] = await tx.update(tblContactos).set({
            saasId: saasId,
            nombre: nombre ?? contacto.nombre ?? '',
            email: email ?? contacto.email,
            telefono: telefono ?? contacto.telefono,
            direccion: direccion ?? contacto.direccion,
            rfc: rfc ?? contacto.rfc,
            fechaNacimiento: fechaNacimiento ?? contacto.fechaNacimiento
        }).where(
            and(
                eq(tblContactos.id, id),
            )
        ).returning()
        return updatedContacto
    })
}