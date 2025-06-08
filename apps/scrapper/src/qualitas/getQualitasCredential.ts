import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "../firebase/getAdminApp.js";
import { QualitasAccountCredential } from "@asurandi/types";

export async function getQualitasCredential(saasId: string, id: string): Promise<QualitasAccountCredential | void> {
    const app = getAdminApp()
    const db = getFirestore(app)
    const doc = await db.doc(`/accounts/${saasId}/secrets/qualitas/agents/${id}`).get()
    if (doc.exists) {
        const data = doc.data() as Partial<QualitasAccountCredential>
        if (!data.agente || !data.cuenta || !data.password) throw new Error(`La cuenta de qualitas está mal configurada`);
        return data as QualitasAccountCredential
    }
    throw new Error(`No se pudo obtener las credenciales de la compañia para la cuenta especificada: "${saasId}", agente: "${id}"`);
}  