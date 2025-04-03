import { and, between, count, desc, eq, sum } from "drizzle-orm"

import { tblAgentes, tblConductos, tblModoPagos, tblPolizas, tblRemesas } from "@asurandi/database"
import { pgDb } from "$lib/db.js"

export type ListRemesasGeneral = Awaited<ReturnType<typeof listRemesas>>

export const listRemesas = async ({
    saasId,
    limit = 50,
    offset = 0,
    filters,
    download = false
}: {
    saasId: string,
    limit?: number,
    offset?: number
    filters: string
    download?: boolean
}) => {
    if (download) {
        offset = 0
        limit = 1_000_000_000_000
    }
    let f
    const conditions = [
        eq(tblRemesas.saasId, saasId),
    ]
    try {
        f = JSON.parse(filters)

    } catch {
        f = {}
    }

    if (f.conducto) conditions.push(eq(tblPolizas.conductoId, f.conducto))
    if (f.agente) conditions.push(eq(tblPolizas.agenteId, f.agente))
    if (f.fechaPago && f.fechaPago.start && f.fechaPago.end) {
        const startDate = new Date(
            f.fechaPago.start.year,
            f.fechaPago.start.month - 1,
            f.fechaPago.start.day
        );
        const endDate = new Date(
            f.fechaPago.end.year,
            f.fechaPago.end.month - 1,
            f.fechaPago.end.day
        );
        conditions.push(
            between(tblRemesas.fechaPago, startDate.toISOString(), endDate.toISOString()),
        )
    }


    const remesas = await pgDb.select({
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        polizaId: tblRemesas.polizaId,
        reciboId: tblRemesas.reciboId,
        numeroRecibo: tblRemesas.numeroRecibo,
        numeroPoliza: tblRemesas.numeroPoliza,
        numeroEndoso: tblRemesas.numeroEndoso,
        serie: tblRemesas.serie,
        remesa: tblRemesas.remesa,
        clave: tblRemesas.clave,
        concepto: tblRemesas.concepto,
        fechaPago: tblRemesas.fechaPago,
        importe: tblRemesas.importe,
        porcentajeComision: tblRemesas.porcentajeComision,
        cargo: tblRemesas.cargo,
        abono: tblRemesas.abono,
        modoPago: tblModoPagos.modoPago,
        comisionConducto: tblRemesas.comisionConducto,
        numeroSerie: tblPolizas.numeroSerie,

    })
        .from(tblRemesas)
        .leftJoin(tblPolizas, eq(tblRemesas.polizaId, tblPolizas.id))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblModoPagos, eq(tblModoPagos.id, tblPolizas.modoPagoId))
        .where(and(
            ...conditions
        ))
        .orderBy(desc(tblRemesas.fechaPago), tblRemesas.numeroRecibo, tblRemesas.clave)
        .limit(limit)
        .offset(offset)

    const [total] = await pgDb.select({
        count: count(),
        importe: sum(tblRemesas.importe),
        comision: sum(tblRemesas.comision),
        comisionConducto: sum(tblRemesas.comisionConducto)
    })
        .from(tblRemesas)
        .leftJoin(tblPolizas, eq(tblRemesas.polizaId, tblPolizas.id))
        .where(
            and(
                ...conditions
            )
        )
    return { data: remesas, total }
}