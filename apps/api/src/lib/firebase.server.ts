import env, { dev } from '../env.js'
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app'

const projectId = env.FIREBASE_PROJECT_ID
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

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
        if (dev && env.FIREBASE_CONNECT_EMULATORS) {
            console.info('Conectando emuladores para el Admin SDK...')
            process.env['FIRESTORE_EMULATOR_HOST'] = `${env.FIREBASE_EMULATORS_HOST}:8080`
            process.env['FIREBASE_AUTH_EMULATOR_HOST'] = `${env.FIREBASE_EMULATORS_HOST}:9099`
            process.env['FIREBASE_STORAGE_EMULATOR_HOST'] = `${env.FIREBASE_EMULATORS_HOST}:9199`
        }
        return initializeApp(adminConfig)
    }
}
