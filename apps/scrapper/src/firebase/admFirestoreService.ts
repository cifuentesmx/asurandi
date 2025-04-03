import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from './getAdminApp.js';
import { PartialWithFieldValue } from './firestoreDAL.js';

const app = getAdminApp()
const db = getFirestore(app)
export const admFirestoreService = {
    setDocument: async (documentPath: string, data: PartialWithFieldValue<unknown>): Promise<void> => {
        await db.doc(documentPath).set(data, { merge: true })
        return
    },
    deleteDocument: async (documentPath: string): Promise<void> => {
        await db.doc(documentPath).delete()
        return
    },
    getCollection: async <T>(collectionPath: string): Promise<PartialWithFieldValue<T>[]> => {
        const docs: PartialWithFieldValue<T>[] = []
        const snap = await db.collection(collectionPath).get()
        snap.forEach(doc => {
            docs.push({ ...doc.data(), id: doc.id } as T)
        })
        return docs
    },
    getDocument: async <T>(documentPath: string): Promise<PartialWithFieldValue<T> | null> => {
        const snap = await db.doc(documentPath).get().catch(err => {
            console.warn('firebase error: ', err.message)
            return null
        })

        if (!snap || !snap.exists) return null
        const document = {
            ...snap.data(),
            id: snap.id
        }
        return document as PartialWithFieldValue<unknown>

    },
}