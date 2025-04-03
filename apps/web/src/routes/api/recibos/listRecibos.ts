import { and, between, count, desc, eq, ilike, or, SQL, sum } from "drizzle-orm"

import { tblAgentes, tblConductos, tblModoPagos, tblPolizas, tblEndosos, tblAsegurados, tblTipoEndoso, tblVehiculos } from "@asurandi/database"
import { pgDb } from "$lib/db.js"

export type ListRecibos = Awaited<ReturnType<typeof listRecibos>>

export const listRecibos = async ({
    saasId,
    limit,
    offset,
    filters,
    searches,
    download = false
}: {
    saasId: string,
    limit: number,
    offset: number
    filters: string
    searches: string
    download?: boolean
}) => {
    if (download) {
        offset = 0
        limit = 1_000_000_000_000
    }
    let f
    const conditions: ReturnType<typeof eq>[] = [
        eq(tblEndosos.saasId, saasId),
    ]
    try {
        f = JSON.parse(filters)

    } catch {
        f = {}
    }
    let s
    try {
        s = JSON.parse(searches)
    } catch {
        s = {}
    }

    if (f.conducto) conditions.push(eq(tblPolizas.conductoId, f.conducto))
    if (f.agente) conditions.push(eq(tblPolizas.agenteId, f.agente))
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
            between(tblEndosos.fechaVencimiento, startDate.toISOString(), endDate.toISOString()),
        )
    }
    if (f.estado) conditions.push(eq(tblEndosos.estado, f.estado))

    const searchTerms: SQL<unknown>[] = []

    if (s.numeroPoliza) searchTerms.push(eq(tblPolizas.numeroPoliza, s.numeroPoliza.trim()))
    if (s.numeroSerie) searchTerms.push(eq(tblPolizas.numeroSerie, s.numeroSerie?.toUpperCase().trim()))
    if (s.cliente) searchTerms.push(ilike(tblAsegurados.nombre, `${s.cliente?.toUpperCase().trim()}%`))

    // @ts-expect-error: TypeScript cannot infer the correct type for the 'or' function
    if (searchTerms.length > 0) conditions.push(or(...searchTerms))


    const recibos = await pgDb.select({
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        modoPago: tblModoPagos.modoPago,
        polizaId: tblEndosos.polizaId,
        vehiculoId: tblPolizas.vehiculoId,
        numeroRecibo: tblEndosos.numeroRecibo,
        numeroPoliza: tblPolizas.numeroPoliza,
        vehiculo: tblVehiculos.nombre,
        asegurado: tblAsegurados.nombre,
        endoso: tblEndosos.endoso,
        importe: tblEndosos.importe,
        estado: tblEndosos.estado,
        remesa: tblEndosos.remesa,
        fechaPago: tblEndosos.fechaPago,
        fechaVencimiento: tblEndosos.fechaVencimiento,
        fechaRegistroPago: tblEndosos.fechaRegistroPago,
        tipoEndoso: tblTipoEndoso.tipoEndoso,
        numeroSerie: tblPolizas.numeroSerie,
    })
        .from(tblEndosos)
        .leftJoin(tblPolizas, eq(tblEndosos.polizaId, tblPolizas.id))
        .leftJoin(tblVehiculos, eq(tblPolizas.vehiculoId, tblVehiculos.id))
        .leftJoin(tblAsegurados, eq(tblPolizas.asegurado_id, tblAsegurados.id))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblModoPagos, eq(tblModoPagos.id, tblPolizas.modoPagoId))
        .leftJoin(tblTipoEndoso, eq(tblTipoEndoso.id, tblEndosos.tipoEndosoId))
        .where(and(
            ...conditions
        ))
        .orderBy(desc(tblEndosos.fechaVencimiento), tblEndosos.numeroRecibo)
        .limit(limit)
        .offset(offset)

    const [total] = await pgDb.select({ count: count(), importe: sum(tblEndosos.importe) })
        .from(tblEndosos)
        .leftJoin(tblPolizas, eq(tblEndosos.polizaId, tblPolizas.id))
        .where(
            and(
                ...conditions
            )
        )
    return { data: recibos, total, }

}