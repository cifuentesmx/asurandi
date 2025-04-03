import { and, eq } from "drizzle-orm"
import { pgDb } from "$lib/db.js"
import { tblSiniestros } from "@asurandi/database"
import { AppError } from "$lib/ApplicationError"

type Args = {
    saasId: string
    siniestroId: number,
    enSeguimiento: boolean
}
export const toggleSeguimientoUsecase = async ({
    siniestroId, saasId, enSeguimiento
}: Args) => {
    let [siniestro] = await pgDb.select().from(tblSiniestros).where(
        and(
            eq(tblSiniestros.saasId, saasId),
            eq(tblSiniestros.id, siniestroId),
        )
    ).limit(1)

    if (!siniestro) throw new AppError("No se ha podido encontrar un siniestro");
    if (siniestro.fechaCierre) throw new AppError("El siniestro ya se ha cerrado con anterioridad");

    [siniestro] = await pgDb.update(tblSiniestros).set({
        updated: new Date(),
        enSeguimiento
    }).where(eq(tblSiniestros.id, siniestro.id))
    return siniestro
}