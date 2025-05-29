import { tblConductos, tblContactos } from "@asurandi/database";
import { and, eq, count, sql } from "drizzle-orm";
import { pgDb } from "src/lib/db.js";

export const searchCumpleanos = async ({ offset, limit, saasId, uid }:
    { offset: number, limit: number, saasId: string, uid: string }) => {
    const conditions = [
        eq(tblContactos.saasId, saasId),
        eq(tblConductos.uid, uid),
        sql`EXTRACT(DOY FROM ${tblContactos.fechaNacimiento}) BETWEEN EXTRACT(DOY FROM CURRENT_DATE) AND EXTRACT(DOY FROM CURRENT_DATE + INTERVAL '7 days')`
    ]
    const result = await pgDb.select({
        id: tblContactos.id,
        conducto: tblConductos.nombre,
        nombre: tblContactos.nombre,
        telefono: tblContactos.telefono,
        correo: tblContactos.email,
        fechaNacimiento: tblContactos.fechaNacimiento,
        rfc: tblContactos.rfc,
        fechaCreacion: tblContactos.created,
        fechaActualizacion: tblContactos.fechaActualizacion,


    })
        .from(tblContactos)
        .leftJoin(tblConductos, eq(tblConductos.id, tblContactos.conductoId))
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)

    const [total] = await pgDb.select({ count: count() })
        .from(tblContactos)
        .leftJoin(tblConductos, eq(tblConductos.id, tblContactos.conductoId))
        .where(and(...conditions))

    return {
        data: result,
        total: total
    }

}