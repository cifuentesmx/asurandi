import { and, eq, InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { tblPolizaMovimientos, tblPolizas } from "@asurandi/database"
import { ScrappedFlotaInciso } from "@asurandi/types"
import { pgDb } from "../db.js"
import { getVehiculo } from "./getVehiculo.js"
import { getUso } from "./getUso.js"
import { getServicio } from "./getServicio.js"
import { getNumber, getNumberString } from "./getNumber.js"
import { getFechaEmision } from "./getFechaEmision.js"
import { getText } from "./getText.js"
import { getVigencias } from "./getVigencias.js"
import { getMoneda } from "./getMoneda.js"
import { getPeriodoGracia } from "./getPeriodoGracia.js"
import { getPrimaNetaComision } from "./getPrimaNetaComision.js"
import { processQualitasScrappedRecibos } from "./processRecibos.js"
import { processQualitasScrappedEndosos } from "./processEndosos.js"
import { processQualitasScrappedSiniestros } from "./processSiniestros.js"

export const qualitasScrappedInciso = async (poliza: InferSelectModel<typeof tblPolizas>,
    inciso: ScrappedFlotaInciso): Promise<void> => {
    if (!poliza.id) throw new Error("No se ha encontrado la poliza maestra para procesar el inciso");
    const serialData = inciso.polizaInciso.serialData

    if (!poliza.numeroPoliza) throw new Error("No se encontró el número de póliza en los datos extraidos.");
    if (!poliza.saasId) throw new Error("No se encontró el SAASID en los datos extraidos.");

    let [existingInciso] = await pgDb.select().from(tblPolizas).where(
        and(
            eq(tblPolizas.saasId, poliza.saasId),
            eq(tblPolizas.numeroPoliza, poliza.numeroPoliza),
            eq(tblPolizas.inciso, inciso.inciso),
            eq(tblPolizas.esMaestra, false),
        )
    )
    const vehiculo = await getVehiculo(serialData, poliza.saasId, existingInciso?.vehiculoId ?? undefined)
    const uso = await getUso(serialData)
    const servicio = await getServicio(serialData)
    const porcentajeDescuento = getNumber(serialData, '% Desc')?.[0]?.toFixed(2) ?? undefined
    const fechaEmision = getFechaEmision(getText(serialData, 'Fecha de emisión'))
    const vigenciaInicio = getVigencias(serialData, 'Inicio vigencia póliza')
    const vigenciaFin = getVigencias(serialData, 'Fin vigencia póliza')
    const comision = poliza.porcentajeComision

    const usPoliza: InferInsertModel<typeof tblPolizas> = {
        agenteId: poliza.agenteId,
        asegurado_id: poliza.asegurado_id,
        cobertura: inciso.cobertura,
        coberturas: inciso.polizaInciso.coberturas,
        companyId: 'qualitas',
        conductoId: poliza.conductoId,
        descripcionPago: getText(serialData, 'Pagos'),
        esMaestra: false,
        inciso: inciso.inciso,
        modoPagoId: poliza.modoPagoId,
        numeroPoliza: poliza.numeroPoliza,
        numeroSerie: vehiculo?.serie ?? getText(serialData, 'Número de serie'),
        oficinaEmision: poliza.oficinaEmision ?? getText(serialData, 'Oficina de emisión'),
        placas: getText(serialData, 'Placas'),
        polizaAnterior: getText(serialData, 'Póliza anterior'),
        polizaRenovada: getText(serialData, 'Póliza renovada'),
        ramoId: poliza.ramoId,
        subRamoId: poliza.subRamoId,
        saasId: poliza.saasId,
        servicioId: servicio?.id,
        tarifa: getText(serialData, 'Tarifa aplicada'),
        usoId: uso?.id,
        vehiculoId: vehiculo?.id,
        porcentajeDescuento,
        fechaEmision,
        vigenciaFin,
        vigenciaInicio,
        moneda: getMoneda(serialData),
        periodoGracia: getPeriodoGracia(serialData),
        primaNeta: getNumberString(serialData, 'Prima neta'),
        financiamiento: getNumberString(serialData, 'Tasa Fin. P. F.'),
        costoExpedicion: getNumberString(serialData, 'Expedición de póliza'),
        subtotal: getNumberString(serialData, 'Subtotal'),
        iva: getNumberString(serialData, 'Iva'),
        total: getNumberString(serialData, 'Importe total'),
        primaNetaComision: comision ? await getPrimaNetaComision(serialData, comision) : null,
        porcentajeComision: comision,
        totalIncisos: 0,
        incisosCancelados: 0,
        incisosVigentes: 0,
        numeroEconomico: inciso.numero_economico,
        endoso: inciso.endoso,
        recargoFinacieroPorcentual: poliza.recargoFinacieroPorcentual ?? getNumberString(serialData, 'Recargo financiero')?.replace('&', ''),
        lastSync: new Date().toISOString(),
        claveAgente: poliza.claveAgente,
        origenId: poliza.origenId,
    }


    if (existingInciso) {
        [existingInciso] = await pgDb.update(tblPolizas).set(usPoliza).where(eq(tblPolizas.id, existingInciso.id)).returning()
    } else {
        await pgDb.transaction(async tx => {
            [existingInciso] = await tx.insert(tblPolizas).values(usPoliza).returning()
            await tx.insert(tblPolizaMovimientos).values({
                agenteId: existingInciso.agenteId,
                aseguradoId: existingInciso.asegurado_id,
                companyId: existingInciso.companyId,
                conductoId: existingInciso.conductoId,
                fechaMovimiento: sql`now()`,
                numeroPoliza: existingInciso.numeroPoliza,
                saasId: existingInciso.saasId,
                vehiculoId: existingInciso.vehiculoId,
                polizaId: existingInciso.id,
                motivo: `Registro inicial de iniciso`,
                tipoMovimiento: 'REGISTRO'
            })


        })
    }

    if (inciso.polizaInciso.recibos) await processQualitasScrappedRecibos(poliza, inciso.polizaInciso.recibos)
    if (inciso.polizaInciso.statusPoliza) await processQualitasScrappedEndosos(poliza, inciso.polizaInciso.statusPoliza)
    if (inciso.polizaInciso.siniestros) await processQualitasScrappedSiniestros(existingInciso, inciso.polizaInciso.siniestros)
    return
}