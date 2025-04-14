import { OutgoingWhatsappMessageRequest } from '@asurandi/types';
import { tblConductos } from "@asurandi/database"
import { eq } from "drizzle-orm"
import { pgDb } from "../db.js"
import { conductoCobranzaRenovaciones } from "../reports/conducto-cobranza-renovaciones.js"
import { sendToMessageBus } from '../sendMessage.js';
export const sendTodos = async (preference: 'weekly' | 'monthly') => {
    const conductos = await pgDb.select().from(tblConductos).where(
        eq(tblConductos.sendTareas, preference)
    )
    await Promise.all(conductos.map(async (conducto) => {
        if (!conducto.phone) return

        const files = await conductoCobranzaRenovaciones(conducto)
        const payload: OutgoingWhatsappMessageRequest = {
            saasId: conducto.saasId ?? '',
            phoneNumber: conducto.phone,
            text: `Hola, te adjunto el reporte de las actividades de seguimiento pendientes.\n\nSi tienes alguna duda, por favor contacta con tu ejecutivo comercial.\n*Saludos!*`,
            urls: files
        }
        await sendToMessageBus({
            exchange: 'ex.whatsapp',
            intents: 0,
            maxIntents: 5,
            routingKey: 'whatsapp.outgoing',
            reason: conducto.sendTareas ?? '',
            payload,
            ttl: 1000 * 60 * 60 * 4, // 4 hours
        })
    }))
}