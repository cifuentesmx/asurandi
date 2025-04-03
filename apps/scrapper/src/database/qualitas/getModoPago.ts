import { eq, InferSelectModel } from "drizzle-orm"
import { pgDb } from "../db.js"
import { tblModoPagos } from "@asurandi/database"

export const getModoPago = async (serialData: { key: string, value: string }[]): Promise<InferSelectModel<typeof tblModoPagos> | null> => {
    const modoPagoStr = serialData.find(t => t.key === 'Modalidad de pago')?.value?.trim()?.toLocaleUpperCase()
    if (!modoPagoStr) return null
    const [modoPago] = await pgDb.select().from(tblModoPagos).where(eq(tblModoPagos.modoPago, modoPagoStr)).limit(1)
    if (modoPago) return modoPago
    const [newModoPago] = await pgDb.insert(tblModoPagos).values({ modoPago: modoPagoStr }).returning().catch(async () => {
        return await pgDb.select().from(tblModoPagos).where(eq(tblModoPagos.modoPago, modoPagoStr)).limit(1)
    })
    return newModoPago ?? null
}