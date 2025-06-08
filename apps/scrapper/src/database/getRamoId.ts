import { eq } from "drizzle-orm"
import { pgDb } from "./db.js"
import { tblRamos } from "@asurandi/database"

export const getRamoId = async (ramoStr: string = 'Autos'): Promise<number> => {
    let [ramo] = await pgDb.select().from(tblRamos).where(eq(tblRamos.ramo, ramoStr)).limit(1)
    if (ramo && ramo.id) return ramo.id
    const [newRamo] = await pgDb.insert(tblRamos).values({ ramo: ramoStr }).returning()
        .catch(async () => {
            const retry = await pgDb.select().from(tblRamos).where(eq(tblRamos.ramo, 'Autos')).limit(1)
            return retry
        })
    return newRamo.id
}