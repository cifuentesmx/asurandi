import { AnasegurosAccountCredential, MessageBusMessage, SaasAccount, UpdateRequestPolizasInRange } from "@asurandi/types";
import { admFirestoreService } from "../firebase/admFirestoreService.js";
import { PartialWithFieldValue } from "../firebase/firestoreDAL.js";
import { AnasegurosPortal } from "anaseguros/AnasegurosPortal.js";

export const dailyScrapperAna = async (request: MessageBusMessage<UpdateRequestPolizasInRange>) => {
    const saasId = request.payload.saasId
    try {
        const aAccounts = await admFirestoreService.getCollection(`/accounts/${saasId}/secrets/anaseguros/agents`) as PartialWithFieldValue<AnasegurosAccountCredential>[]
        console.time(`Daily ANASEGUROS scrapper ${saasId}: ${request.payload.start} --> ${request.payload.end}`)
        for (let i = 0; i < aAccounts.length; i++) {
            const aAccount = aAccounts[i]
            if (typeof aAccount.agente === 'string' && typeof aAccount.cuenta === 'string' && typeof saasId === 'string') {
                const portalSession = new AnasegurosPortal({
                    saasId,
                    agent: aAccount.agente,
                    cuenta: aAccount.cuenta
                })
                console.time(`Cuenta Anaseguros (${aAccount.alias}: ${request.payload.start} - ${request.payload.end})`)
                try {
                    await portalSession.open()
                    await portalSession.dailyScrapper(
                        request.payload.start,
                        request.payload.end)
                } catch (error) {
                    console.error(error)
                    throw error
                } finally {
                    await portalSession.close()
                    console.timeEnd(`Cuenta Anaseguros (${aAccount.alias}: ${request.payload.start} - ${request.payload.end})`)
                }
            }
        }

        const updateAccount: PartialWithFieldValue<SaasAccount> = {
            lastAnasegurosDaily: request.payload.end,
        }
        await admFirestoreService.setDocument(`/accounts/${saasId}`, updateAccount)
    } catch (error) {
        console.error(error)
        throw error
    } finally {
        console.timeEnd(`Daily ANASEGUROS scrapper ${saasId}: ${request.payload.start} --> ${request.payload.end}`)
    }
}