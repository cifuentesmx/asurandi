import { tblConductos, tblContactos } from "@asurandi/database";
import { and, eq, ilike, count } from "drizzle-orm";
import { pgDb } from "src/lib/db.js";

export const searchContactos = async ({ search, offset, limit, saasId, uid }:
    { search: string, offset: number, limit: number, saasId: string, uid: string }) => {
    const conditions = [
        eq(tblContactos.saasId, saasId),
        eq(tblConductos.uid, uid),
        search ? ilike(tblContactos.nombre, `${search}%`) : undefined
    ]
    const result = await pgDb.select({
        id: tblContactos.id,
        conducto: tblConductos.nombre,
        nombre: tblContactos.nombre,
        telefono: tblContactos.telefono,
        correo: tblContactos.email,
        rfc: tblContactos.rfc,
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