import { eq } from "drizzle-orm"
import { pgDb } from "../../pg-service/db.js"
import { tblTipoEndoso } from "@asurandi/database"

export const getTipoEndoso = async (tipo: string): Promise<number> => {
    const str = tipo.toLocaleUpperCase().trim().replace('\n', ' ')
    let [tipoendoso] = await pgDb.select().from(tblTipoEndoso).where(eq(tblTipoEndoso.tipoEndoso, str))
    if (!tipoendoso) [tipoendoso] = await pgDb.insert(tblTipoEndoso).values({ tipoEndoso: str })
        .returning()
        .catch(async () => {
            return await pgDb.select().from(tblTipoEndoso).where(eq(tblTipoEndoso.tipoEndoso, str))
        })
    return tipoendoso.id
}