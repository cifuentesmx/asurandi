import { and, between, count, desc, eq, ilike, isNull, or, SQL } from "drizzle-orm"
import { pgDb } from "$lib/db.js"
import { tblAgentes, tblAsegurados, tblConductos, tblPolizas, tblSiniestroCausas, tblSiniestros, tblVehiculos } from "@asurandi/database"


export type ListSiniestros = Awaited<ReturnType<typeof listSiniestros>>
export const listSiniestros = async ({ saasId, limit, offset, filters, searchs,
    download = false, enSeguimiento

}: {
    saasId: string
    limit: number
    offset: number
    filters: string
    searchs: string
    download?: boolean
    enSeguimiento?: string
}) => {
    if (download) {
        offset = 0
        limit = 1_000_000_000_000
    }
    let f
    const conditions: (SQL<unknown> | undefined)[] = [
        eq(tblSiniestros.saasId, saasId),
    ]
    if (enSeguimiento && enSeguimiento === '1') conditions.push(eq(tblSiniestros.enSeguimiento, true))
    if (enSeguimiento && enSeguimiento === '0') {
        conditions.push(or(
            eq(tblSiniestros.enSeguimiento, false),
            isNull(tblSiniestros.enSeguimiento),
        ))
        conditions.push(isNull(tblSiniestros.fechaCierre))
    }
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

    if (f.fechaSiniestro && f.fechaSiniestro.start && f.fechaSiniestro.end) {
        const startDate = new Date(
            f.fechaSiniestro.start.year,
            f.fechaSiniestro.start.month - 1,
            f.fechaSiniestro.start.day
        );
        const endDate = new Date(
            f.fechaSiniestro.end.year,
            f.fechaSiniestro.end.month - 1,
            f.fechaSiniestro.end.day
        );
        conditions.push(
            between(tblSiniestros.fechaSiniestro, startDate.toISOString(), endDate.toISOString())
        )
    }

    if (f.agente) conditions.push(eq(tblSiniestros.agenteId, f.agente))
    if (f.conducto) conditions.push(eq(tblSiniestros.conductoId, f.conducto))
    if (f.causa) conditions.push(eq(tblSiniestros.causaId, f.causa))

    if (s.numeroPoliza) conditions.push(eq(tblPolizas.numeroPoliza, s.numeroPoliza.trim()))
    if (s.numeroReporte) conditions.push(eq(tblSiniestros.numeroReporte, s.numeroReporte.trim()))
    if (s.numeroSerie) conditions.push(eq(tblPolizas.numeroSerie, s.numeroSerie?.toUpperCase().trim()))
    if (s.cliente) conditions.push(ilike(tblAsegurados.nombre, `${s.cliente.trim()}%`))





    const siniestros = await pgDb.select({
        id: tblSiniestros.id,
        causa: tblSiniestroCausas.causa,
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        siniestro: tblSiniestros.numeroSiniestro,
        fechaSiniestro: tblSiniestros.fechaSiniestro,
        horaSiniestro: tblSiniestros.horaSiniestro,
        fechaCierre: tblSiniestros.fechaCierre,
        montoEstimado: tblSiniestros.montoEstimado,
        montoActualizado: tblSiniestros.montoActualizado,
        montoFinal: tblSiniestros.montoFinal,
        polizaId: tblPolizas.id,
        vehiculo: tblVehiculos.nombre,
        asegurado: tblAsegurados.nombre,
        numeroPoliza: tblPolizas.numeroPoliza,
        numeroSerie: tblPolizas.numeroSerie,
        numeroReporte: tblSiniestros.numeroReporte,
        enSeguimiento: tblSiniestros.enSeguimiento,
    })
        .from(tblSiniestros)
        .leftJoin(tblPolizas, eq(tblPolizas.id, tblSiniestros.polizaId))
        .leftJoin(tblSiniestroCausas, eq(tblSiniestroCausas.id, tblSiniestros.causaId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblSiniestros.conductoId))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblSiniestros.agenteId))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblSiniestros.vehiculoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblSiniestros.aseguradoId))
        .where(
            and(
                ...conditions
            )
        )
        .limit(limit)
        .offset(offset)
        .orderBy(desc(tblSiniestros.fechaSiniestro))

    const [total] = await pgDb.select({ count: count(tblSiniestros.id) }).from(tblSiniestros).leftJoin(tblPolizas, eq(tblPolizas.id, tblSiniestros.polizaId))
        .leftJoin(tblSiniestroCausas, eq(tblSiniestroCausas.id, tblSiniestros.causaId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblSiniestros.conductoId))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblSiniestros.agenteId))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblSiniestros.vehiculoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblSiniestros.aseguradoId))
        .where(and(...conditions))


    return { data: siniestros, total }
}