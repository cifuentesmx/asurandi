import { eq, InferSelectModel } from "drizzle-orm"
import { pgDb } from "../db.js"
import { tblTipoVehiculos } from "@asurandi/database"

export const gettipoVehiculo = async (tipo: string): Promise<InferSelectModel<typeof tblTipoVehiculos>> => {
    const [tipoVehiculo] = await pgDb.select().from(tblTipoVehiculos).where(eq(tblTipoVehiculos.tipovehiculo, tipo.toLocaleUpperCase()))

    if (tipoVehiculo) return tipoVehiculo

    const [newVehiculo] = await pgDb.insert(tblTipoVehiculos).values({ tipovehiculo: tipo.toLocaleUpperCase() }).returning()
        .catch(async () => {
            return await pgDb.select().from(tblTipoVehiculos).where(eq(tblTipoVehiculos.tipovehiculo, tipo.toLocaleUpperCase()))
        })
    return newVehiculo

}