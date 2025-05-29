import { and, eq, isNotNull } from "drizzle-orm"
import { pgDb } from "./db.js"
import { tblCobros, tblPolizas } from "@asurandi/database"
import { PolizaPorCobrar } from "@asurandi/types"

export const processPorCobrar = async (porCobrar: PolizaPorCobrar[], saasId: string): Promise<void> => {
    porCobrar.forEach(async (p) => {
        if (p.poliza === '2090116589') {
            console.log({ p })
        }
        const [cobro] = await pgDb.select()
            .from(tblCobros)
            .where(and(
                eq(tblCobros.saasId, saasId),
                eq(tblCobros.company, p.company),
                eq(tblCobros.numeroPoliza, p.poliza),
                eq(tblCobros.numeroRecibo, p.numeroRecibo ?? ''),
                eq(tblCobros.endoso, p.endoso ?? ''),
                eq(tblCobros.serie, p.serie ?? ''),
            ))
        const [poliza] = await pgDb.select().from(tblPolizas).where(and(
            eq(tblPolizas.numeroPoliza, p.poliza),
            eq(tblPolizas.companyId, p.company),
            eq(tblPolizas.saasId, saasId),
            isNotNull(tblPolizas.esMaestra),
        ))
        if (!cobro) {
            await pgDb.insert(tblCobros).values({
                fechaVencimiento: p.fechaVencimiento.substring(0, 10),
                numeroPoliza: p.poliza,
                company: p.company,
                fechaLimite: p.periodoGracia.substring(0, 10),
                endoso: p.endoso,
                estado: 'PENDIENTE',
                importe: p.importe,
                numeroRecibo: p.numeroRecibo ?? '',
                serie: p.serie ?? '',
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
    })
}