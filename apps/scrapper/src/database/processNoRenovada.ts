import { and, eq } from "drizzle-orm";
import { pgDb } from "./db.js";
import { tblPolizas, tblRenovaciones } from "@asurandi/database";
import { PolizaNoRenovada } from "@asurandi/types";
import { addPolizaMovimiento } from "./addPolizaMovimiento.js";

export const processNoRenovada = async (noRenovada: PolizaNoRenovada): Promise<void> => {
    if (!noRenovada) return

    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'No renovada',
    }).where(
        eq(tblPolizas.numeroPoliza, noRenovada.poliza)
    ).returning()

    for (let i = 0; i < polizas?.length; i++) {
        const poliza = polizas[i];
        if (!poliza) return

        const probableDate = noRenovada.fechaVencimiento?.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : noRenovada.fechaVencimiento ?? ''

        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: noRenovada.causaNoRenovación ?? '',
            numeroPoliza: noRenovada.poliza,
            tipoMovimiento: 'NO RENOVADA',
        })

        // Actualiza renovaciones
        if (!poliza.saasId) continue
        pgDb.update(tblRenovaciones).set({
            estado: 'NO RENOVADA',
        })
            .where(and(
                eq(tblRenovaciones.saasId, poliza.saasId),
                eq(tblRenovaciones.polizaId, poliza.id)
            ))
    }

}