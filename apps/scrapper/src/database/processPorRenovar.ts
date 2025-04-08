import { and, eq } from "drizzle-orm"
import { pgDb } from "./db.js"
import { tblRenovaciones, tblPolizas } from "@asurandi/database"
import { PolizaPorRenovar } from "@asurandi/types"

export const processPorRenovar = async (porRenovar: PolizaPorRenovar, saasId: string): Promise<void> => {

    if (!porRenovar.poliza) return
    // Actualiza cada poliza
    await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Por vencer',
    }).where(
        eq(tblPolizas.numeroPoliza, porRenovar.poliza)
    )

    const [renovacion] = await pgDb.select()
        .from(tblRenovaciones)
        .where(and(
            eq(tblRenovaciones.saasId, saasId),
            eq(tblRenovaciones.company, porRenovar.company),
            eq(tblRenovaciones.numeroPoliza, porRenovar.poliza),
        ))

    const [poliza] = await pgDb.select().from(tblPolizas).where(and(
        eq(tblPolizas.saasId, saasId),
        eq(tblPolizas.companyId, porRenovar.company),
        eq(tblPolizas.numeroPoliza, porRenovar.poliza),
        eq(tblPolizas.esMaestra, true),

    ))
    if (!renovacion) {
        await pgDb.insert(tblRenovaciones).values({
            fechaVencimiento: porRenovar.fechaVencimiento,
            numeroPoliza: porRenovar.poliza,
            estado: 'PENDIENTE',
            saasId,
            company: porRenovar.company,
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