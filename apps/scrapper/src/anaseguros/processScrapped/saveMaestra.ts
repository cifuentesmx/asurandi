import { PolizaMetaData, PublicFileUrl } from "@asurandi/types"
import { type DataFromPdf } from "./extactDataFromPdf.js"
import { type ScrappedAnasegurosPoliza } from "../scrapePoliza.js"
import { tblPolizaMovimientos, tblPolizas } from "@asurandi/database"
import { and, eq, InferInsertModel, sql } from "drizzle-orm"
import { pgDb } from "../../database/db.js"
import { getAgente } from "./getAgenteId.js"
import { getAseguradoId } from "./getAseguradoId.js"
import { getInciso } from "./getInciso.js"
import { getVehiculoId } from "./getVehiculoId.js"
import { extractCleanNumber } from "../../utils/extractCleanNumber.js"
import { getOrigenId } from "../../database/getOrigenId.js"
import { getAllCuentas } from "../../database/qualitas/getAllCuentas.js"
import { getRamoId } from "../../database/getRamoId.js"
import { getSubRamo } from "../../database/getSubRamo.js"
import { getServicio } from "../../database/getServicio.js"
import { getModoPago } from "../../database/getModoPago.js"
import { getUso } from "../../database/getUso.js"
import { getConducto } from "../../database/getConducto.js"
import { processRecibos } from "./processRecibos.js"

