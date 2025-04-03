import { initializeAdminApp } from "$lib/firebase/app.server"
import { getAuth } from "firebase-admin/auth"

export const decodeToken = async (token: string) => {
    const app = initializeAdminApp()
    const auth = getAuth(app)
    return auth
        .verifyIdToken(token)
        .then((decodedToken) => {
            return decodedToken
        })
}