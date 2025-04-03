import { inArray } from "drizzle-orm"
import { pgDb } from "../../pg-service/db.js"
import { tblPolizas } from "@asurandi/database"
import { PolizasPorVencer } from "@asurandi/types"
import { addPolizaMovimiento } from "../addPolizaMovimiento.js"

export const qualitasPorVencer = async (porVencer: PolizasPorVencer): Promise<void> => {
    if (porVencer.length === 0) return

    const numPolizas: Set<string> = new Set()
    porVencer.forEach(c => {
        numPolizas.add(c.poliza)
    })
    const arrPolizas = Array.from(numPolizas)
    // Actualiza cada poliza
    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Por vencer',
    }).where(
        inArray(tblPolizas.numeroPoliza, arrPolizas)
    ).returning()

    for (let i = 0; i < polizas.length; i++) {
        const poliza = polizas[i];
        const incomingEvent = porVencer.find(t => t.poliza, poliza.numeroPoliza)
        if (!incomingEvent) return

        const probableDate = incomingEvent.fechaHasta.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : incomingEvent.fechaHasta

        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: incomingEvent.nombreAsegurado,
            numeroPoliza: incomingEvent.poliza,
            tipoMovimiento: 'RENOVACION PRÓXIMA',
        })

    }
}