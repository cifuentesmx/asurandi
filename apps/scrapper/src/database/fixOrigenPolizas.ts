import { tblPolizaMovimientos, tblPolizas } from "@asurandi/database";
import { getAllCuentas } from "./qualitas/getAllCuentas.js";
import { pgDb } from "./db.js";
import { getOrigenId } from "./getOrigenId.js";
import { and, eq, isNull, desc } from "drizzle-orm";
export const fixOrigenPolizas = async (saasId: string) => {
    const cuentas = await getAllCuentas(saasId)
    const polizas = await pgDb.select().from(tblPolizas).where(and(
        isNull(tblPolizas.origenId),
        eq(tblPolizas.saasId, saasId)
    )).orderBy(desc(tblPolizas.fechaEmision), tblPolizas.numeroPoliza)

    for (let idx = 0; idx < polizas.length; idx++) {
        const poliza = polizas[idx];
        if (!poliza.numeroPoliza || !poliza.saasId || !poliza.vigenciaInicio || !poliza.numeroSerie) {
            console.error(`Omitiendo póliza ${poliza.numeroPoliza}`)
            // console.info(poliza)
            continue
        }
        const [origenId, motivo] = await getOrigenId({
            numeroPoliza: poliza.numeroPoliza,
            saasId: poliza.saasId,
            inicio: poliza.vigenciaInicio,
            numeroSerie: poliza.numeroSerie,
            cuentas,
            emision: poliza.vigenciaInicio
        })
        await pgDb.update(tblPolizas).set({
            origenId
        })
            .where(eq(tblPolizas.id, poliza.id))

        await pgDb.insert(tblPolizaMovimientos).values({
            agenteId: poliza.agenteId,
            aseguradoId: poliza.asegurado_id,
            companyId: poliza.companyId,
            conductoId: poliza.conductoId,
            fechaMovimiento: poliza.fechaEmision,
            motivo,
            numeroPoliza: poliza.numeroPoliza,
            vehiculoId: poliza.vehiculoId,
            polizaId: poliza.id,
            saasId,
            tipoMovimiento: 'CAMBIO'
        })
    }
}