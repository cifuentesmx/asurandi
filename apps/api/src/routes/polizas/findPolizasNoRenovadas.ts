import { pgDb } from "../../lib/db.js"
import { tblAgentes, tblAsegurados, tblConductos, tblPolizaOrigen, tblPolizas, tblSiniestros, tblVehiculos } from "@asurandi/database"
import { and, eq, or, count, desc, sql, lte, not } from "drizzle-orm"
import { z } from '@hono/zod-openapi'
import { FindPolizasNoRenovadasRoute } from "./polizas.routes.js"
export const findPolizasNoRenovadas = async (params: {
    uid: string,
    limit?: number
    offset?: number
}): Promise<z.infer<FindPolizasNoRenovadasRoute['responses'][200]['content']['application/json']['schema']>> => {
    const conditions = and(
        eq(tblPolizas.esMaestra, true),
        or(
            eq(tblAgentes.uid, params.uid),
            eq(tblConductos.uid, params.uid),
        ),
        sql`${tblPolizas.vigenciaInicio} >= CURRENT_DATE - INTERVAL '18 months'`,
        sql`${tblPolizas.vigenciaFin} < CURRENT_DATE`,
        not(eq(tblPolizas.polizaEstatus, 'Renovada'))
    )
    const data = await pgDb.select({
        id: tblPolizas.id,
        company: tblPolizas.companyId,
        account: tblPolizas.saasId,
        numeroPoliza: tblPolizas.numeroPoliza,
        asegurado: tblAsegurados.nombre,
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        serie: tblPolizas.numeroSerie,
        vehiculoId: tblPolizas.vehiculoId,
        vehiculo: tblVehiculos.nombre,
        vigenciaInicio: tblPolizas.vigenciaInicio,
        vigenciaFin: tblPolizas.vigenciaFin,
        primaTotal: tblPolizas.total,
        iva: tblPolizas.iva,
        origen: tblPolizaOrigen.origen,
        status: tblPolizas.polizaEstatus,
    })
        .from(tblPolizas)
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblPolizas.vehiculoId))
        .leftJoin(tblPolizaOrigen, eq(tblPolizaOrigen.id, tblPolizas.origenId))
        .where(conditions)
        .orderBy(desc(tblPolizas.fechaEmision))
        .limit(params.limit ?? 40)
        .offset(params.offset ?? 0)

    const [total] = await pgDb
        .select({ count: count() })
        .from(tblPolizas)
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblPolizas.vehiculoId))
        .leftJoin(tblPolizaOrigen, eq(tblPolizaOrigen.id, tblPolizas.origenId))
        .where(conditions)
    return {
        data, total
    }
}