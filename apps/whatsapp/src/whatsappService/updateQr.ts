import { initializeAdminApp } from "@/lib/firebase.server.ts"
import { getFirestore } from "firebase-admin/firestore"

export const updateQr = async (base64: string, accountId: string) => {
    const app = initializeAdminApp()
    const db = getFirestore(app)
    await db
        .doc(`/accounts/${accountId}/services/whatsapp`)
        .set({ accountId, base64, timestamp: new Date().getTime() })
}   