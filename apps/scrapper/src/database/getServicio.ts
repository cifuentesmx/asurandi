import { eq, InferSelectModel } from "drizzle-orm"
import { pgDb } from "./db.js"
import { tblServicios } from "@asurandi/database"

export const getServicio = async (serialData: { key: string, value: string }[] | string): Promise<InferSelectModel<typeof tblServicios> | null> => {
    const servicioStr = typeof serialData === 'string' ? serialData : serialData.find(t => t.key === 'Servicio')?.value?.trim()?.toLocaleUpperCase() ?? 'N/A'
    if (!servicioStr) return null
    const [servicio] = await pgDb.select().from(tblServicios).where(eq(tblServicios.servicio, servicioStr)).limit(1)
    if (servicio) return servicio
    const [newServicio] = await pgDb.insert(tblServicios)
        .values({ servicio: servicioStr })
        .returning()
        .catch(async () => {
            return await pgDb.select().from(tblServicios).where(eq(tblServicios.servicio, servicioStr)).limit(1)
        })
    return newServicio ?? null
}