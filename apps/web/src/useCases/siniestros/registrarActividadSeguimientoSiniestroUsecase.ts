import { and, eq } from "drizzle-orm"
import { pgDb } from "$lib/db.js"
import { tblSiniestros } from "@asurandi/database"
import { AppError } from "$lib/ApplicationError"
import type { PublicFileUrl, SiniestroActividad } from "@asurandi/types"

type Args = {
    urls: PublicFileUrl[]
    siniestroId: number,
    saasId: string
    comentario: string
    user: string
}
export const registrarActividadSeguimientoSiniestroUseCase = async ({
    urls, siniestroId, saasId, user, comentario
}: Args): Promise<SiniestroActividad> => {
    const [siniestro] = await pgDb.select().from(tblSiniestros).where(
        and(
            eq(tblSiniestros.saasId, saasId),
            eq(tblSiniestros.id, siniestroId),
        )
    ).limit(1)

    if (!siniestro) throw new AppError("No se ha podido encontrar un siniestro");

    const actividad: SiniestroActividad = {
        timestamp: Date.now(),
        tipoActividad: 'Status',
        user,
        comentario,
        files: urls
    }

    await pgDb.update(tblSiniestros).set({
        actividades: siniestro.actividades ? [actividad, ...siniestro.actividades] : [actividad],
        updated: new Date()
    }).where(eq(tblSiniestros.id, siniestro.id))
    return actividad
}