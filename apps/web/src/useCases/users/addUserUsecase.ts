import { getOrCreateUser } from "$api/users/getOrCreateUser";
import { admFirestoreService } from "$lib/firebase/admFirestoreService";
import type { SaasRole, SaasUser } from "$types/saas/user";

export const addUserUsecase = async (saasId: string, email: string, roles: SaasRole[]): Promise<SaasUser> => {
    try {
        const user = await getOrCreateUser(email)
        if (!user.email) throw new Error(`No se pudo localizar o crear el usuario con el email ${email}`);

        const newUser: SaasUser = {
            email: user.email,
            id: user.uid,
            name: user.displayName ?? '',
            phone: user.phoneNumber ?? '',
            roles,
            uid: user.uid,
            created: Date.now()
        }
        await admFirestoreService.setDocument(`/accounts/${saasId}/users/${newUser.uid}`, newUser)
        await admFirestoreService.setDocument(`/users/${newUser.uid}/accounts/${saasId}`, { roles, created: Date.now() })
        return newUser
    } catch (error) {
        console.error(error)
        throw new Error("No se pudo crear el usuario");

    }
}