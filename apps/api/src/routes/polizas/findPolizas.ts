import { pgDb } from "../../lib/db.js"
import { tblAgentes, tblAsegurados, tblConductos, tblPolizaOrigen, tblPolizas, tblVehiculos } from "@asurandi/database"
import { and, eq, ilike, or, count, desc } from "drizzle-orm"

export const findPolizas = async (params: {
    uid: string,
    searchTxt: string
    limit: number
    offset: number
}) => {
    const conditions = and(
        eq(tblPolizas.esMaestra, true),
        or(
            eq(tblAgentes.uid, params.uid),
            eq(tblConductos.uid, params.uid),
        ),
        or(
            eq(tblPolizas.numeroPoliza, params.searchTxt.trim()),
            ilike(tblAsegurados.nombre, `${params.searchTxt.trim()}%`)
        )
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
        .limit(params.limit)
        .offset(params.offset)

    const [total] = await pgDb
        .select({ count: count() })
        .from(tblPolizas)
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
        data: transformedData,
        total
    }
}