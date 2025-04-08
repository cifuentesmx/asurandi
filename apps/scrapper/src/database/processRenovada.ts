import { and, eq } from "drizzle-orm"
import { pgDb } from "./db.js"
import { tblPolizas, tblRenovaciones } from "@asurandi/database"
import { PolizaRenovada } from "@asurandi/types"
import { addPolizaMovimiento } from "./addPolizaMovimiento.js"

export const processRenovada = async (renovada: PolizaRenovada): Promise<void> => {
    // Actualiza cada poliza
    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Renovada',
    }).where(
        eq(tblPolizas.numeroPoliza, renovada.polizaAnterior)
    ).returning()

    await pgDb.update(tblRenovaciones).set({ estado: 'RENOVADA' })
        .where(eq(tblRenovaciones.numeroPoliza, renovada.polizaAnterior))

    for (let i = 0; i < polizas.length; i++) {
        const poliza = polizas[i];

        const probableDate = renovada.fechaVencimiento.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : renovada.fechaVencimiento
        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: renovada.datos,
            numeroPoliza: renovada.polizaAnterior,
            tipoMovimiento: 'RENOVADA',
        })

        // Actualiza renovaciones
        if (!poliza.saasId) continue
        pgDb.update(tblRenovaciones).set({
            estado: 'RENOVADA',
        })
            .where(and(
                eq(tblRenovaciones.saasId, poliza.saasId),
                eq(tblRenovaciones.polizaId, poliza.id)
            ))


    }
}