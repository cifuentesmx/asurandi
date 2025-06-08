import { NexusConnector } from "../nexus/connection.js"
import { nxDatosExtra, nxPolizas } from "../nexus/polizas.js"
import { and, desc, eq, lt, } from "drizzle-orm"
import { pgDb } from "./db.js"
import { tblAgentes, tblPolizaMovimientos, tblPolizaOrigen, tblPolizas } from "@asurandi/database"
import type { QualitasAccountCredential } from "@asurandi/types"
import { MySql2Database } from "drizzle-orm/mysql2"

const nexusConnection: NexusConnector = new NexusConnector()
let nexus: MySql2Database<Record<string, never>> | null = null
let timer: NodeJS.Timeout | null = null
export const getOrigenId = async (
    { numeroPoliza, saasId, numeroSerie, inicio, cuentas, emision, companyId = 'qualitas' }
        : { numeroSerie: string, numeroPoliza: string, saasId: string, inicio: string, cuentas: QualitasAccountCredential[], emision: string, companyId?: string })
    : Promise<[number, string]> => {
    const polizaAsurandi = await getAsurandiContext(numeroSerie, saasId, cuentas, emision)
    if (polizaAsurandi) {

        const inicioVigencia = new Date(inicio)

        // check for invalid date on inicioVigencia
        if (isNaN(inicioVigencia.getTime())) {
            throw new Error('Fecha de inicio de vigencia es inválida, no puedo saber el origen de la póliza.');
        }

        // ya se tiene un registro de este número de póliza, se regresa el mismo
        if (polizaAsurandi.numeroPoliza === numeroPoliza && polizaAsurandi.origen) return [polizaAsurandi.origen, `Origen anterior (${polizaAsurandi.txtOrigen}): ${numeroPoliza} ya tiene registro previo con origen capturado en Asurandi.`]

        // si la poliza es del mismo numero y no es de un agente que tengamos dado de alta
        if (polizaAsurandi.numeroPoliza === numeroPoliza && !polizaAsurandi.agenteid) return [6, `Cambio de conducto: ${polizaAsurandi.numeroPoliza} proviene de agente con clave externa.`] // Cambio de conducto.

        // si la poliza de otro numero de poliza y no es de un agente que tengamos dado de alta
        if (polizaAsurandi.numeroPoliza !== numeroPoliza && !polizaAsurandi.agenteid) return [7, `Nueva ganada: renueva a ${polizaAsurandi.numeroPoliza} que es una póliza anterior de cambio de conducto.`] // nueva poliza ganada después de cambio de conducto

        const esOtraPoliza = polizaAsurandi.numeroPoliza !== numeroPoliza
        const diasSinCobertura = Math.ceil((inicioVigencia.getTime() - polizaAsurandi.fin.getTime()) / (1000 * 60 * 60 * 24))
        const desfaseInicioVigencia = Math.ceil((inicioVigencia.getTime() - polizaAsurandi.inicio.getTime()) / (1000 * 60 * 60 * 24))

        // dias Sin cobertura es menor a un dia, es una poliza diferente y 
        // la diferencia en inicio de vigencia es mayor a 1 día
        if (diasSinCobertura <= 1
            && esOtraPoliza
            && desfaseInicioVigencia > 1)
            return [2, `Renovada: ${polizaAsurandi.numeroPoliza} es un registro anterior.`] // renovada

        // dias Sin cobertura es menor a un dia, es una poliza diferente y 
        // la diferencia en inicio de vigencia es menor a 1 día
        if (diasSinCobertura <= 1
            && esOtraPoliza
            && desfaseInicioVigencia <= 1) {
            if (polizaAsurandi.numeroPoliza && polizaAsurandi.origen && polizaAsurandi.origen !== 8) {
                // Se sustituye la poliza anterior con la nueva
                await pgDb.transaction(async tx => {
                    // 4 poliza sustituida
                    const [oldPoliza] = await tx.update(tblPolizas).set({ origenId: 4 }).where(
                        and(
                            eq(tblPolizas.numeroPoliza, polizaAsurandi.numeroPoliza ?? '<>'),
                            eq(tblPolizas.esMaestra, true)
                        )
                    ).returning();
                    if (oldPoliza) await tx.insert(tblPolizaMovimientos).values({
                        agenteId: oldPoliza.agenteId,
                        aseguradoId: oldPoliza.asegurado_id,
                        companyId: oldPoliza.companyId,
                        conductoId: oldPoliza.conductoId,
                        fechaMovimiento: new Date().toISOString(),
                        motivo: `Sustituida: ${numeroPoliza} sustituyó a ${oldPoliza.numeroPoliza} (esta póliza).`,
                        numeroPoliza: oldPoliza.numeroPoliza,
                        polizaId: oldPoliza.id,
                        saasId,
                        vehiculoId: oldPoliza.vehiculoId,
                        tipoMovimiento: 'CAMBIO',
                    })

                })
                return [polizaAsurandi.origen, `Origen anterior (${polizaAsurandi.txtOrigen}): ${numeroPoliza} sustituye a la póliza ${polizaAsurandi.numeroPoliza}.`]; // poliza nueva toma el origen de la anterior
            } else {
                return [8, `Indeterminado: ${polizaAsurandi.numeroPoliza} se ha encontrado como antecedente pero no se ha podido determinar su origen.`]; // indeterminado
            }
        }

        // dias Sin cobertura es menor o igual a un 15, es una poliza diferente y 
        // la diferencia en inicio de vigencia es mayor a 1 día
        if (diasSinCobertura <= 15
            && esOtraPoliza
            && desfaseInicioVigencia > 1)
            return [3, `Renovación tardía: ${polizaAsurandi.numeroPoliza} fue renovada después de ${diasSinCobertura} días.`] // renovacion tardía


        // dias Sin cobertura es mayor a un 15, es una poliza diferente y 
        // la diferencia en inicio de vigencia es mayor a 1 día
        if (diasSinCobertura > 15
            && esOtraPoliza
            && desfaseInicioVigencia > 1)
            return [5, `Recuperada: ${polizaAsurandi.numeroPoliza} fue recuperada después de ${diasSinCobertura} días.`] // recuperada
    }

    const polizaNexus = await getNexusContext(numeroSerie)
    if (polizaNexus) {

        // ya se tiene un registro de este número de póliza, se regresa el mismo
        if (polizaNexus.numeroPoliza === numeroPoliza && polizaNexus.origen) return [polizaNexus.origen, `Origen anterior (${polizaNexus.txtOrigen}): ${numeroPoliza} tiene un registro en Nexus (${polizaNexus.numeroPoliza}).`]

        const inicioVigencia = new Date(inicio)

        // check for invalid date on inicioVigencia
        if (isNaN(inicioVigencia.getTime())) {
            throw new Error('Fecha de inicio de vigencia es inválida, no puedo saber el origen de la póliza.');
        }


        const esOtraPoliza = polizaNexus.numeroPoliza !== numeroPoliza
        const diasSinCobertura = Math.ceil((inicioVigencia.getTime() - polizaNexus.fin.getTime()) / (1000 * 60 * 60 * 24))
        const desfaseInicioVigencia = Math.ceil((inicioVigencia.getTime() - polizaNexus.inicio.getTime()) / (1000 * 60 * 60 * 24))

        // dias Sin cobertura es menor a un dia, es una poliza diferente y 
        // la diferencia en inicio de vigencia es mayor a 1 día
        if (diasSinCobertura <= 1
            && esOtraPoliza
            && desfaseInicioVigencia > 1)
            return [2, `Renovada: ${polizaNexus.numeroPoliza} es un registro anterior en Nexus.`] // renovada

        // dias Sin cobertura es menor a un dia, es una poliza diferente y 
        // la diferencia en inicio de vigencia es menor a 1 día
        if (diasSinCobertura <= 1
            && esOtraPoliza
            && desfaseInicioVigencia <= 1)
            return [polizaNexus.origen ?? 8, `Origen anterior (${polizaNexus.txtOrigen ?? 'Indeterminado'}): ${numeroPoliza} sustituye a póliza ${polizaNexus.numeroPoliza} encontrada en Nexus.`] // sustituye a poliza de nexus

        // dias Sin cobertura es menor o igual a un 15, es una poliza diferente y 
        // la diferencia en inicio de vigencia es mayor a 1 día
        if (diasSinCobertura <= 15
            && esOtraPoliza
            && desfaseInicioVigencia > 1)
            return [3, `Renovación tardía: ${polizaNexus.numeroPoliza} de Nexus fue renovada de forma tardía después de ${diasSinCobertura} días.`] // renovacion tardía


        // dias Sin cobertura es mayor a un 15, es una poliza diferente y 
        // la diferencia en inicio de vigencia es mayor a 1 día
        if (diasSinCobertura > 15
            && esOtraPoliza
            && desfaseInicioVigencia > 1)
            return [5, `Recuperada: ${polizaNexus.numeroPoliza} fue recuperada de nexus después de ${diasSinCobertura} días.`] // recuperada

    }

    return [1, `Nueva: No se encontraron registros previos para ${numeroPoliza}`] // Póliza nueva
}

