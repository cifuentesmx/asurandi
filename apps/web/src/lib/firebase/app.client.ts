import {
    PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_APP_ID,
    PUBLIC_FIREBASE_AUTH_DOMAIN,
    // PUBLIC_FIREBASE_MEASUREMENT_ID,
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    PUBLIC_FIREBASE_PROJECT_ID,
    PUBLIC_FIREBASE_STORAGE_BUCKET,
    PUBLIC_FIREBASE_CONNECT_EMULATORS,
    PUBLIC_FIREBASE_EMULATOR_HOST,
} from '$env/static/public'



import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { dev } from '$app/environment'
import { getAuth, connectAuthEmulator } from 'firebase/auth'


export function getFirebaseClientApp() {

    try {
        if (getApps().length > 0) return getApp()
        initializeApp({
            apiKey: PUBLIC_FIREBASE_API_KEY,
            appId: PUBLIC_FIREBASE_APP_ID,
            authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
            messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            projectId: PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
        })

        return getApp()

    } catch (error) {
        console.error(error)
        console.error('// TODO unified handle error')
        return undefined
    }
}

export const db = getFirestore(getFirebaseClientApp() || getApp())
export const storage = getStorage(getFirebaseClientApp() || getApp())
export const functions = getFunctions(getFirebaseClientApp() || getApp())
export const auth = getAuth(getFirebaseClientApp() || getApp())



if (dev && PUBLIC_FIREBASE_CONNECT_EMULATORS === 'true') {
    try {
        connectAuthEmulator(auth, `http://${PUBLIC_FIREBASE_EMULATOR_HOST}:9099`, { disableWarnings: false })
        connectFirestoreEmulator(db, PUBLIC_FIREBASE_EMULATOR_HOST, 8080)
        connectStorageEmulator(storage, PUBLIC_FIREBASE_EMULATOR_HOST, 9199)
        connectFunctionsEmulator(functions, PUBLIC_FIREBASE_EMULATOR_HOST, 5001)
    } catch (error) {
        console.error(error)
        console.error('// TODO unified handle error')
    }
}

