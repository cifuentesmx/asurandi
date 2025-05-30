import { admFirestoreService } from "$lib/firebase/admFirestoreService";
import type { QualitasAccountCredential } from "@asurandi/types"

export const updateQualitasAccountUsecase = async ({ saasId,
    agente,
    cuenta,
    password,
    alias,
    company
}:
    { saasId: string, agente: string, cuenta: string, password?: string | null, alias: string, company: string }): Promise<QualitasAccountCredential> => {
    try {
        const acceptedCompanies = ['qualitas', 'anaseguros']
        if (!company || !acceptedCompanies.includes(company)) throw new Error('La compañía no es válida')

        let account: Partial<QualitasAccountCredential> = { agente, cuenta, id: `${agente}-${cuenta}`, alias }
        if (typeof password === 'string' && password !== '') {
            account = { ...account, password }
        }

        await admFirestoreService.setDocument(`/accounts/${saasId}/secrets/${company}/agents/${agente}-${cuenta}`, account)
        return { id: `${agente}-${cuenta}`, agente, cuenta, password: '', alias }
    } catch (error) {
        console.error(error)
        throw new Error("No se pudo crear el usuario");
    }
}