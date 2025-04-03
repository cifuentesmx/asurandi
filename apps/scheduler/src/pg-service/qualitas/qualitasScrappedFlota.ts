import { and, eq, InferInsertModel, InferSelectModel, isNull, sql } from "drizzle-orm";
import { getAgente } from "./getAgente.js";
import { getConducto } from "./getConducto.js";
import { getRamoId } from "./getRamoId.js";
import { getAsegurado } from "./getAsegurado.js";
import { getModoPago } from "./getModoPago.js";
import { getSubRamoId } from "./getSubRamo.js";
import { getText } from "./getText.js";
import { getNumber, getNumberString } from "./getNumber.js";
import { getFechaEmision } from "./getFechaEmision.js";
import { getVigencias } from "./getVigencias.js";
import { getMoneda } from "./getMoneda.js";
import { getPeriodoGracia } from "./getPeriodoGracia.js";
import { getPrimaNetaComision } from "./getPrimaNetaComision.js";
import { qualitasScrappedInciso } from "./qualitasScrappedInciso.js";
import { pgDb } from "../db.js";
import { QualitasScrappedFlota, ScrappedPolizaEvent } from "@asurandi/types";
import { getOrigenId } from "./getOrigenId.js";
import { getAllCuentas } from "./getAllCuentas.js";
import { tblPolizas, tblAgentes, tblConductos, tblPolizaMovimientos } from "@asurandi/database"

export async function qualitasScrappedFlota(scrapped: ScrappedPolizaEvent, claveAgente: string): Promise<void> {
    const saasId = scrapped.saasId
    const poliza = scrapped.payload as QualitasScrappedFlota

    const cuentas = await getAllCuentas(saasId)

    if (!saasId) throw new Error("No se ha encontrado la cuenta SAASID para la poliza recibida.");
    if (!poliza) throw new Error("No se ha recibido una poliza para actualizar la base de datos.");
    if (!poliza.resumen) throw new Error("No se encontraron datos extraidos del resumen de la poliza.");

    const serialData = poliza.resumen
    const numeroPoliza = (serialData.find(d => d.key === 'Número de póliza'))?.value?.trim() ?? null
    if (!numeroPoliza) throw new Error("No se encontró el número de póliza en los datos extraidos.");

    let [existingPoliza] = await pgDb.select().from(tblPolizas).where(
        and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.numeroPoliza, numeroPoliza),
            isNull(tblPolizas.inciso),
            eq(tblPolizas.esMaestra, true),
        )
    )

    const agente = (existingPoliza && existingPoliza.agenteId
        ? (await pgDb.select().from(tblAgentes).where(eq(tblAgentes.id, existingPoliza.agenteId)).limit(1))[0]
        : await getAgente(serialData, saasId)) as InferSelectModel<typeof tblAgentes>

    const conducto = (existingPoliza && existingPoliza.conductoId
        ? (await pgDb.select().from(tblConductos).where(eq(tblConductos.id, existingPoliza.conductoId)).limit(1))[0]
        : await getConducto(numeroPoliza, agente, saasId)) as InferSelectModel<typeof tblConductos> | null

    const numeroSerie = getText(serialData, 'Número de serie')
    const ramoId = existingPoliza?.ramoId ?? await getRamoId()
    const asegurado = await getAsegurado(poliza.incisos[0]?.polizaInciso?.serialData, saasId, agente?.id ?? null, conducto?.id ?? null)
    const modoPago = await getModoPago(serialData)
    const subRamo = await getSubRamoId('Flotillas')
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
        companyId: 'qualitas',
        conductoId: conducto?.id,
        esMaestra: true,
        modoPagoId: modoPago?.id,
        numeroPoliza: getText(serialData, 'Número de póliza'),
        oficinaEmision: getText(serialData, 'Oficina de emisión'),
        polizaAnterior: getText(serialData, 'Póliza anterior'),
        polizaRenovada: getText(serialData, 'Póliza renovada'),
        ramoId: ramoId,
        subRamoId: subRamo.id,
        saasId,
        tarifa: getText(serialData, 'Tarifa aplicada'),
        fechaEmision,
        vigenciaFin,
        vigenciaInicio,
        moneda: getMoneda(serialData),
        periodoGracia: getPeriodoGracia(serialData),
        primaNeta: getNumberString(serialData, 'Prima neta'),
        financiamiento: getNumberString(serialData, 'Tasa Fin. P. F.'),
        costoExpedicion: getNumberString(serialData, 'Expedición de póliza'),
        subtotal: getNumberString(serialData, 'Subtotal'),
        iva: getNumberString(serialData, 'IVA') ?? getNumberString(serialData, 'Iva'),
        total: getNumberString(serialData, 'Importe total'),
        primaNetaComision: comision ? await getPrimaNetaComision(serialData, comision) : null,
        porcentajeComision: comision,
        incisosCancelados: getNumber(serialData, 'Total incisos cancelados')[0],
        incisosVigentes: getNumber(serialData, 'Total incisos vigentes')[0],
        totalIncisos: getNumber(serialData, 'Total incisos')[0],
        recargoFinacieroPorcentual: getNumberString(serialData, 'Recargo financiero')?.replace('&', ''),
        porcentajeDescuento: porcentajeDescuento,
        lastSync: new Date().toISOString(),
        claveAgente,
        origenId
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
                motivo: `Registro inicial flota: Origen - ${motivo}`,
                tipoMovimiento: 'REGISTRO'
            })
        })
    }

    poliza.incisos.forEach(async inciso => {
        await qualitasScrappedInciso(existingPoliza, inciso)
    });
    return
}

