import { eq } from "drizzle-orm";
import { pgDb } from "./db.js";
import { tblPolizas } from "@asurandi/database";
import { PolizaPagada } from "@asurandi/types";
import { addPolizaMovimiento } from "./addPolizaMovimiento.js";

export const processPagada = async (pagada: PolizaPagada): Promise<void> => {
    if (!pagada) return

    // Actualiza cada poliza
    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Pagada',
    }).where(
        eq(tblPolizas.numeroPoliza, pagada.poliza)
    ).returning()

    for (let i = 0; i < polizas?.length; i++) {
        const poliza = polizas[i];
        if (!poliza) return

        const probableDate = pagada.fechaPago?.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : pagada.fechaPago ?? ''

        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: `${pagada.asegurado} ${pagada.primaRecibo}`,
            numeroPoliza: pagada.poliza,
            tipoMovimiento: 'PAGADA',
        })


    }
}