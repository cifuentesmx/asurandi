import { admFirestoreService } from "$lib/firebase/admFirestoreService";

export const deleteQualitasAccountUsecase = async ({ saasId, id, company }:
    { saasId: string, id: string, company: string }): Promise<boolean> => {
    try {
        const acceptedCompanies = ['qualitas', 'anaseguros']
        if (!company || !acceptedCompanies.includes(company)) throw new Error('La compañía no es válida')

        await admFirestoreService.deleteDocument(`/accounts/${saasId}/secrets/${company}/agents/${id}`)
        return true
    } catch (error) {
        console.error(error)
        throw new Error("No se pudo crear el usuario");
    }
}