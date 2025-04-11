import { belongsToAccount } from "$api/users/belongsToAccount";
import { getUser } from "$api/users/getUser";
import { admFirestoreService } from "$lib/firebase/admFirestoreService";
import type { SaasRole, SaasUser } from "@asurandi/types";

export const updateUserUsecase = async (saasId: string, id: string, roles: SaasRole[]): Promise<Partial<SaasUser>> => {
    try {
        const user = await getUser(saasId, id)
        if (!user) throw new Error("No se ha encontrado al usuario");
        if (!user.id || typeof user.id !== 'string') throw new Error(`No se pudo localizar al usuario.`);

        if (! await belongsToAccount(user.id, saasId)) throw new Error("El usuario no pertenece a esta cuenta");

        const newUser: Partial<SaasUser> = {
            roles,
            updated: Date.now()
        }
        await admFirestoreService.setDocument(`/accounts/${saasId}/users/${user.uid}`, newUser, { merge: true })
        await admFirestoreService.setDocument(`/users/${user.uid}/accounts/${saasId}`, { roles, updated: Date.now() }, { merge: true })
        return newUser
    } catch (error) {
        console.error(error)
        throw new Error("No se pudo crear el usuario");
    }
}