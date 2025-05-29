import { tblConductos, tblContactos } from "@asurandi/database";
import { and, eq, count, isNull } from "drizzle-orm";
import { pgDb } from "src/lib/db.js";

export const searchSinTelefono = async ({ offset, limit, saasId, uid }:
    { offset: number, limit: number, saasId: string, uid: string }) => {
    const conditions = [
        eq(tblContactos.saasId, saasId),
        eq(tblConductos.uid, uid),
        isNull(tblContactos.telefono)
    ]
    const result = await pgDb.select({
        id: tblContactos.id,
        conducto: tblConductos.nombre,
        nombre: tblContactos.nombre,
        telefono: tblContactos.telefono,
        rfc: tblContactos.rfc,
        correo: tblContactos.email,
        fechaNacimiento: tblContactos.fechaNacimiento,
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