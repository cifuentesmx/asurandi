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
export const cerrarSiniestroUseCase = async ({
    urls, siniestroId, saasId, user, comentario
}: Args): Promise<SiniestroActividad> => {
    const [siniestro] = await pgDb.select().from(tblSiniestros).where(
        and(
            eq(tblSiniestros.saasId, saasId),
            eq(tblSiniestros.id, siniestroId),
        )
    ).limit(1)

    if (!siniestro) throw new AppError("No se ha podido encontrar un siniestro");
    if (siniestro.fechaCierre) throw new AppError("El siniestro ya se ha cerrado con anterioridad");
    if (!comentario) throw new AppError('Es necesario agregar un comentario de cierre.')

    const actividad: SiniestroActividad = {
        timestamp: Date.now(),
        tipoActividad: 'Cierre',
        user,
        comentario,
        files: urls,
    }

    await pgDb.update(tblSiniestros).set({
        actividades: siniestro.actividades ? [...siniestro.actividades, actividad] : [actividad],
        enSeguimiento: false,
        fechaCierre: new Date().toISOString(),
        updated: new Date()
    }).where(eq(tblSiniestros.id, siniestro.id))
    return actividad
}