import { inArray } from "drizzle-orm";
import { pgDb } from "../../pg-service/db.js";
import { tblPolizas } from "@asurandi/database";
import { PolizasPagadas } from "@asurandi/types";
import { addPolizaMovimiento } from "../addPolizaMovimiento.js";

export const qualitasPagadas = async (pagadas: PolizasPagadas): Promise<void> => {
    if (pagadas.length === 0) return

    const numPolizas: Set<string> = new Set()
    pagadas.forEach(c => {
        numPolizas.add(c.poliza)
    })
    const arrPolizas = Array.from(numPolizas)
    // Actualiza cada poliza
    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'Pagada',
    }).where(
        inArray(tblPolizas.numeroPoliza, arrPolizas)
    ).returning()

    for (let i = 0; i < polizas?.length; i++) {
        const poliza = polizas[i];
        const pagada = pagadas.find(t => t.poliza, poliza.numeroPoliza)
        if (!pagada) return

        const probableDate = pagada.fechaPago.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : pagada.fechaPago

        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: `${pagada.asegurado} ${pagada.primaRecibo}`,
            numeroPoliza: pagada.poliza,
            tipoMovimiento: 'PAGADA',
        })


    }
}