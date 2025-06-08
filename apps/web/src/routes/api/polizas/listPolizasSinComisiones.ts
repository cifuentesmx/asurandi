import { and, between, count, desc, eq, isNull, ilike, lt, or, type SQLWrapper, } from "drizzle-orm"

import {
    tblAgentes, tblAsegurados,
    tblCompanias, tblConductos, tblModoPagos,
    tblPolizaOrigen, tblPolizas, tblRamos, tblServicios, tblSubRamos, tblUsos, tblVehiculos
} from "@asurandi/database"
import { pgDb } from "$lib/db.js"




export type ListPolizasSinComisiones = Awaited<ReturnType<typeof listPolizasSinComisiones>>


export const listPolizasSinComisiones = async ({
    saasId,
    limit,
    offset,
    filters,
    searches,
    download = false
}: {
    saasId: string
    limit: number
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
    const conditions: (SQLWrapper | undefined)[] = [
        eq(tblPolizas.saasId, saasId),
        eq(tblPolizas.esMaestra, true),
        or(
            isNull(tblPolizas.agenteId),
            isNull(tblPolizas.conductoId),
            isNull(tblPolizas.porcentajeComision),
        )
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
    if (f.origen) conditions.push(eq(tblPolizas.origenId, f.origen))
    if (f.fechaEmision && f.fechaEmision.start && f.fechaEmision.end) {
        const startDate = new Date(
            f.fechaEmision.start.year,
            f.fechaEmision.start.month - 1,
            f.fechaEmision.start.day
        );
        const endDate = new Date(
            f.fechaEmision.end.year,
            f.fechaEmision.end.month - 1,
            f.fechaEmision.end.day
        );
        conditions.push(
            between(tblPolizas.fechaEmision, startDate.toISOString(), endDate.toISOString()),
        )
    }
    if (f.vigenciaInicio && f.vigenciaInicio.start && f.vigenciaInicio.end) {
        const startDate = new Date(
            f.vigenciaInicio.start.year,
            f.vigenciaInicio.start.month - 1,
            f.vigenciaInicio.start.day
        );
        const endDate = new Date(
            f.vigenciaInicio.end.year,
            f.vigenciaInicio.end.month - 1,
            f.vigenciaInicio.end.day
        );
        conditions.push(
            between(tblPolizas.vigenciaInicio, startDate.toISOString(), endDate.toISOString()),
        )
    }
    if (f.vigenciaFin && f.vigenciaFin.start && f.vigenciaFin.end) {
        const startDate = new Date(
            f.vigenciaFin.start.year,
            f.vigenciaFin.start.month - 1,
            f.vigenciaFin.start.day
        );
        const endDate = new Date(
            f.vigenciaFin.end.year,
            f.vigenciaFin.end.month - 1,
            f.vigenciaFin.end.day
        );
        conditions.push(
            between(tblPolizas.vigenciaFin, startDate.toISOString(), endDate.toISOString()),
        )
    }


    const searchTerms: SQLWrapper[] = []

    if (s.numeroPoliza && s.numeroPoliza.trim().length > 0) searchTerms.push(eq(tblPolizas.numeroPoliza, s.numeroPoliza.trim()))
    if (s.numeroSerie && s.numeroSerie.trim().length > 0) searchTerms.push(eq(tblPolizas.numeroSerie, `${s.numeroSerie?.toUpperCase().trim()}`))
    if (s.cliente && s.cliente.trim().length > 0) searchTerms.push(ilike(tblAsegurados.nombre, `${s.cliente.trim()}%`))

    conditions.push(or(...searchTerms))

    const sel = {
        id: tblPolizas.id,
        agente: tblAgentes.nombre,
        agenteId: tblPolizas.agenteId,
        conducto: tblConductos.nombre,
        numeroPoliza: tblPolizas.numeroPoliza,
        esMaestra: tblPolizas.esMaestra,
        ramo: tblRamos.ramo,
        subRamo: tblSubRamos.subramo,
        saasId: tblPolizas.saasId,
        compania: tblCompanias.compania,
        vehiculo: tblVehiculos.nombre,
        asegurado: tblAsegurados.nombre,
        uso: tblUsos.uso,
        servicio: tblServicios.servicio,
        placas: tblPolizas.placas,
        numeroSerie: tblPolizas.numeroSerie,
        numeroEconomico: tblPolizas.numeroEconomico,
        polizaAnterior: tblPolizas.polizaAnterior,
        polizaRenovada: tblPolizas.polizaRenovada,
        cobertura: tblPolizas.cobertura,
        totalIncisos: tblPolizas.totalIncisos,
        incisosVigentes: tblPolizas.incisosVigentes,
        inciso: tblPolizas.inciso,
        oficinaEmision: tblPolizas.oficinaEmision,
        porcentajeDescuento: tblPolizas.porcentajeDescuento,
        fechaEmision: tblPolizas.fechaEmision,
        vigenciaInicio: tblPolizas.vigenciaInicio,
        vigenciaFin: tblPolizas.vigenciaFin,
        tarifa: tblPolizas.tarifa,
        moneda: tblPolizas.moneda,
        modoPago: tblModoPagos.modoPago,
        descripcionPago: tblPolizas.descripcionPago,
        periodoGracia: tblPolizas.periodoGracia,
        primaNeta: tblPolizas.primaNeta,
        recargoFinancieroPorcental: tblPolizas.recargoFinacieroPorcentual,
        financiamiento: tblPolizas.financiamiento,
        costoExpedicion: tblPolizas.costoExpedicion,
        subtotal: tblPolizas.subtotal,
        iva: tblPolizas.iva,
        total: tblPolizas.total,
        coberturas: tblPolizas.coberturas,
        polizaEstatus: tblPolizas.polizaEstatus,
        // primaNetaComision: tblPolizas.primaNetaComision,
        porcentajeComision: tblPolizas.porcentajeComision,
        origen: tblPolizaOrigen.origen,
        origenId: tblPolizas.origenId,
    }
    const polizas = await pgDb.select(sel)
        .from(tblPolizas)
        .leftJoin(tblAgentes, eq(tblPolizas.agenteId, tblAgentes.id))
        .leftJoin(tblConductos, eq(tblPolizas.conductoId, tblConductos.id))
        .leftJoin(tblSubRamos, eq(tblPolizas.subRamoId, tblSubRamos.id))
        .leftJoin(tblRamos, eq(tblPolizas.ramoId, tblRamos.id))
        .leftJoin(tblCompanias, eq(tblPolizas.companyId, tblCompanias.id))
        .leftJoin(tblVehiculos, eq(tblPolizas.vehiculoId, tblVehiculos.id))
        .leftJoin(tblAsegurados, eq(tblPolizas.asegurado_id, tblAsegurados.id))
        .leftJoin(tblUsos, eq(tblPolizas.usoId, tblUsos.id))
        .leftJoin(tblServicios, eq(tblPolizas.servicioId, tblServicios.id))
        .leftJoin(tblModoPagos, eq(tblPolizas.modoPagoId, tblModoPagos.id))
        .leftJoin(tblPolizaOrigen, eq(tblPolizas.origenId, tblPolizaOrigen.id))
        .where(
            and(
                ...conditions
            )
        )
        .limit(limit)
        .offset(offset)
        .orderBy(desc(tblPolizas.fechaEmision), desc(tblAgentes.id))

    const [total] = await pgDb.select({ count: count() })
        .from(tblPolizas)
        .leftJoin(tblAsegurados, eq(tblPolizas.asegurado_id, tblAsegurados.id))
        .where(
            and(
                ...conditions
            )
        )

    return { data: polizas, total }
}
