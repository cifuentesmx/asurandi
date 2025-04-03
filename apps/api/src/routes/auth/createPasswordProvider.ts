import { pgDb } from "@/lib/db.js";
import { AppError } from "@/lib/AppError.js";
import { initializeAdminApp } from "@/lib/firebase.server.js"
import { eq } from "drizzle-orm";
import { getAuth } from 'firebase-admin/auth';
import { tblAgentes, tblConductos } from "@asurandi/database";

type ArgParams = {
    name: string,
    password: string,
    email: string,
}
export const createPasswordProvider = async (params: ArgParams): Promise<boolean> => {
    const app = initializeAdminApp()
    const auth = getAuth(app)
    const user = await auth.getUserByEmail(params.email)
    if (!user) throw new AppError('No se ha encontrado al usuario que quiere actualizar.')
    await auth.updateUser(user.uid, {
        displayName: params.name,
        password: params.password
    })
    await pgDb.update(tblAgentes)
        .set({ uid: user.uid })
        .where(eq(tblAgentes.email, params.email))
    await pgDb.update(tblConductos)
        .set({ uid: user.uid })
        .where(eq(tblConductos.email, params.email))

    return true
}