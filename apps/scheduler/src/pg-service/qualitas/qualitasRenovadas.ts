import { and, eq, inArray } from "drizzle-orm"
import { pgDb } from "../../pg-service/db.js"
import { tblPolizas, tblRenovaciones } from "@asurandi/database"
import { PolizasRenovadas } from "@asurandi/types"
import { addPolizaMovimiento } from "../addPolizaMovimiento.js"

export const qualitasRenovadas = async (renovadas: PolizasRenovadas): Promise<void> => {
    if (renovadas.length === 0) return

    const numPolizas: Set<string> = new Set()
    renovadas.forEach(c => {
        numPolizas.add(c.polizaAnterior)
    })
    const arrPolizas = Array.from(numPolizas)
    // Actualiza cada poliza
    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Renovada',
    }).where(
        inArray(tblPolizas.numeroPoliza, arrPolizas)
    ).returning()

    await pgDb.update(tblRenovaciones).set({ estado: 'RENOVADA' }).where(inArray(tblRenovaciones.numeroPoliza, arrPolizas))

    for (let i = 0; i < polizas.length; i++) {
        const poliza = polizas[i];
        const incomingEvent = renovadas.find(t => t.polizaAnterior, poliza.numeroPoliza)
        if (!incomingEvent) return

        const probableDate = incomingEvent.fechaVencimiento.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : incomingEvent.fechaVencimiento
        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: incomingEvent.datos,
            numeroPoliza: incomingEvent.polizaAnterior,
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