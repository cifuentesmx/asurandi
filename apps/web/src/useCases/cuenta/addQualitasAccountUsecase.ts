import { admFirestoreService } from "$lib/firebase/admFirestoreService";
import type { QualitasAccountCredential } from "@asurandi/types"

export const addQualitasAccountUsecase = async ({
    saasId,
    agente,
    cuenta,
    password,
    alias,
    company
}:
    {
        saasId: string,
        agente: string,
        cuenta: string,
        password: string,
        alias: string,
        company: string
    })
    : Promise<QualitasAccountCredential> => {
    try {
        const acceptedCompanies = ['qualitas', 'anaseguros']
        if (!company || !acceptedCompanies.includes(company)) throw new Error('La compañía no es válida')
        const account: QualitasAccountCredential = { agente, cuenta, password, id: agente, alias }
        await admFirestoreService.setDocument(`/accounts/${saasId}/secrets/${company}/agents/${agente}-${cuenta}`, account)
        return { id: account.id, agente: account.agente, cuenta: account.cuenta, password: '', alias }
    } catch (error) {
        console.error(error)
        throw new Error("No se pudo crear el usuario");
    }
}