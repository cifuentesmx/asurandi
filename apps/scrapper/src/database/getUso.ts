import { eq, InferSelectModel } from "drizzle-orm"
import { pgDb } from "./db.js"
import { tblUsos } from "@asurandi/database"

export const getUso = async (serialData: { key: string, value: string }[] | string): Promise<InferSelectModel<typeof tblUsos> | null> => {
    const usoStr = typeof serialData === 'string' ? serialData.toLocaleUpperCase().trim() : serialData.find(t => t.key === 'Uso')?.value?.trim()?.toLocaleUpperCase() ?? 'N/A'
    const [uso] = await pgDb.select().from(tblUsos).where(eq(tblUsos.uso, usoStr)).limit(1)
    if (uso) return uso
    const [newUso] = await pgDb.insert(tblUsos).values({ uso: usoStr }).returning().catch(async () => {
        return await pgDb.select().from(tblUsos).where(eq(tblUsos.uso, usoStr)).limit(1)
    })
    return newUso ?? null
}