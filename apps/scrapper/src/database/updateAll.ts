import {
    and,
    eq,
    isNull,
    desc,
    lt
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

    } catch (error) {
        console.error(error)
    } finally {
        console.timeEnd('Update all:')
    }
}