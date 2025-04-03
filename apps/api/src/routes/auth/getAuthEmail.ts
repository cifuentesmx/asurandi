import { AppError } from "@/lib/AppError.js"
import { initializeAdminApp } from "@/lib/firebase.server.js"
import { getAuth } from "firebase-admin/auth"

export const getAuthEmail = async (email: string):
    Promise<{ email: string, hasPassword: boolean }> => {
    const app = initializeAdminApp()
    const auth = getAuth(app)
    const user = await auth.getUserByEmail(email).catch(() => null)
    if (!user || !user.providerData) throw new AppError(`No se encuentra la cuenta para el correo electrónico ${email}`);
    if (!user.email) throw new AppError(`El correo ${email} no existe. Comunícate con tu oficina de emisión.`)

    let hasPassword = false
    for (let idx = 0; idx < user?.providerData.length; idx++) {
        const provider = user?.providerData[idx];
        if (provider.providerId === 'password') {
            hasPassword = true
            break
        }

    }

    return { email: user.email ?? null, hasPassword }
}