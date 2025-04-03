
import { admFirestoreService } from "$lib/firebase/admFirestoreService"
import type { SaasUser } from "@asurandi/types"
import type { PartialWithFieldValue } from "firebase-admin/firestore"

export const getUser = async (saasId: string, uid: string) => {
    const user = await admFirestoreService.getDocument(`/accounts/${saasId}/users/${uid}`) as PartialWithFieldValue<SaasUser>
    return user
}