import { and, eq } from 'drizzle-orm';
import { tblPolizas } from "@asurandi/database"
import { pgDb } from "./db.js"

export const getPolizaMaestra = async (numeroPoliza: string, company: string, saasId: string) => {
    const poliza = await pgDb.select().from(tblPolizas)
        .where(and(
            eq(tblPolizas.numeroPoliza, numeroPoliza),
            eq(tblPolizas.companyId, company),
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.esMaestra, true)
        ))
    return poliza[0]
}