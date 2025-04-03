import { initializeAdminApp } from '$lib/firebase/app.server';

import { getAuth, UserRecord } from 'firebase-admin/auth';

export const getOrCreateUser = async (email: string): Promise<UserRecord> => {
    const app = initializeAdminApp()
    const auth = getAuth(app)
    let user = await auth.getUserByEmail(email).catch(() => null)
    if (!user) {
        user = await auth.createUser({ displayName: 'Usuario sin nombre', emailVerified: false, email })
    }
    return user
}
export const getUserByEmail = async (email: string): Promise<UserRecord | null> => {
    const app = initializeAdminApp()
    const auth = getAuth(app)
    let user = await auth.getUserByEmail(email).catch(() => null)
    return user
}