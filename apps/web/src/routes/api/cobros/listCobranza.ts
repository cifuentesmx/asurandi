import { and, between, count, eq, ilike, sum } from "drizzle-orm"

import { tblAgentes, tblAsegurados, tblCobros, tblConductos, tblPolizas } from "@asurandi/database"
import { pgDb } from "$lib/db.js"

export type ListCobranza = Awaited<ReturnType<typeof listCobranza>>

export const listCobranza = async ({
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
    download?: boolean
}) => {

    if (download) {
        offset = 0
        limit = 1_000_000_000_000
    }
    const conditions = [
        eq(tblCobros.saasId, saasId),
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

    if (f.fechaLimite && f.fechaLimite.start && f.fechaLimite.end) {
        const startDate = new Date(
            f.fechaLimite.start.year,
            f.fechaLimite.start.month - 1,
            f.fechaLimite.start.day
        );
        const endDate = new Date(
            f.fechaLimite.end.year,
            f.fechaLimite.end.month - 1,
            f.fechaLimite.end.day
        );
        conditions.push(
            between(tblCobros.fechaLimite, startDate.toISOString(), endDate.toISOString())
        )
    }

    if (f.agente) conditions.push(eq(tblPolizas.agenteId, f.agente))
    if (f.conducto) conditions.push(eq(tblPolizas.conductoId, f.conducto))
    if (f.estado) conditions.push(eq(tblCobros.estado, f.estado))

    if (s.numeroPoliza) conditions.push(eq(tblCobros.numeroPoliza, s.numeroPoliza.trim()))
    if (s.numeroSerie) conditions.push(eq(tblPolizas.numeroSerie, s.numeroPoliza.trim()))
    if (s.cliente) conditions.push(ilike(tblAsegurados.nombre, `${s.cliente}%`))

    const cobros = await pgDb.select({
        id: tblCobros.id,
        saasId: tblCobros.saasId,
        polizaId: tblCobros.polizaId,
        numeroPoliza: tblCobros.numeroPoliza,
        endoso: tblCobros.endoso,
        fechaVencimiento: tblCobros.fechaVencimiento,
        fechaLimite: tblCobros.fechaLimite,
        estado: tblCobros.estado,
        company: tblCobros.company,
        serie: tblCobros.serie,
        numeroRecibo: tblCobros.numeroRecibo,
        importe: tblCobros.importe,
        created: tblCobros.created,
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        cliente: tblAsegurados.nombre
    })
        .from(tblCobros)
        .leftJoin(tblPolizas, eq(tblCobros.polizaId, tblPolizas.id))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .where(
            and(
                ...conditions
            )
        )
        .offset(offset)
        .limit(limit)
        .orderBy(tblCobros.fechaVencimiento, tblConductos.nombre, tblAgentes.nombre)

    const [total] = await pgDb.select({
        count: count(), importe: sum(tblCobros.importe)
    })
        .from(tblCobros)
        .leftJoin(tblPolizas, eq(tblCobros.polizaId, tblPolizas.id))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .where(
            and(
                ...conditions
            )
        )


    return { data: cobros, total }
}
