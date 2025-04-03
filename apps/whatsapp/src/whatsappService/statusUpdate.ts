import { initializeAdminApp } from "@/lib/firebase.server.js"
import { getFirestore } from "firebase-admin/firestore"

export const statusUpdate = async (accountId: string, status: string) => {
    const app = initializeAdminApp()
    const db = getFirestore(app)
    return await db.doc(`/accounts/${accountId}/services/whatsapp`)
        .set({
            status,
            timestamp: new Date().getTime()
        },
            { merge: true }
        )

}