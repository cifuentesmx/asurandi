import { belongsToAccount } from "$api/users/belongsToAccount";
import { getUser } from "$api/users/getUser";
import { admFirestoreService } from "$lib/firebase/admFirestoreService";

export const deleteUserUsecase = async (saasId: string, id: string): Promise<boolean> => {
    try {
        const user = await getUser(saasId, id)
        if (!user) throw new Error("No se ha encontrado al usuario");
        if (!user.id || typeof user.id !== 'string') throw new Error(`No se pudo localizar al usuario.`);

        if (! await belongsToAccount(user.id, saasId)) throw new Error("El usuario no pertenece a esta cuenta");

        await admFirestoreService.deleteDocument(`/accounts/${saasId}/users/${user.uid}`)
        await admFirestoreService.deleteDocument(`/users/${user.uid}/accounts/${saasId}`)
        return true
    } catch (error) {
        console.error(error)
        throw new Error("No se pudo crear el usuario");
    }
}