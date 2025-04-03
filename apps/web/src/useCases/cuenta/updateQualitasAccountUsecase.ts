import { admFirestoreService } from "$lib/firebase/admFirestoreService";
import type { QualitasAccountCredential } from "@asurandi/types"

export const updateQualitasAccountUsecase = async ({ saasId,
    agente,
    cuenta,
    password,
    alias }:
    { saasId: string, agente: string, cuenta: string, password?: string | null, alias: string }): Promise<QualitasAccountCredential> => {
    try {
        let account: Partial<QualitasAccountCredential> = { agente, cuenta, id: `${agente}-${cuenta}`, alias }
        if (typeof password === 'string' && password !== '') {
            account = { ...account, password }
        }

        await admFirestoreService.setDocument(`/accounts/${saasId}/secrets/qualitas/agents/${agente}-${cuenta}`, account)
        return { id: `${agente}-${cuenta}`, agente, cuenta, password: '', alias }
    } catch (error) {
        console.error(error)
        throw new Error("No se pudo crear el usuario");
    }
}