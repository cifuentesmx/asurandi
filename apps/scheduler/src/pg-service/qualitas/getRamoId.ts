import { eq } from "drizzle-orm"
import { pgDb } from "../../pg-service/db.js"
import { tblRamos } from "@asurandi/database"

export const getRamoId = async (): Promise<number> => {
    const [ramo] = await pgDb.select().from(tblRamos).where(eq(tblRamos.ramo, 'Autos')).limit(1)
    if (!ramo) {
        return (await pgDb.insert(tblRamos).values({ ramo: 'Autos' }).returning()
            .catch(async () => {
                return await pgDb.select().from(tblRamos).where(eq(tblRamos.ramo, 'Autos')).limit(1)
            })
        )?.[0]?.id ?? null
    } else
        return ramo.id
}