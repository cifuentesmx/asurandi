import { tblCobros, tblRecibos, tblEndosos, tblLogs } from "@asurandi/database";
import { pgDb } from "./db.js";
import { and, eq, lt } from "drizzle-orm";

export const updateCobranzaRetroactiva = async (saasId: string) => {
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
}