const getAsurandiContext = async (serie: string, saasId: string, cuentas: QualitasAccountCredential[], emisionOriginal: string) => {
    try {
        const [existing] = await pgDb.select({
            agenteId: tblPolizas.agenteId,
            qualitasId: tblAgentes.qualitasId,
            anaId: tblAgentes.anaId,
            numeroPoliza: tblPolizas.numeroPoliza,
            origenId: tblPolizas.origenId,
            vigenciaInicio: tblPolizas.vigenciaInicio,
            vigenciaFin: tblPolizas.vigenciaFin,
            txtOrigen: tblPolizaOrigen.origen,
        })
            .from(tblPolizas)
            .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
            .leftJoin(tblPolizaOrigen, eq(tblPolizaOrigen.id, tblPolizas.origenId))
            .where(and(
                eq(tblPolizas.saasId, saasId),
                eq(tblPolizas.numeroSerie, serie),
                lt(tblPolizas.fechaEmision, emisionOriginal)
            )).orderBy(desc(tblPolizas.vigenciaFin))
            .limit(1)
        if (existing && existing.vigenciaFin && existing.vigenciaInicio) {
            const esNuestra = cuentas.filter(t => t.agente === existing.qualitasId || t.agente === existing.anaId)
            return {
                agenteid: esNuestra.length > 0 ? existing.agenteId : null,
                numeroPoliza: existing.numeroPoliza,
                origen: existing.origenId,
                inicio: new Date(existing.vigenciaInicio),
                fin: new Date(existing.vigenciaFin),
                txtOrigen: existing.txtOrigen,
            }
        }
    } catch (error) {
        if (error instanceof Error) console.error(`Error al obtener póliza anterior de la base de datos: ${error.message}`)
    }
    return null
}

