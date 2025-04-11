import { initializeAdminApp } from '../lib/firebase.server.js';
import { getFirestore } from 'firebase-admin/firestore';

export async function restartConnection(accountId: string): Promise<void> {
    const app = initializeAdminApp()
    const db = getFirestore(app)
    await db.doc(`/accounts/${accountId}/services/whatsapp`).set({ lastRestart: new Date().getTime() }, { merge: true })
    await db.collection(`/accounts/${accountId}/services/whatsapp/restarts`).add({ timestamp: new Date().getTime() })
    return
}