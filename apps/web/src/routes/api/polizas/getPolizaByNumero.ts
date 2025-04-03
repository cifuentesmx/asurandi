import { and, asc, desc, eq, sql, } from "drizzle-orm"

import { tblAgentes, tblAsegurados, tblCompanias, tblConductos, tblEndosos, tblModoPagos, tblPolizaMovimientos, tblPolizaOrigen, tblPolizas, tblRamos, tblRecibos, tblServicios, tblSiniestroCausas, tblSiniestros, tblSubRamos, tblTipoEndoso, tblUsos, tblVehiculos } from "@asurandi/database"
import { pgDb } from "$lib/db.js"


// export type GetPolizaByNumero = Awaited<ReturnType<typeof getPolizaByNumero>>


export const getPolizaByNumero = async ({
    saasId,
    numeroPoliza
}: {
    saasId: string
    numeroPoliza: string
}) => {

    const sel = {
        id: tblPolizas.id,
        agente: tblAgentes.alias,
        agenteId: tblPolizas.agenteId,
        agenteNombre: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        conductoId: tblPolizas.conductoId,
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
        porcentajeComision: tblPolizas.porcentajeComision,
        siniestros: sql`null`,
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
                eq(tblPolizas.saasId, saasId),
                eq(tblPolizas.numeroPoliza, numeroPoliza)
            )
        )
        .orderBy(desc(tblPolizas.esMaestra), asc(tblPolizas.inciso))

    const endosos = []
    const recibos = []
    const movimientos = await pgDb.select({
        tipoMovimiento: tblPolizaMovimientos.tipoMovimiento,
        fechaMovimiento: tblPolizaMovimientos.fechaMovimiento,
        motivo: tblPolizaMovimientos.motivo,
        created: tblPolizaMovimientos.created,
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,

    })
        .from(tblPolizaMovimientos)
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizaMovimientos.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizaMovimientos.conductoId))
        .where(and(
            eq(tblPolizaMovimientos.polizaId, polizas[0].id)
        ))
        .orderBy(tblPolizaMovimientos.fechaMovimiento)

    for (let idx = 0; idx < polizas.length; idx++) {
        recibos.push(...(await pgDb.select().from(tblRecibos)
            // .leftJoin(tblTipoEndoso, eq(tblEndosos.tipoEndosoId, tblTipoEndoso.id))
            .where(eq(tblRecibos.polizaId, polizas[idx].id))))

        endosos.push(...(await pgDb.select({
            id: tblEndosos.id,
            endoso: tblEndosos.endoso,
            fechaVencimiento: tblEndosos.fechaVencimiento,
            numeroRecibo: tblEndosos.numeroRecibo,
            remesa: tblEndosos.remesa,
            fechaPago: tblEndosos.fechaPago,
            fechaRegistroPago: tblEndosos.fechaRegistroPago,
            importe: tblEndosos.importe,
            estado: tblEndosos.estado,
            tipoEndoso: tblTipoEndoso.tipoEndoso,
        })
            .from(tblEndosos)
            .leftJoin(tblTipoEndoso, eq(tblEndosos.tipoEndosoId, tblTipoEndoso.id))
            .where(eq(tblEndosos.polizaId, polizas[idx].id))
        )
        )

        polizas[idx].siniestros = await pgDb.select({
            id: tblSiniestros.id,
            polizaPrimaneta: tblSiniestros.polizaPrimaneta,
            numeroSiniestro: tblSiniestros.numeroSiniestro,
            causa: tblSiniestroCausas.causa,
            montoEstimado: tblSiniestros.montoEstimado,
            montoActualizado: tblSiniestros.montoActualizado,
            montoFinal: tblSiniestros.montoFinal,
            fechaSiniestro: tblSiniestros.fechaSiniestro,
            horaSiniestro: tblSiniestros.horaSiniestro,
            fechaReporte: tblSiniestros.fechaReporte,
            horaReporte: tblSiniestros.horaReporte,
            fechaCierre: tblSiniestros.fechaCierre,
            codigoPostal: tblSiniestros.codigoPostal,
            detalle: tblSiniestros.detalle,

        })
            .from(tblSiniestros)
            .leftJoin(tblSiniestroCausas, eq(tblSiniestros.causaId, tblSiniestroCausas.id))
            .leftJoin(tblAgentes, eq(tblSiniestros.causaId, tblAgentes.id))
            .leftJoin(tblConductos, eq(tblSiniestros.causaId, tblConductos.id))
            .where(eq(tblSiniestros.polizaId, polizas[idx].id))
            .orderBy(tblSiniestros.numeroSiniestro)
    }

    return {
        polizas,
        endosos: endosos.sort((a, b) => {
            if (!a.numeroRecibo || !b.numeroRecibo) return -1
            return a.numeroRecibo.localeCompare(b.numeroRecibo ?? '0')
        }),
        recibos: recibos.sort((a, b) => {
            if (!a.numeroRecibo || !b.numeroRecibo) return -1
            return a.numeroRecibo.localeCompare(b.numeroRecibo ?? '0')
        }),
        movimientos
    }
}