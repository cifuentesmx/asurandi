import { pgDb } from "../../lib/db.js"
import { tblAgentes, tblAsegurados, tblConductos, tblPolizaOrigen, tblPolizas, tblSiniestros, tblVehiculos } from "@asurandi/database"
import { and, eq, or, count, desc, sql } from "drizzle-orm"

export const findPolizasSiniestradas = async (params: {
    uid: string,
    limit?: number
    offset?: number
}) => {
    const conditions = and(
        eq(tblPolizas.esMaestra, true),
        or(
            eq(tblAgentes.uid, params.uid),
            eq(tblConductos.uid, params.uid),
        ),
        sql`${tblSiniestros.fechaSiniestro} >= CURRENT_DATE - INTERVAL '12 months'`,
        sql`${tblSiniestros.fechaSiniestro} <= CURRENT_DATE`,
        sql`${tblPolizas.vigenciaInicio} <= CURRENT_DATE AND ${tblPolizas.vigenciaFin} >= CURRENT_DATE`,
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
        .from(tblSiniestros)
        .leftJoin(tblPolizas, eq(tblPolizas.id, tblSiniestros.polizaId))
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
        .from(tblSiniestros)
        .leftJoin(tblPolizas, eq(tblPolizas.id, tblSiniestros.polizaId))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblPolizas.vehiculoId))
        .leftJoin(tblPolizaOrigen, eq(tblPolizaOrigen.id, tblPolizas.origenId))
        .where(conditions)


    const transformedData = data.map(item => {
        const transformed: Record<string, any> = {}
        for (const [key, value] of Object.entries(item)) {
            transformed[key] = value === null ? undefined : value
        }
        return transformed
    })
    return {
        data: transformedData, total
    }
}