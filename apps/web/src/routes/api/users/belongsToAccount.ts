import { admFirestoreService } from "$lib/firebase/admFirestoreService";

export const belongsToAccount = async (userId: string, saasId: string): Promise<boolean> => {
    try {
        const exists = admFirestoreService.getDocument(`/accounts/${saasId}/users/${userId}`)
        return !!exists
    } catch (error) {
        console.error(`${new Date()} - Error`, error)
        return false
    }
}