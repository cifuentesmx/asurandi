import { eq } from "drizzle-orm";
import { pgDb } from "../../pg-service/db.js";
import { tblSiniestroCausas } from "@asurandi/database";

export const getCausaId = async (causa: string): Promise<number> => {
    causa = causa.replace(/^[^a-zA-Z]+/, '').trim().toLocaleUpperCase();
    let [causadb] = await pgDb.select().from(tblSiniestroCausas).where(eq(tblSiniestroCausas.causa, causa)).limit(1)

    if (!causadb) [causadb] = await pgDb.insert(tblSiniestroCausas).values({ causa }).returning().catch(async () => {
        return await pgDb.select().from(tblSiniestroCausas).where(eq(tblSiniestroCausas.causa, causa)).limit(1)
    })
    return causadb.id
}