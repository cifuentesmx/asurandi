import { initializeAdminApp } from "$lib/firebase/app.server";
import { getAuth } from "firebase-admin/auth";
import type { AuthedUser } from "@asurandi/types";

export async function getAuthedUser(uid: string): Promise<AuthedUser | null> {
    try {
        const admin = initializeAdminApp()
        const auth = getAuth(admin);
        return await auth.getUser(uid)
    } catch (err) {
        console.error(err)
        return null
    }
}