import { tblPolizas, tblRenovaciones } from "@asurandi/database";
import { and, eq, gte } from "drizzle-orm";
import { pgDb } from "./db.js";

export const updateRenovaciones = async (saasId: string) => {
    // actualizar las renovaciones que ya tienen una nueva poliza con el mismo numero de serie
    const renovaciones = await pgDb.select({
        renovacionId: tblRenovaciones.id,
        polizaId: tblRenovaciones.polizaId,
        numeroSerie: tblPolizas.numeroSerie,
        vigenciaFin: tblPolizas.vigenciaFin,
    })
        .from(tblRenovaciones)
        .leftJoin(tblPolizas, eq(tblRenovaciones.polizaId, tblPolizas.id))
        .where(
            and(
                eq(tblRenovaciones.saasId, saasId),
                eq(tblRenovaciones.estado, 'PENDIENTE')
            )
        )

    for (let idx = 0; idx < renovaciones.length; idx++) {
        const renovacion = renovaciones[idx];
        if (!renovacion.polizaId) continue
        const poliza = await pgDb.select().from(tblPolizas)
            .where(
                and(
                    eq(tblPolizas.saasId, saasId),
                    eq(tblPolizas.numeroSerie, renovacion.numeroSerie ?? ''),
                    gte(tblPolizas.vigenciaInicio, renovacion.vigenciaFin ?? '')
                )
            )
        if (poliza.length === 0) continue
        console.log(`Renovando ${renovacion.renovacionId} con la poliza ${poliza[0].id}, numero de serie: ${renovacion.numeroSerie}, vigencia fin: ${renovacion.vigenciaFin}`)
        await pgDb.update(tblRenovaciones).set({
            estado: 'RENOVADA',
        }).where(eq(tblRenovaciones.id, renovacion.renovacionId))
    }
}           