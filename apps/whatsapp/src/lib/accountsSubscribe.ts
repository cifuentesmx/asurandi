import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from "./firebase.server.js"
import type { SaasAccount } from '@asurandi/types'
import env from '@/env.js'

export const accountsSubscribe = (cb: (account: SaasAccount, change: FirebaseFirestore.DocumentChangeType) => void) => {
    console.info(`Suscribiendose a eventos para el cluster de conexión: ${env.CLUSTER_SERVER_NAME}`)
    const app = initializeAdminApp()
    const db = getFirestore(app)
    return db
        .collection('/accounts')
        .where('whatsappServerCluster', '==', env.CLUSTER_SERVER_NAME)
        .onSnapshot(qSnap => {
            qSnap.docChanges().
                forEach(async change => {
                    const account = { id: change.doc.id, ...change.doc.data() } as SaasAccount
                    cb(account, change.type)
                })
        })
}