import { admFirestoreService } from "../firebase/admFirestoreService.js";
import { PartialWithFieldValue } from "../firebase/firestoreDAL.js";
import { QualitasPortalSession } from "../qualitas/QualitasPortalSession.js";
import { MessageBusMessage, QualitasAccountCredential, PolizaSiniestroUpdateRequestRange, SaasAccount } from "@asurandi/types";

export async function dailyScrapper(request: MessageBusMessage<PolizaSiniestroUpdateRequestRange>) {
    try {
        const saasId = request.payload.saasId
        const qAccounts = await admFirestoreService.getCollection(`/accounts/${saasId}/secrets/qualitas/agents`) as PartialWithFieldValue<QualitasAccountCredential>[]
        console.time(`Daily scrapper ${saasId}: ${request.payload.start} --> ${request.payload.end}`)
        for (let i = 0; i < qAccounts.length; i++) {
            const qAccount = qAccounts[i];
            if (typeof qAccount.agente === 'string' && typeof qAccount.cuenta === 'string' && typeof saasId === 'string') {
                // if (qAccount.id !== '58625-MAESTRA') continue // Pepe
                // if (qAccount.id !== '89607-MAESTRA') continue // cristian

                const portalSession = new QualitasPortalSession({
                    saasId,
                    agent: qAccount.agente,
                    cuenta: qAccount.cuenta
                })
                console.time(`Cuenta Quálitas (${qAccount.alias}: ${request.payload.start} - ${request.payload.end})`)
                try {
                    await portalSession.open()
                    await portalSession.dailyScrapper(
                        request.payload.start,
                        request.payload.end
                    )
                } catch (error) {
                    if (error instanceof Error) {
                        console.error(`${new Date()} - ${error.message}`, error)
                    }
                    else {
                        console.error(error)
                    }
                }
                finally {
                    await portalSession.close()
                    console.timeEnd(`Cuenta Quálitas (${qAccount.alias}: ${request.payload.start} - ${request.payload.end})`)
                }
            }

        };

        const updateAccount: PartialWithFieldValue<SaasAccount> = {
            lastQualitasDaily: request.payload.end,
        }

        await admFirestoreService.setDocument(`/accounts/${saasId}`, updateAccount)

        console.timeEnd(`Daily scrapper ${saasId}: ${request.payload.start} --> ${request.payload.end}`)

    } catch (error) {
        console.error(error)
        throw error
    }

}