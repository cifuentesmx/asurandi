import { and, between, count, eq, ilike } from "drizzle-orm"

import { tblAgentes, tblAsegurados, tblRenovaciones, tblConductos, tblPolizas, tblVehiculos, tblPolizaOrigen } from "@asurandi/database"
import { pgDb } from "$lib/db.js"

export type ListRenovaciones = Awaited<ReturnType<typeof listRenovaciones>>

export const listRenovaciones = async ({
    saasId,
    filters,
    searchs,
    limit = 10,
    offset = 0,
    download = false
}: {
    saasId: string
    limit?: number
    offset?: number
    filters: string
    searchs: string
    download: boolean
}) => {
    if (download) {
        offset = 0
        limit = 1_000_000_000_000
    }
    const conditions = [
        eq(tblRenovaciones.saasId, saasId),
    ]

    let f
    try {
        f = JSON.parse(filters)

    } catch {
        f = {}
    }
    let s
    try {
        s = JSON.parse(searchs)

    } catch {
        s = {}
    }

    if (f.fechaVencimiento && f.fechaVencimiento.start && f.fechaVencimiento.end) {
        const startDate = new Date(
            f.fechaVencimiento.start.year,
            f.fechaVencimiento.start.month - 1,
            f.fechaVencimiento.start.day
        );
        const endDate = new Date(
            f.fechaVencimiento.end.year,
            f.fechaVencimiento.end.month - 1,
            f.fechaVencimiento.end.day
        );
        conditions.push(
            between(tblRenovaciones.fechaVencimiento, startDate.toISOString(), endDate.toISOString())
        )
    }

    if (f.agente) conditions.push(eq(tblPolizas.agenteId, f.agente))
    if (f.conducto) conditions.push(eq(tblPolizas.conductoId, f.conducto))
    if (f.estado) conditions.push(eq(tblRenovaciones.estado, f.estado))

    if (s.cliente) conditions.push(ilike(tblAsegurados.nombre, `${s.cliente.trim()}%`))
    if (s.numeroPoliza) conditions.push(ilike(tblRenovaciones.numeroPoliza, `${s.numeroPoliza.trim()}%`))
    if (s.numeroSerie) conditions.push(ilike(tblVehiculos.serie, `${s.numeroSerie.trim()}%`))

    const cobros = await pgDb.select({
        id: tblRenovaciones.id,
        saasId: tblRenovaciones.saasId,
        polizaId: tblRenovaciones.polizaId,
        numeroPoliza: tblRenovaciones.numeroPoliza,
        fechaVencimiento: tblRenovaciones.fechaVencimiento,
        vehiculo: tblVehiculos.nombre,
        estado: tblRenovaciones.estado,
        company: tblRenovaciones.company,
        montoAnterior: tblPolizas.total,
        created: tblRenovaciones.created,
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        cliente: tblAsegurados.nombre,
        telefono: tblAsegurados.celular,
        email: tblAsegurados.email,
        origen: tblPolizaOrigen.origen,
    })
        .from(tblRenovaciones)
        .leftJoin(tblPolizas, eq(tblRenovaciones.polizaId, tblPolizas.id))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblPolizas.vehiculoId))
        .leftJoin(tblPolizaOrigen, eq(tblPolizaOrigen.id, tblPolizas.origenId))
        .where(
            and(
                ...conditions
            )
        )
        .offset(offset)
        .limit(limit)
        .orderBy(tblRenovaciones.fechaVencimiento, tblConductos.nombre, tblAgentes.nombre)

    const [total] = await pgDb.select({ count: count() })
        .from(tblRenovaciones)
        .leftJoin(tblPolizas, eq(tblRenovaciones.polizaId, tblPolizas.id))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .where(
            and(
                ...conditions
            )
        )


    return { data: cobros, total }
}
