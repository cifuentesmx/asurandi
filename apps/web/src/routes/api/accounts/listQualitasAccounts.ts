import type { QualitasAccountCredential } from '@asurandi/types';
import { admFirestoreService } from "$lib/firebase/admFirestoreService"
import type { PartialWithFieldValue } from "firebase-admin/firestore"

export const listQualitasAccounts = async (saasId: string) => {
    const accounts = await admFirestoreService.getCollection(`/accounts/${saasId}/secrets/qualitas/agents`) as PartialWithFieldValue<QualitasAccountCredential>[]
    return accounts.map(t => {
        return { id: t.id, cuenta: t.cuenta, agente: t.agente, alias: t.alias }
    })

}