import { admFirestoreService } from "$lib/firebase/admFirestoreService";

export const deleteQualitasAccountUsecase = async ({ saasId, id }:
    { saasId: string, id: string }): Promise<boolean> => {
    try {

        await admFirestoreService.deleteDocument(`/accounts/${saasId}/secrets/qualitas/agents/${id}`)
        return true
    } catch (error) {
        console.error(error)
        throw new Error("No se pudo crear el usuario");
    }
}