import type { AnasegurosAccountCredential } from "@asurandi/types";
import { admFirestoreService } from "$lib/firebase/admFirestoreService";
import type { PartialWithFieldValue } from "firebase-admin/firestore";

export const listAnasegurosAccounts = async (saasId: string) => {
    const accounts = await admFirestoreService
        .getCollection(`/accounts/${saasId}/secrets/anaseguros/agents`) as PartialWithFieldValue<AnasegurosAccountCredential>[]
    return accounts.map(t => {
        return { id: t.id, cuenta: t.cuenta, agente: t.agente, alias: t.alias }
    })
}