import { pgDb } from "../../lib/db.js"
import { and, eq, or, count } from "drizzle-orm"
import {
    tblRenovaciones,
    tblPolizas,
    tblAgentes,
    tblConductos,
    tblAsegurados,
    tblVehiculos,
    tblPolizaOrigen,
    tblCompanias
} from "@asurandi/database"
export const listRenovaciones = async (params: {
    uid: string,
    limit: number
    offset: number
}) => {
    const conditions = and(
        or(
            eq(tblAgentes.uid, params.uid),
            eq(tblConductos.uid, params.uid),
        ),
        eq(tblRenovaciones.estado, 'PENDIENTE')
    )
    const data = await pgDb.select({
        id: tblRenovaciones.id,
        saasId: tblRenovaciones.saasId,
        polizaId: tblPolizas.id,
        numeroPoliza: tblRenovaciones.numeroPoliza,
        asegurado: tblAsegurados.nombre,
        celular: tblAsegurados.celular,
        email: tblAsegurados.email,
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        vehiculo: tblVehiculos.nombre,
        vigenciaInicio: tblPolizas.vigenciaInicio,
        vigenciaFin: tblPolizas.vigenciaFin,
        fechaVencimiento: tblRenovaciones.fechaVencimiento,
        estado: tblRenovaciones.estado,
        company: tblCompanias.compania,
        created: tblRenovaciones.created,
    })
        .from(tblRenovaciones)
        .leftJoin(tblPolizas, eq(tblPolizas.id, tblRenovaciones.polizaId))
        .leftJoin(tblCompanias, eq(tblCompanias.id, tblPolizas.companyId))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblPolizas.vehiculoId))
        .leftJoin(tblPolizaOrigen, eq(tblPolizaOrigen.id, tblPolizas.origenId))
        .where(conditions)
        .orderBy(tblRenovaciones.fechaVencimiento)
        .limit(params.limit)
        .offset(params.offset)

    const [total] = await pgDb
        .select({ count: count() })
        .from(tblRenovaciones)
        .leftJoin(tblPolizas, eq(tblPolizas.id, tblRenovaciones.polizaId))
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