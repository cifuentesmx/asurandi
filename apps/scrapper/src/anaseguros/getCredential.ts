import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "../firebase/getAdminApp.js";
import { AnasegurosAccountCredential } from "@asurandi/types";

export async function getAnasegurosCredential(saasId: string, accountId: string): Promise<AnasegurosAccountCredential | null> {
    const app = getAdminApp()
    const db = getFirestore(app)
    const doc = await db.doc(`/accounts/${saasId}/secrets/anaseguros/agents/${accountId}`).get()
    if (doc.exists) {
        const data = doc.data() as Partial<AnasegurosAccountCredential>
        if (!data.agente || !data.cuenta || !data.password) throw new Error(`La cuenta de anaseguros está mal configurada`);
        return data as AnasegurosAccountCredential
    }
    throw new Error(`No se pudo obtener las credenciales de la compañia para la cuenta especificada: "${saasId}", agente: "${accountId}"`);
} 