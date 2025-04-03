import type { QualitasAccountCredential } from '@asurandi/types';
import { admFirestoreService } from "$lib/firebase/admFirestoreService"
import type { PartialWithFieldValue } from "firebase-admin/firestore"

export const getQualitasAccount = async (saasId: string, accountId: string) => {
    const account = await admFirestoreService
        .getDocument(
            `/accounts/${saasId}/secrets/qualitas/agents/${accountId}`
        ) as PartialWithFieldValue<QualitasAccountCredential>
    return account

}