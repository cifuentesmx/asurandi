import { pgDb } from "../../lib/db.js"
import {
    tblAgentes,
    tblAsegurados,
    tblConductos,
    tblRamos,
    tblPolizaOrigen,
    tblPolizas,
    tblVehiculos,
    tblSubRamos,
    tblUsos,
    tblServicios,
    tblModoPagos,
    tblPolizaMovimientos,
    tblSiniestros,
    tblEndosos,
    tblRecibos,
    tblRemesas,
    tblCompanias,
    aseguradosToContactos, tblContactos,
    tblTipoVehiculos,
    tblSiniestroCausas,
    tblTipoEndoso,
} from "@asurandi/database"
import { and, eq, or } from "drizzle-orm"
import { z } from "zod"
import { getPolizaRoute } from "./polizas.routes.js"


export const getOne = async (params: {
    uid: string
    id: number
}): Promise<z.infer<typeof getPolizaRoute['responses'][200]['content']['application/json']['schema']>> => {
    const conditions = and(
        eq(tblPolizas.esMaestra, true),
        or(
            eq(tblAgentes.uid, params.uid),
            eq(tblConductos.uid, params.uid),
        ),
        eq(tblPolizas.id, params.id),
    )
    const [poliza] = await pgDb.select({
        id: tblPolizas.id,
        saasId: tblPolizas.saasId,
        esMaestra: tblPolizas.esMaestra,
        ramoId: tblPolizas.ramoId,
        subRamoId: tblPolizas.subRamoId,
        companyId: tblPolizas.companyId,
        agenteId: tblPolizas.agenteId,
        conductoId: tblPolizas.conductoId,
        vehiculoId: tblPolizas.vehiculoId,
        asegurado_id: tblPolizas.asegurado_id,
        usoId: tblPolizas.usoId,
        servicioId: tblPolizas.servicioId,
        placas: tblPolizas.placas,
        numeroSerie: tblPolizas.numeroSerie,
        numeroEconomico: tblPolizas.numeroEconomico,
        numeroPoliza: tblPolizas.numeroPoliza,
        polizaAnterior: tblPolizas.polizaAnterior,
        polizaRenovada: tblPolizas.polizaRenovada,
        cobertura: tblPolizas.cobertura,
        totalIncisos: tblPolizas.totalIncisos,
        incisosVigentes: tblPolizas.incisosVigentes,
        incisosCancelados: tblPolizas.incisosCancelados,
        inciso: tblPolizas.inciso,
        endoso: tblPolizas.endoso,
        oficinaEmision: tblPolizas.oficinaEmision,
        porcentajeDescuento: tblPolizas.porcentajeDescuento,
        fechaEmision: tblPolizas.fechaEmision,
        vigenciaInicio: tblPolizas.vigenciaInicio,
        vigenciaFin: tblPolizas.vigenciaFin,
        tarifa: tblPolizas.tarifa,
        modoPagoId: tblPolizas.modoPagoId,
        moneda: tblPolizas.moneda,
        descripcionPago: tblPolizas.descripcionPago,
        periodoGracia: tblPolizas.periodoGracia,
        primaNeta: tblPolizas.primaNeta,
        recargoFinacieroPorcentual: tblPolizas.recargoFinacieroPorcentual,
        financiamiento: tblPolizas.financiamiento,
        costoExpedicion: tblPolizas.costoExpedicion,
        subtotal: tblPolizas.subtotal,
        iva: tblPolizas.iva,
        total: tblPolizas.total,
        coberturas: tblPolizas.coberturas,
        polizaEstatus: tblPolizas.polizaEstatus,
        created: tblPolizas.created,
        lastSync: tblPolizas.lastSync,
        origenId: tblPolizas.origenId,
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        asegurado: tblAsegurados.nombre,
        aseguradoDireccion: tblAsegurados.direccion,
        aseguradoRfc: tblAsegurados.rfc,
        aseguradoCelular: tblAsegurados.celular,
        aseguradoEmail: tblAsegurados.email,
        motor: tblVehiculos.motor,
        vehiculo: tblVehiculos.nombre,
        vehiculoDescripcion: tblVehiculos.descripcion,
        vehiculoTipo: tblTipoVehiculos.tipovehiculo,
        vehiculoCarroceria: tblVehiculos.carroceria,
        vehiculoColor: tblVehiculos.color,
        vehiculoOcupantes: tblVehiculos.ocupantes,
        origen: tblPolizaOrigen.origen,
        ramo: tblRamos.ramo,
        subramo: tblSubRamos.subramo,
        uso: tblUsos.uso,
        servicio: tblServicios.servicio,
        modoPago: tblModoPagos.modoPago,
        company: tblCompanias.compania,

    }
    )
        .from(tblPolizas)
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblPolizas.asegurado_id))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblPolizas.vehiculoId))
        .leftJoin(tblPolizaOrigen, eq(tblPolizaOrigen.id, tblPolizas.origenId))
        .leftJoin(tblRamos, eq(tblRamos.id, tblPolizas.ramoId))
        .leftJoin(tblSubRamos, eq(tblSubRamos.id, tblPolizas.subRamoId))
        .leftJoin(tblUsos, eq(tblUsos.id, tblPolizas.usoId))
        .leftJoin(tblServicios, eq(tblServicios.id, tblPolizas.servicioId))
        .leftJoin(tblModoPagos, eq(tblModoPagos.id, tblPolizas.modoPagoId))
        .leftJoin(tblCompanias, eq(tblCompanias.id, tblPolizas.companyId))
        .leftJoin(tblTipoVehiculos, eq(tblTipoVehiculos.id, tblVehiculos.tipovehiculoId))
        .where(conditions)

    const movimientos = await pgDb.select({
        created: tblPolizaMovimientos.created,
        motivo: tblPolizaMovimientos.motivo,
        tipoMovimiento: tblPolizaMovimientos.tipoMovimiento,
        fechaMovimiento: tblPolizaMovimientos.fechaMovimiento,
    })
        .from(tblPolizaMovimientos)
        .where(eq(tblPolizaMovimientos.polizaId, poliza?.id ?? 0))
    const siniestros = await pgDb.select({
        id: tblSiniestros.id,
        saasId: tblSiniestros.saasId,
        polizaId: tblSiniestros.polizaId,
        agenteId: tblSiniestros.agenteId,
        conductoId: tblSiniestros.conductoId,
        aseguradoId: tblSiniestros.aseguradoId,
        vehiculoId: tblSiniestros.vehiculoId,
        causaId: tblSiniestros.causaId,
        companyId: tblSiniestros.companyId,
        polizaPrimaneta: tblSiniestros.polizaPrimaneta,
        numeroSiniestro: tblSiniestros.numeroSiniestro,
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
        created: tblSiniestros.created,
        updated: tblSiniestros.updated,
        actividades: tblSiniestros.actividades,
        numeroReporte: tblSiniestros.numeroReporte,
        enSeguimiento: tblSiniestros.enSeguimiento,
        causa: tblSiniestroCausas.causa
    }).from(tblSiniestros)
        .leftJoin(tblSiniestroCausas, eq(tblSiniestroCausas.id, tblSiniestros.causaId))
        .where(eq(tblSiniestros.polizaId, poliza?.id ?? 0))
    const endosos = await pgDb.select({
        id: tblEndosos.id,
        saasId: tblEndosos.saasId,
        polizaId: tblEndosos.polizaId,
        endoso: tblEndosos.endoso,
        fechaVencimiento: tblEndosos.fechaVencimiento,
        numeroRecibo: tblEndosos.numeroRecibo,
        remesa: tblEndosos.remesa,
        fechaPago: tblEndosos.fechaPago,
        fechaRegistroPago: tblEndosos.fechaRegistroPago,
        importe: tblEndosos.importe,
        estado: tblEndosos.estado,
        tipoEndosoId: tblEndosos.tipoEndosoId,
        created: tblEndosos.created,
        tipoEndoso: tblTipoEndoso.tipoEndoso
    }).from(tblEndosos)
        .leftJoin(tblTipoEndoso, eq(tblTipoEndoso.id, tblEndosos.tipoEndosoId))
        .where(eq(tblEndosos.polizaId, poliza?.id ?? 0))

    const recibos = await pgDb.select({
        id: tblRecibos.id,
        saasId: tblRecibos.saasId,
        polizaId: tblRecibos.polizaId,
        numeroRecibo: tblRecibos.numeroRecibo,
        serie: tblRecibos.serie,
        folio: tblRecibos.folio,
        serieEmision: tblRecibos.serieEmision,
        importe: tblRecibos.importe,
        primaNetaComision: tblRecibos.primaNetaComision,
        vigenciaInicio: tblRecibos.vigenciaInicio,
        vigenciaFin: tblRecibos.vigenciaFin,
        estado: tblRecibos.estado,
        created: tblRecibos.created,
    }).from(tblRecibos)
        .where(eq(tblRecibos.polizaId, poliza?.id ?? 0))

    const remesas = await pgDb.select({
        id: tblRemesas.id,
        saasId: tblRemesas.saasId,
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
        comision: tblRemesas.comision,
        cargo: tblRemesas.cargo,
        abono: tblRemesas.abono,
        contabilizado: tblRemesas.contabilizado,
        porcentajeComision: tblRemesas.porcentajeComision,
        comisionConducto: tblRemesas.comisionConducto,
        created: tblRemesas.created,
    }
    ).from(tblRemesas)
        .where(eq(tblRemesas.polizaId, poliza?.id ?? 0))

    const contactos = await pgDb.select({
        id: tblContactos.id,
        saasId: tblContactos.saasId,
        agenteId: tblContactos.agenteId,
        conductoId: tblContactos.conductoId,
        nombre: tblContactos.nombre,
        email: tblContactos.email,
        rfc: tblContactos.rfc,
        telefono: tblContactos.telefono,
        direccion: tblContactos.direccion,
        ciudad: tblContactos.ciudad,
        pais: tblContactos.pais,
        fechaNacimiento: tblContactos.fechaNacimiento,
        esCliente: tblContactos.esCliente,
        fechaCreacion: tblContactos.fechaCreacion,
        fechaConversion: tblContactos.fechaConversion,
        fechaActualizacion: tblContactos.fechaActualizacion,
        created: tblContactos.created,
    }).from(aseguradosToContactos)
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, aseguradosToContactos.aseguradoId))
        .leftJoin(tblContactos, eq(tblContactos.id, aseguradosToContactos.contactoId))
        .where(and(

            eq(aseguradosToContactos.aseguradoId, poliza.asegurado_id ?? 0),
            or(
                eq(tblContactos.agenteId, poliza.agenteId ?? 0),
                eq(tblContactos.conductoId, poliza.conductoId ?? 0),
            )
        ))

    const value = { poliza, movimientos, siniestros, endosos, recibos, remesas, contactos }
    return value
}
