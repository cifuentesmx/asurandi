import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '../../firebase/getAdminApp.js';
import { QualitasAccountCredential } from '@asurandi/types';
const app = getAdminApp()
const db = getFirestore(app)
export const getAllCuentas = async (saasId: string) => {
    const docs: QualitasAccountCredential[] = []
    const qSnap = await db.collection(`/accounts/${saasId}/secrets/qualitas/agents`).get()
    qSnap.forEach(doc => {
        docs.push({ ...doc.data(), id: doc.id } as QualitasAccountCredential)
    })

    const aSnap = await db.collection(`/accounts/${saasId}/secrets/anaseguros/agents`).get()
    aSnap.forEach(doc => {
        docs.push({ ...doc.data(), id: doc.id } as QualitasAccountCredential)
    })



    return docs
}