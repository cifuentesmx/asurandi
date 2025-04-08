import { eq } from "drizzle-orm"
import { pgDb } from "./db.js"
import { tblPolizas } from "@asurandi/database"
import { PolizaPorVencer } from "@asurandi/types"
import { addPolizaMovimiento } from "./addPolizaMovimiento.js"

export const processPorVencer = async (porVencer: PolizaPorVencer): Promise<void> => {

    // Actualiza cada poliza
    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Por vencer',
    }).where(
        eq(tblPolizas.numeroPoliza, porVencer.poliza)
    ).returning()

    for (let i = 0; i < polizas.length; i++) {
        const poliza = polizas[i];

        const probableDate = porVencer.fechaHasta.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : porVencer.fechaHasta

        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: porVencer.nombreAsegurado,
            numeroPoliza: porVencer.poliza,
            tipoMovimiento: 'RENOVACION PRÓXIMA',
        })

    }
}