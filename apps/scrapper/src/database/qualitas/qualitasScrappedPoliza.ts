import { and, eq, InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { PolizasToScrapeFromDaily, ScrappedPoliza, ScrappedPolizaEvent } from "@asurandi/types"
import { pgDb } from "../db.js"
import { tblAgentes, tblConductos, tblPolizaMovimientos, tblPolizas, } from "@asurandi/database"
import { getAgente } from "./getAgente.js"
import { getConducto } from "./getConducto.js"
import { getRamoId } from "./getRamoId.js"
import { getVehiculo } from "./getVehiculo.js"
import { getAsegurado } from "./getAsegurado.js"
import { getUso } from "./getUso.js"
import { getServicio } from "./getServicio.js"
import { getModoPago } from "./getModoPago.js"
import { getSubRamoId } from "./getSubRamo.js"
import { getText } from "./getText.js"
import { getNumber, getNumberString } from "./getNumber.js"
import { getFechaEmision } from "./getFechaEmision.js"
import { getVigencias } from "./getVigencias.js"
import { getMoneda } from "./getMoneda.js"
import { getPeriodoGracia } from "./getPeriodoGracia.js"
import { getPrimaNetaComision } from "./getPrimaNetaComision.js"
import { processQualitasScrappedRecibos } from "./processRecibos.js"
import { processQualitasScrappedSiniestros } from "./processSiniestros.js"
import { processQualitasScrappedEndosos } from "./processEndosos.js"
import { getOrigenId } from "./getOrigenId.js"
import { getAllCuentas } from "./getAllCuentas.js"
import { processCancelada } from "../processCancelada.js"
import { processNoRenovada } from "../processNoRenovada.js";
import { processPagada } from '../processPagada.js';
import { processPorCobrar } from "../processPorCobrar.js";
import { processPorRenovar } from "../processPorRenovar.js";
import { processRenovada } from "../processRenovada.js";
import { processPorVencer } from "../processPorVencer.js";


export async function qualitasScrappedPoliza(scrapped: ScrappedPolizaEvent, claveAgente: string, dataFromDailyScrapper: PolizasToScrapeFromDaily | undefined): Promise<void> {
    const saasId = scrapped.saasId
    const poliza = scrapped.payload as ScrappedPoliza
    const cuentas = await getAllCuentas(saasId)

    if (!saasId) throw new Error("No se ha encontrado la cuenta SAASID para la poliza recibida.");
    if (!poliza) throw new Error("No se ha recibido una poliza para actualizar la base de datos.");
    if (!poliza.resumen) throw new Error("No se encontraron datos extraidos del resumen de la poliza.");

    const serialData = poliza.resumen.serialData
    const numeroPoliza = (serialData.find(d => d.key === 'Número de póliza'))?.value?.trim() ?? null
    const inciso = (serialData.find(d => d.key === 'Inciso'))?.value?.trim() ?? null
    if (!numeroPoliza) throw new Error("No se encontró el número de póliza en los datos extraidos.");
    if (!inciso) throw new Error("No se encontró el número de inciso en los datos extraidos.");

    let [existingPoliza] = await pgDb.select().from(tblPolizas).where(
        and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.numeroPoliza, numeroPoliza),
            eq(tblPolizas.inciso, inciso),
            eq(tblPolizas.esMaestra, true),
        )
    )

    const [existingInciso] = await pgDb.select().from(tblPolizas).where(
        and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.numeroPoliza, numeroPoliza),
            eq(tblPolizas.inciso, inciso)
        )
    )

    if (!existingPoliza && existingInciso) {
        throw new Error(`Inconsistencia encontrada para la poliza ${numeroPoliza} ${inciso}.
            No existe una poliza maestra pero se encontró un inciso con el mismo
            número de póliza y el mismo número de inciso.
            ¿Es una poliza de flotillas que ya no está vigente?`)
    }

    const agente: InferSelectModel<typeof tblAgentes> = existingPoliza && existingPoliza.agenteId
        ? (await pgDb.select().from(tblAgentes).where(eq(tblAgentes.id, existingPoliza.agenteId)).limit(1))[0]
        : await getAgente(serialData, saasId)

    const conducto = (existingPoliza && existingPoliza.conductoId
        ? (await pgDb.select().from(tblConductos).where(eq(tblConductos.id, existingPoliza.conductoId)).limit(1))[0]
        : await getConducto(numeroPoliza, agente, saasId)) as InferSelectModel<typeof tblConductos> | null

    const numeroSerie = getText(serialData, 'Número de serie')
    const ramoId = existingPoliza?.ramoId ?? await getRamoId()
    const vehiculo = await getVehiculo(serialData, saasId, existingPoliza?.vehiculoId ?? undefined)
    const asegurado = await getAsegurado(serialData, saasId, agente?.id ?? null, conducto?.id ?? null)
    const uso = await getUso(serialData)
    const servicio = await getServicio(serialData)
    const modoPago = await getModoPago(serialData)
    const subRamo = await getSubRamoId(serialData)
    const porcentajeDescuento = getNumber(serialData, '% Desc')?.[0]?.toFixed(2) ?? undefined
    const fechaEmision = getFechaEmision(getText(serialData, 'Fecha de emisión'))
    const vigenciaInicio = getVigencias(serialData, 'Inicio vigencia póliza')
    const vigenciaFin = getVigencias(serialData, 'Fin vigencia póliza')
    const comision = existingPoliza?.porcentajeComision ?? '0.8'
    const [_origenId, motivo]: [number, string] = await getOrigenId({ numeroPoliza, saasId, numeroSerie, inicio: vigenciaInicio ?? '', cuentas, emision: fechaEmision ?? '' })
    const origenId = existingPoliza?.origenId ?? _origenId

    const usPoliza: InferInsertModel<typeof tblPolizas> = {
        agenteId: agente.id,
        asegurado_id: asegurado.id,
        cobertura: getText(serialData, 'Cobertura'),
        coberturas: poliza.resumen.coberturas,
        companyId: 'qualitas',
        conductoId: conducto?.id,
        descripcionPago: getText(serialData, 'Pagos'),
        esMaestra: true,
        inciso: getText(serialData, 'Inciso'),
        modoPagoId: modoPago?.id,
        numeroPoliza: getText(serialData, 'Número de póliza'),
        numeroSerie,
        oficinaEmision: getText(serialData, 'Oficina de emisión'),
        placas: getText(serialData, 'Placas'),
        polizaAnterior: getText(serialData, 'Póliza anterior'),
        polizaRenovada: getText(serialData, 'Póliza renovada'),
        ramoId: ramoId,
        subRamoId: subRamo.id,
        saasId,
        servicioId: servicio?.id,
        tarifa: getText(serialData, 'Tarifa aplicada'),
        totalIncisos: 1,
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
        lastSync: new Date().toISOString(),
        claveAgente,
        origenId,
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

    if (poliza.recibos) await processQualitasScrappedRecibos(existingPoliza, poliza.recibos)
    if (poliza.estatus?.endosos) await processQualitasScrappedEndosos(existingPoliza, poliza.estatus.endosos)
    if (poliza.siniestros) await processQualitasScrappedSiniestros(existingPoliza, poliza.siniestros)


    if (dataFromDailyScrapper?.canceladas) await processCancelada(dataFromDailyScrapper.canceladas)
    if (dataFromDailyScrapper?.noRenovadas) await processNoRenovada(dataFromDailyScrapper.noRenovadas)
    if (dataFromDailyScrapper?.pagadas) await processPagada(dataFromDailyScrapper.pagadas)
    if (dataFromDailyScrapper?.porCobrar) await processPorCobrar(dataFromDailyScrapper.porCobrar, saasId)
    if (dataFromDailyScrapper?.porRenovar) await processPorRenovar(dataFromDailyScrapper.porRenovar, saasId)
    if (dataFromDailyScrapper?.renovadas) await processRenovada(dataFromDailyScrapper.renovadas)
    if (dataFromDailyScrapper?.porVencer) await processPorVencer(dataFromDailyScrapper.porVencer)

    return
}
