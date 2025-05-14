import { UpdateRequestPoliza } from "@asurandi/types";
import { sendToMessageBus } from "sendMessage.js";
import { pgDb } from "./db.js";
import { tblPolizas, tblEndosos, tblRecibos } from "@asurandi/database";
import { and, eq, isNull, or } from "drizzle-orm";

export const fixDuplicatedFleetRecords = async (saasId: string) => {
    // corregir registros duplicados de endosos y recibos
    //// selecciona todas las polizas que no son maestras
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
}