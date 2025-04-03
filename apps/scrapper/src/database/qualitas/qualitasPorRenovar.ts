import { and, eq, inArray, isNotNull } from "drizzle-orm"
import { pgDb } from "../db.js"
import { tblRenovaciones, tblPolizas } from "@asurandi/database"
import { PolizasPorRenovar } from "@asurandi/types"

export const qualitasPorRenovar = async (porRenovar: PolizasPorRenovar, saasId: string): Promise<void> => {
    if (porRenovar.length === 0) return


    const numPolizas: Set<string> = new Set()
    porRenovar.forEach(c => {
        numPolizas.add(c.poliza)
    })
    const arrPolizas = Array.from(numPolizas)
    // Actualiza cada poliza
    await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Por vencer',
    }).where(
        inArray(tblPolizas.numeroPoliza, arrPolizas)
    ).returning()

    for (let idx = 0; idx < porRenovar.length; idx++) {
        const item = porRenovar[idx];
        const [renovacion] = await pgDb.select()
            .from(tblRenovaciones)
            .where(and(
                eq(tblRenovaciones.saasId, saasId),
                eq(tblRenovaciones.company, 'qualitas'),
                eq(tblRenovaciones.numeroPoliza, item.poliza),
            ))

        const [poliza] = await pgDb.select().from(tblPolizas).where(and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.companyId, 'qualitas'),
            eq(tblPolizas.numeroPoliza, item.poliza),
            isNotNull(tblPolizas.esMaestra),
        ))
        if (!renovacion) {
            await pgDb.insert(tblRenovaciones).values({
                fechaVencimiento: item.fechaVencimiento,
                numeroPoliza: item.poliza,
                estado: 'PENDIENTE',
                saasId,
                company: 'qualitas',
                polizaId: poliza?.id ?? null
            })
        } else {
            await pgDb.update(tblRenovaciones).set({
                polizaId: poliza?.id ?? null,
            }).where(
                and(
                    eq(tblRenovaciones.id, renovacion.id)
                )
            )

        }
    }


}