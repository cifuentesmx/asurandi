import { and, eq, inArray } from "drizzle-orm";
import { pgDb } from "../../pg-service/db.js";
import { tblPolizas, tblRenovaciones } from "@asurandi/database";
import { PolizasNoRenovadas } from "@asurandi/types";
import { addPolizaMovimiento } from "../addPolizaMovimiento.js";

export const qualitasNoRenovadas = async (noRenovadas: PolizasNoRenovadas): Promise<void> => {
    if (noRenovadas.length === 0) return

    const numPolizas: Set<string> = new Set()
    noRenovadas.forEach(c => {
        numPolizas.add(c.poliza)
    })
    const arrPolizas = Array.from(numPolizas)
    // Actualiza cada poliza
    const polizas = await pgDb.update(tblPolizas).set({
        polizaEstatus: 'No renovada',
    }).where(
        inArray(tblPolizas.numeroPoliza, arrPolizas)
    ).returning()

    for (let i = 0; i < polizas?.length; i++) {
        const poliza = polizas[i];
        const norenovada = noRenovadas.find(t => t.poliza, poliza.numeroPoliza)
        if (!norenovada) return

        const probableDate = norenovada.fechaVencimiento.split('/')
        const fechaMovimiento = probableDate?.[2]?.length === 4
            ? [probableDate[2], probableDate[1], probableDate[0]].join('/')
            : norenovada.fechaVencimiento

        await addPolizaMovimiento({
            saasId: poliza.saasId ?? '',
            fechaMovimiento,
            motivo: norenovada.causaNoRenovación,
            numeroPoliza: norenovada.poliza,
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