import {
    and,
    eq,
    isNull,
    desc,
    lt,
    or
} from "drizzle-orm"
import { pgDb } from "./db.js"
import {
    tblCobros,
    tblLogs,
    tblRecibos,
    tblPolizaMovimientos, tblPolizas,
    tblEndosos
} from "@asurandi/database"
import { getOrigenId } from "./qualitas/getOrigenId.js"
import { getAllCuentas } from "./qualitas/getAllCuentas.js"
import { sendToMessageBus } from "../sendMessage.js"
import { UpdateRequestPoliza } from "@asurandi/types"

export const updateAll = async (saasId: string) => {
    console.time('Update all:')
    try {
        // Origen de las polizas
        const cuentas = await getAllCuentas(saasId)
        const polizas = await pgDb.select().from(tblPolizas).where(and(
            isNull(tblPolizas.origenId),
            eq(tblPolizas.saasId, saasId)
        )).orderBy(desc(tblPolizas.fechaEmision), tblPolizas.numeroPoliza)

        for (let idx = 0; idx < polizas.length; idx++) {
            const poliza = polizas[idx];
            if (!poliza.numeroPoliza || !poliza.saasId || !poliza.vigenciaInicio || !poliza.numeroSerie) {
                console.error(`Omitiendo póliza ${poliza.numeroPoliza}`)
                // console.info(poliza)
                continue
            }
            const [origenId, motivo] = await getOrigenId({
                numeroPoliza: poliza.numeroPoliza,
                saasId: poliza.saasId,
                inicio: poliza.vigenciaInicio,
                numeroSerie: poliza.numeroSerie,
                cuentas,
                emision: poliza.vigenciaInicio
            })
            await pgDb.update(tblPolizas).set({
                origenId
            })
                .where(eq(tblPolizas.id, poliza.id))

            await pgDb.insert(tblPolizaMovimientos).values({
                agenteId: poliza.agenteId,
                aseguradoId: poliza.asegurado_id,
                companyId: poliza.companyId,
                conductoId: poliza.conductoId,
                fechaMovimiento: poliza.fechaEmision,
                motivo,
                numeroPoliza: poliza.numeroPoliza,
                vehiculoId: poliza.vehiculoId,
                polizaId: poliza.id,
                saasId,
                tipoMovimiento: 'CAMBIO'
            })
        }

        // Actualizar datos Cobranza retroactiva
        const cobrosPendientes = await pgDb.select().from(tblCobros).where(
            and(
                lt(tblCobros.fechaLimite, new Date().toISOString()),
                eq(tblCobros.estado, 'PENDIENTE')
            )
        )
        for (let idx = 0; idx < cobrosPendientes.length; idx++) {
            const cobro = cobrosPendientes[idx];
            if (!cobro.polizaId) {
                console.error('El cobro no tiene una poliza asociada ', cobro.id)
                continue
            }

            let found = false

            // busca en recibos. 
            const recibos = await pgDb.select().from(tblRecibos).where(
                and(
                    eq(tblRecibos.saasId, saasId),
                    eq(tblRecibos.polizaId, cobro.polizaId)
                )
            )

            for (let reciboIdx = 0; reciboIdx < recibos.length; reciboIdx++) {
                const recibo = recibos[reciboIdx];
                if (!cobro.numeroRecibo || !recibo.numeroRecibo?.includes(cobro.numeroRecibo)) continue
                let newState: typeof cobro.estado = 'PENDIENTE'
                switch (recibo.estado) {
                    case 'CANCELADO':
                        newState = 'CANCELADA'
                        break;
                    case 'PAGADO':
                        newState = 'PAGADA'
                        break;
                    default:
                        break;
                }
                if (newState === 'PENDIENTE') continue
                found = true
                await pgDb.transaction(async tx => {
                    await tx.update(tblCobros).set({ estado: newState }).where(eq(tblCobros.id, cobro.id)).returning()
                    await tx.insert(tblLogs).values({ action: 'u', model: 'cobro', saasId, user: 'system', modelId: cobro.id, description: `Status: ${newState}, encontrado en recibo: ${recibo.numeroRecibo}` })
                    console.log(`Status: ${newState}, encontrado en recibo: ${recibo.numeroRecibo}`)
                })
            }

            if (found) continue
            // busca en endosos
            const endosos = await pgDb.select().from(tblEndosos).where(
                and(
                    eq(tblEndosos.saasId, saasId),
                    eq(tblEndosos.polizaId, cobro.polizaId)
                )
            )

            for (let endosoIdx = 0; endosoIdx < endosos.length; endosoIdx++) {
                const endoso = endosos[endosoIdx];
                if (!cobro.numeroRecibo || !endoso.numeroRecibo?.includes(cobro.numeroRecibo)) continue
                let newState: typeof cobro.estado = 'PENDIENTE'
                switch (endoso.estado) {
                    case 'CANCELADO':
                        newState = 'CANCELADA'
                        break;
                    case 'PAGADO':
                        newState = 'PAGADA'
                        break;
                    default:
                        break;
                }
                if (newState === 'PENDIENTE') continue
                found = true
                await pgDb.transaction(async tx => {
                    await tx.update(tblCobros).set({ estado: newState }).where(eq(tblCobros.id, cobro.id)).returning()
                    await tx.insert(tblLogs).values({ action: 'u', model: 'cobro', saasId, user: 'system', modelId: cobro.id, description: `Status: ${newState}, encontrado en endoso: ${endoso.numeroRecibo}` })
                    console.log(`Status: ${newState}, encontrado en endoso: ${endoso.numeroRecibo}`)
                })
            }

        }

        // corregir registros duplicados de endosos y recibos

        // selecciona todas las polizas que no son maestras
        const polizasNoMaestras = await pgDb.select().from(tblPolizas).where(
            and(
                or(
                    isNull(tblPolizas.esMaestra),
                    eq(tblPolizas.esMaestra, false)
                ),
                eq(tblPolizas.saasId, saasId)
            )
        )

        for (let idx = 0; idx < polizasNoMaestras.length; idx++) {
            const poliza = polizasNoMaestras[idx];
            if (!poliza.numeroPoliza || poliza.numeroPoliza === '2090084633') continue
            // obtener los registros de endosos
            const endososPoliza = await pgDb.select().from(tblEndosos).where(
                and(
                    eq(tblEndosos.saasId, saasId),
                    eq(tblEndosos.polizaId, poliza.id)
                )
            )

            // obtener los registros de recibos
            const recibosPoliza = await pgDb.select().from(tblRecibos).where(
                and(
                    eq(tblRecibos.saasId, saasId),
                    eq(tblRecibos.polizaId, poliza.id)
                )
            )

            if (endososPoliza.length === 0 && recibosPoliza.length === 0) continue

            // borrar todos los endosos y recibos de la poliza no maestra
            await pgDb.delete(tblEndosos).where(eq(tblEndosos.polizaId, poliza.id))
            await pgDb.delete(tblRecibos).where(eq(tblRecibos.polizaId, poliza.id))

            // enviar un mensaje al bus de eventos para que se actualice la poliza

            const [agente, cuenta] = poliza.claveAgente?.split('-') ?? []
            const updateRequest: UpdateRequestPoliza = {
                numeroPoliza: poliza.numeroPoliza,
                saasId,
                company: 'qualitas',
                cuenta: cuenta,
                agent: agente,
                intents: 0,
            }

            await sendToMessageBus({
                exchange: 'ex.scrapper',
                routingKey: 'poliza',
                ttl: 14_400_000, // 4 hours
                intents: 0,
                maxIntents: 5,
                payload: updateRequest
            })


        }

    } catch (error) {
        console.error(error)
    } finally {
        console.timeEnd('Update all:')
    }
}