
import { admFirestoreService } from "$lib/firebase/admFirestoreService"
import type { SaasUser } from "@asurandi/types"
import type { PartialWithFieldValue } from "firebase-admin/firestore"

export const listAccountUsers = async (saasId: string) => {
    const accounts = await admFirestoreService.getCollection(`/accounts/${saasId}/users`) as PartialWithFieldValue<SaasUser>[]
    return accounts
}