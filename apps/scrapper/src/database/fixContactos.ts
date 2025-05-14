import { aseguradosToContactos, tblAsegurados, tblContactos } from "@asurandi/database"
import { and, eq, ilike, isNull, or } from "drizzle-orm"
import { pgDb } from "./db.js"

export const fixContactos = async (saasId: string) => {
    const contactos = await pgDb.select().from(tblContactos).where(
        and(
            eq(tblContactos.saasId, saasId),
            or(
                isNull(tblContactos.nombre),
                eq(tblContactos.nombre, ''),
                ilike(tblContactos.nombre, 'desconocido%')
            )
        )
    )

    console.log(`${contactos.length} contactos encontrados que se deben corregir.`)

    for (let idx = 0; idx < contactos.length; idx++) {
        const contacto = contactos[idx];

        const [asegurado] = await pgDb.select({
            nombre: tblAsegurados.nombre,
            email: tblAsegurados.email,
            direccion: tblAsegurados.direccion,
            rfc: tblAsegurados.rfc,
            telefono: tblAsegurados.celular,

        })
            .from(aseguradosToContactos)
            .where(and(
                eq(aseguradosToContactos.contactoId, contacto.id),
            ))
            .leftJoin(tblAsegurados, eq(aseguradosToContactos.aseguradoId, tblAsegurados.id))

        if (!asegurado) continue

        const rfc = asegurado.rfc === 'XAXX010101000' || asegurado.rfc === 'XEXX010101000' ? null : asegurado.rfc

        const [updated] = await pgDb.update(tblContactos)
            .set({
                nombre: asegurado.nombre ?? '',
                email: asegurado.email || null,
                telefono: asegurado.telefono || null,
                direccion: asegurado.direccion || null,
                rfc: rfc || null,

            })
            .where(eq(tblContactos.id, contacto.id))
            .returning()

        console.log(`${idx + 1}/${contactos.length} - ${updated.nombre} - ${updated.email} - ${updated.telefono} - ${updated.direccion} - ${updated.rfc} - ${updated.email}`)
    }
}