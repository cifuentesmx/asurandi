import { inArray } from "drizzle-orm";
import { pgDb } from "../db.js";
import { tblPolizas } from "@asurandi/database";
import { PolizasCanceladas } from "@asurandi/types";
import { addPolizaMovimiento } from "../addPolizaMovimiento.js";

export const qualitasCanceladas = async (canceladas: PolizasCanceladas): Promise<void> => {
    if (canceladas.length === 0) return

    const numPolizas: Set<string> = new Set()

    canceladas.forEach(c => {
        numPolizas.add(c.poliza)
    })

    const arrPolizas = Array.from(numPolizas)
    // Cancela cada poliza
    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Cancelada',
    }).where(
        inArray(tblPolizas.numeroPoliza, arrPolizas)
    ).returning()

    for (let i = 0; i < polizas.length; i++) {
        const poliza = polizas[i];

        const cancelada = canceladas.find(t => t.poliza, poliza.numeroPoliza)
        if (!cancelada) return

        const probableDate = cancelada.fechaCancelacion.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : cancelada.fechaCancelacion

        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: cancelada.causa,
            numeroPoliza: cancelada.poliza,
            tipoMovimiento: 'CANCELADA',
        })
    }
}