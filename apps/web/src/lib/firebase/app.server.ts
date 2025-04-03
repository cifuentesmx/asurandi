import { dev } from '$app/environment'
import { SECRET_FIREBASE_ADMIN_CLIENT_EMAIL, SECRET_FIREBASE_ADMIN_PRIVATE_KEY } from '$env/static/private'
import { PUBLIC_FIREBASE_CONNECT_EMULATORS, PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public'
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app'

const projectId = PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = SECRET_FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = SECRET_FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (!projectId || !clientEmail || !privateKey) {
    throw new Error('El Admin SDK de Firebase no está configurado.')
}

const adminConfig = {
    credential: cert({
        projectId,
        clientEmail,
        privateKey,
    }),
}
export const initializeAdminApp = () => {
    if (getApps().length) {
        return getApp()
    } else {
        if (dev && PUBLIC_FIREBASE_CONNECT_EMULATORS === "true") {
            console.info('Conectando emuladores para el Admin SDK...')
            process.env['FIRESTORE_EMULATOR_HOST'] = '127.0.0.1:8080'
            process.env['FIREBASE_AUTH_EMULATOR_HOST'] = '127.0.0.1:9099'
            process.env['FIREBASE_STORAGE_EMULATOR_HOST'] = '127.0.0.1:9199'
        }
        return initializeApp(adminConfig)
    }
}