export const saveMaestra = async (
    poliza: ScrappedAnasegurosPoliza,
    data: (DataFromPdf & { publicFileUrl: PublicFileUrl }) | null,
    saasId: string) => {
    let [existingPoliza] = await pgDb.select()
        .from(tblPolizas)
        .where(and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.numeroPoliza, poliza.poliza),
            eq(tblPolizas.endoso, poliza.endoso),
            eq(tblPolizas.companyId, 'anaseguros')
        ))
    if (!data && existingPoliza) {
        data = existingPoliza.metaData?.anaseguros?.dataFromPdf as DataFromPdf & { publicFileUrl: PublicFileUrl }
    }

    if (!data) throw new Error("No se recibieron los datos de la poliza");

    const metaData: PolizaMetaData = {
        ...existingPoliza?.metaData,
        anaseguros: {
            dataFromPdf: data,
            dataFromScrapping: poliza,
        },
        polizaPublicUrl: data.publicFileUrl,
    }

    if (!data.incisos) throw new Error("No se recibieron los datos de los incisos de la poliza");

    const agente = await getAgente(poliza.agente, saasId)
    const conducto = agente ? await getConducto(poliza.poliza, agente, saasId) : null

    const fechaEmision = data.poliza.fechaEmision.anio && data.poliza.fechaEmision.mes && data.poliza.fechaEmision.dia ?
        `${data.poliza.fechaEmision.anio}-${data.poliza.fechaEmision.mes}-${data.poliza.fechaEmision.dia}` :
        undefined

    const inicioVigencia = data.poliza.inicioVigencia.anio && data.poliza.inicioVigencia.mes && data.poliza.inicioVigencia.dia ?
        `${data.poliza.inicioVigencia.anio}-${data.poliza.inicioVigencia.mes}-${data.poliza.inicioVigencia.dia}` :
        undefined
    const finVigencia = data.poliza.finVigencia.anio && data.poliza.finVigencia.mes && data.poliza.finVigencia.dia ?
        `${data.poliza.finVigencia.anio}-${data.poliza.finVigencia.mes}-${data.poliza.finVigencia.dia}` :
        undefined

    const inciso = getInciso(data.incisos, '0000')

    const total = extractCleanNumber(inciso.pago?.prima_total ?? '0')
    const iva = extractCleanNumber(inciso.pago?.iva ?? '0')
    const subtotal = Number(total) - Number(iva)
    const [origenId, motivo] = existingPoliza
        ? [existingPoliza.origenId, '']
        : await getOrigenId({
            numeroPoliza: poliza.poliza,
            saasId,
            numeroSerie: inciso.vehiculo?.serie ?? 'N/A',
            inicio: fechaEmision ?? '',
            cuentas: await getAllCuentas(saasId),
            emision: fechaEmision ?? ''
        })

    const subRamoId = existingPoliza?.subRamoId ?? (await getSubRamo(inciso.vehiculo?.tipo ?? 'AUTOMOVIL')).id

    const usPoliza: InferInsertModel<typeof tblPolizas> = {
        saasId,
        numeroPoliza: existingPoliza?.numeroPoliza ?? poliza.poliza,
        endoso: existingPoliza?.endoso ?? poliza.endoso,
        inciso: existingPoliza?.inciso ?? inciso.inciso,
        companyId: existingPoliza?.companyId ?? 'anaseguros',
        agenteId: existingPoliza?.agenteId ?? agente?.id ?? null,
        asegurado_id: existingPoliza?.asegurado_id ?? await getAseguradoId(data, saasId),
        claveAgente: existingPoliza?.claveAgente ?? `${poliza.agente}-AGENTE`,
        esMaestra: true,
        fechaEmision: existingPoliza?.fechaEmision ?? fechaEmision,
        vigenciaInicio: existingPoliza?.vigenciaInicio ?? inicioVigencia,
        vigenciaFin: existingPoliza?.vigenciaFin ?? finVigencia,
        vehiculoId: existingPoliza?.vehiculoId ?? await getVehiculoId(inciso.vehiculo, saasId),
        numeroSerie: existingPoliza?.numeroSerie ?? inciso.vehiculo?.serie ?? 'N/A',
        cobertura: existingPoliza?.cobertura ?? data.poliza.cobertura ?? 'N/A',
        placas: existingPoliza?.placas ?? inciso.vehiculo?.placas ?? 'N/A',
        primaNeta: existingPoliza?.primaNeta ?? extractCleanNumber(inciso.pago?.prima_neta ?? '0'),
        costoExpedicion: existingPoliza?.costoExpedicion ?? extractCleanNumber(inciso.pago?.gastos_expedicion ?? '0'),
        total: existingPoliza?.total ?? total,
        iva: existingPoliza?.iva ?? iva,
        subtotal: existingPoliza?.subtotal ?? subtotal.toString(),
        moneda: existingPoliza?.moneda ?? 'MXN',
        recargos: existingPoliza?.recargos ?? extractCleanNumber(inciso.pago?.recargos ?? '0'),
        origenId: existingPoliza?.origenId ?? origenId,
        ramoId: existingPoliza?.ramoId ?? await getRamoId('Autos'),
        servicioId: existingPoliza?.servicioId ?? (await getServicio(inciso.vehiculo?.servicio ?? 'N/A'))?.id ?? null,
        modoPagoId: existingPoliza?.modoPagoId ?? (await getModoPago(inciso.pago?.forma_pago ?? 'N/A'))?.id ?? null,
        usoId: existingPoliza?.usoId ?? (await getUso(inciso.vehiculo?.uso ?? 'N/A'))?.id ?? null,
        conductoId: existingPoliza?.conductoId ?? conducto?.id ?? null,
        periodoGracia: existingPoliza?.periodoGracia ?? null,
        polizaEstatus: existingPoliza?.polizaEstatus ?? 'Emitida',
        subRamoId,
        coberturas: existingPoliza?.coberturas ?? null,
        descripcionPago: existingPoliza?.descripcionPago ?? null,
        financiamiento: existingPoliza?.financiamiento ?? null,
        numeroEconomico: existingPoliza?.numeroEconomico ?? null,
        oficinaEmision: existingPoliza?.oficinaEmision ?? null,
        polizaAnterior: existingPoliza?.polizaAnterior ?? null,
        polizaRenovada: existingPoliza?.polizaRenovada ?? null,
        porcentajeDescuento: existingPoliza?.porcentajeDescuento ?? null,
        porcentajeComision: existingPoliza?.porcentajeComision ?? null,
        primaNetaComision: existingPoliza?.primaNetaComision ?? null,
        recargoFinacieroPorcentual: existingPoliza?.recargoFinacieroPorcentual ?? null,
        incisosCancelados: existingPoliza?.incisosCancelados ?? null,
        incisosVigentes: existingPoliza?.incisosVigentes ?? null,
        totalIncisos: existingPoliza?.totalIncisos ?? null,
        tarifa: existingPoliza?.tarifa ?? null,
        metaData: metaData
    }

    if (existingPoliza) {
        [existingPoliza] = await pgDb.update(tblPolizas).set(usPoliza).where(eq(tblPolizas.id, existingPoliza.id)).returning()
    } else {
        await pgDb.transaction(async tx => {
            [existingPoliza] = await tx.insert(tblPolizas).values(usPoliza).returning()
            await tx.insert(tblPolizaMovimientos).values({
                agenteId: existingPoliza.agenteId,
                aseguradoId: existingPoliza.asegurado_id,
                companyId: existingPoliza.companyId,
                conductoId: existingPoliza.conductoId,
                fechaMovimiento: sql`now()`,
                numeroPoliza: existingPoliza.numeroPoliza,
                saasId,
                vehiculoId: existingPoliza.vehiculoId,
                polizaId: existingPoliza.id,
                motivo: `Registro inicial: Origen - ${motivo}`,
                tipoMovimiento: 'REGISTRO'
            })
        })
    }

    await processRecibos(existingPoliza, poliza)

    // TODO: Procesar incisos
    // TODO: Procesar renovadas
    // TODO: Procesar canceladas
    // TODO: Procesar por vencer
    // TODO: Procesar por cobrar 
    // TODO: Procesar pagadas
    // TODO: Procesar no renovadas

    await pgDb.update(tblPolizas).set({
        lastSync: new Date().toISOString(),
    }).where(eq(tblPolizas.id, existingPoliza.id))

    return
}
