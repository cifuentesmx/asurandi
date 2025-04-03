import { and, eq, isNotNull } from "drizzle-orm"
import { pgDb } from "../../pg-service/db.js"
import { tblCobros, tblPolizas } from "@asurandi/database"
import { PolizasPorCobrar } from "@asurandi/types"

export const qualitasPorCobrar = async (porCobrar: PolizasPorCobrar, saasId: string): Promise<void> => {
    if (porCobrar.length === 0) return

    const numPolizas: Set<string> = new Set()
    porCobrar.forEach(c => {
        numPolizas.add(c.poliza)
    })

    for (let idx = 0; idx < porCobrar.length; idx++) {
        const item = porCobrar[idx];
        const [cobro] = await pgDb.select()
            .from(tblCobros)
            .where(and(
                eq(tblCobros.saasId, saasId),
                eq(tblCobros.company, 'qualitas'),
                eq(tblCobros.numeroPoliza, item.poliza),
                eq(tblCobros.numeroRecibo, item.numeroRecibo),
                eq(tblCobros.endoso, item.endoso),
                eq(tblCobros.serie, item.serie),
            ))
        const [poliza] = await pgDb.select().from(tblPolizas).where(and(
            eq(tblPolizas.numeroPoliza, item.poliza),
            eq(tblPolizas.companyId, 'qualitas'),
            eq(tblPolizas.saasId, saasId),
            isNotNull(tblPolizas.esMaestra),
        ))
        if (!cobro) {
            await pgDb.insert(tblCobros).values({
                fechaVencimiento: item.fechaVencimiento,
                numeroPoliza: item.poliza,
                company: 'qualitas',
                fechaLimite: item.periodoGracia,
                endoso: item.endoso,
                estado: 'PENDIENTE',
                importe: item.importe,
                numeroRecibo: item.numeroRecibo,
                serie: item.serie,
                saasId,
                polizaId: poliza?.id ?? null
            })
        } else {
            await pgDb.update(tblCobros)
                .set({ polizaId: poliza?.id ?? null })
                .where(
                    eq(tblCobros.id, cobro.id)
                )
        }
    }
}