const getNexusContext = async (serie: string) => {

    try {
        if (!nexus) {
            console.log('Conectando a Nexus--')
            nexus = await nexusConnection.connect()
        }
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            if (nexusConnection) {
                nexusConnection.disconnect()
                nexus = null
                console.log('Desconectado de Nexus--')
            }
            if (timer) clearTimeout(timer)
        }, 5 * 60 * 1000)

        const [poliza] = await nexus.select({
            poliza: nxPolizas.poliza,
            fechaInicio: nxPolizas.fechaInicio,
            fechaFin: nxPolizas.fechaFin,
            origen: nxDatosExtra.origen
        })
            .from(nxPolizas)
            .leftJoin(nxDatosExtra, eq(nxPolizas.idMovimiento, nxDatosExtra.idPoliza))
            .where(
                eq(nxPolizas.numeroSerie, serie)
            )
            .orderBy(desc(nxPolizas.fechaFin))
            .limit(1)
        if (poliza && poliza.fechaFin && poliza.fechaInicio) {
            let origen = 1
            if (poliza.origen === 'NUEVA') origen = 1
            if (poliza.origen === 'RENOVACION' || poliza.origen === 'RENOVADA') origen = 2
            if (poliza.origen === 'RENOVACION TARDIA') origen = 3
            if (poliza.origen === 'SUSTITUIDA') origen = 4
            if (poliza.origen === 'RECUPERADA') origen = 5
            return {
                numeroPoliza: poliza.poliza,
                inicio: new Date(poliza.fechaInicio),
                fin: new Date(poliza.fechaFin),
                origen,
                txtOrigen: poliza.origen,
            }
        }
    } catch (error) {
        if (error instanceof Error)
            console.error(`Error al consultar NEXUS: ${error.message}`)
        return null
    } finally {
        // if (nexusConnection) nexusConnection.disconnect()
    }
    return null
}
