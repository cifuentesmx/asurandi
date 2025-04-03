import { eq, InferSelectModel } from "drizzle-orm"
import { pgDb } from "../db.js"
import { tblSubRamos } from "@asurandi/database"

export const getSubRamoId = async (serialData: ({ key: string, value: string }[] | string)): Promise<InferSelectModel<typeof tblSubRamos>> => {

    const subramo = typeof serialData === 'string' ? serialData : serialData.find(t => t.key === 'Tipo')?.value ?? 'Desconocido'

    const [subramos] = await pgDb.select().from(tblSubRamos).where(eq(tblSubRamos.subramo, subramo.trim().toLocaleUpperCase())).limit(1)
    if (!subramos) {
        return (await pgDb.insert(tblSubRamos).values({ subramo: subramo.trim().toLocaleUpperCase() }).returning().catch(async () => {
            return await pgDb.select().from(tblSubRamos).where(eq(tblSubRamos.subramo, subramo.trim().toLocaleUpperCase())).limit(1)
        }))?.[0] ?? null
    } else
        return subramos
}