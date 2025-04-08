import { eq } from "drizzle-orm";
import { pgDb } from "./db.js";
import { tblPolizas } from "@asurandi/database";
import { PolizaCancelada } from "@asurandi/types";
import { addPolizaMovimiento } from "./addPolizaMovimiento.js";

export const processCancelada = async (cancelada: PolizaCancelada): Promise<void> => {
    // Cancela cada poliza
    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Cancelada',
    }).where(
        eq(tblPolizas.numeroPoliza, cancelada.poliza)
    ).returning()

    for (let i = 0; i < polizas.length; i++) {
        const poliza = polizas[i];

        if (!poliza) return
        const probableDate = cancelada.fechaCancelacion?.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : cancelada.fechaCancelacion ?? ''

        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: cancelada.causa ?? '',
            numeroPoliza: cancelada.poliza,
            tipoMovimiento: 'CANCELADA',
        })
    }
}