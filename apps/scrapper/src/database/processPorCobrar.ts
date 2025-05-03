import { and, eq, isNotNull } from "drizzle-orm"
import { pgDb } from "./db.js"
import { tblCobros, tblPolizas } from "@asurandi/database"
import { PolizaPorCobrar } from "@asurandi/types"

export const processPorCobrar = async (porCobrar: PolizaPorCobrar, saasId: string): Promise<void> => {
    const [cobro] = await pgDb.select()
        .from(tblCobros)
        .where(and(
            eq(tblCobros.saasId, saasId),
            eq(tblCobros.company, 'qualitas'),
            eq(tblCobros.numeroPoliza, porCobrar.poliza),
            eq(tblCobros.numeroRecibo, porCobrar.numeroRecibo ?? ''),
            eq(tblCobros.endoso, porCobrar.endoso ?? ''),
            eq(tblCobros.serie, porCobrar.serie ?? ''),
        ))
    const [poliza] = await pgDb.select().from(tblPolizas).where(and(
        eq(tblPolizas.numeroPoliza, porCobrar.poliza),
        eq(tblPolizas.companyId, porCobrar.company),
        eq(tblPolizas.saasId, saasId),
        isNotNull(tblPolizas.esMaestra),
    ))
    if (!cobro) {
        await pgDb.insert(tblCobros).values({
            fechaVencimiento: porCobrar.fechaVencimiento.substring(0, 10),
            numeroPoliza: porCobrar.poliza,
            company: porCobrar.company,
            fechaLimite: porCobrar.periodoGracia.substring(0, 10),
            endoso: porCobrar.endoso,
            estado: 'PENDIENTE',
            importe: porCobrar.importe,
            numeroRecibo: porCobrar.numeroRecibo ?? '',
            serie: porCobrar.serie ?? '',
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