import { getAuth } from "firebase-admin/auth";
import { initializeAdminApp } from "$lib/firebase/app.server";

export const createSessionCookie = async (uid: string) => {
    const EXPIRATION_TIME_IN_SECONDS = 60 * 60 * 12;
    const admin = initializeAdminApp();
    const auth = getAuth(admin);
    const cookieToken = await auth.createSessionCookie(uid, { expiresIn: 1000 * EXPIRATION_TIME_IN_SECONDS }).catch((error) => {
        console.error(error);
    });
    const cookie = `saas_lotus_session=${cookieToken}; path=/; Secure; HttpOnly; SameSite=Strict; Expires=${EXPIRATION_TIME_IN_SECONDS}`
    return cookie;
}