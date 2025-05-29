import { getFirestore } from 'firebase-admin/firestore';
import { pgDb } from "../../lib/db.js"
import { initializeAdminApp } from "../../lib/firebase.server.js"
import { eq } from "drizzle-orm"
import { AppError } from '../../lib/AppError.js';
import { tblAgentes, tblConductos } from '@asurandi/database';
import { Account } from '@asurandi/types';

export const getAgentData = async (user: { uid: string, email: string }) => {
    const app = initializeAdminApp()
    const db = getFirestore(app)
    const accounts: Partial<Account>[] = []
    const querySnapshot = await db.collection(`/users/${user.uid}/accounts`).get()
    for (let idx = 0; idx < querySnapshot.size; idx++) {
        const doc = querySnapshot.docs[idx]
        const data = doc.data()
        if (data.roles.includes('conducto') || data.roles.includes('agente')) {
            const account = await db.doc(`/accounts/${doc.id}`).get()
                .then(d => (
                    { ...d.data(), id: d.id } as Account)
                )
            accounts.push({ id: doc.id, roles: data.roles || [], name: account.name ?? 'Sin nombre' })
        }
    }
    if (accounts.length === 0) throw new AppError("No se ha podido encontrar una cuenta válida para este usuario, probablemente tu agencia ha eliminado tu cuenta de agente.");


    let currentAccount = ''
    if (accounts.length !== 1) {
        const data = (await db.doc(`/users/${user.uid}`).get()).data() as { currentAccount?: string }
        if (!data?.currentAccount) {
            currentAccount = accounts[0].id ?? ''
            await db.doc(`/users/${user.uid}`).set({ currentAccount }, { merge: true })
        } else {
            currentAccount = data.currentAccount
        }

    } else {
        currentAccount = accounts[0].id ?? ''
    }
    const conductos = await pgDb.select({ id: tblConductos.id, name: tblConductos.nombre })
        .from(tblConductos)
        .where(eq(tblConductos.uid, user.uid))
    const agentes = await pgDb.select({ id: tblAgentes.id, name: tblAgentes.nombre })
        .from(tblAgentes)
        .where(eq(tblAgentes.uid, user.uid))

    return {
        conductos,
        agentes,
        accounts,
        currentAccount
    }
}