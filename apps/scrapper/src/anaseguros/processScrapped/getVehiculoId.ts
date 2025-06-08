import { and, eq } from "drizzle-orm"
import { DataFromPdf } from "./extactDataFromPdf.js"
import { tblTipoVehiculos, tblVehiculos } from "@asurandi/database"
import { pgDb } from "database/db.js";

export const getVehiculoId = async (
    vehiculo: DataFromPdf['incisos'][string][number]['vehiculo'],
    saasId: string): Promise<number> => {
    if (!vehiculo || !vehiculo.serie || !vehiculo.descripcion) throw new Error("No se encontró el vehículo para extraer los datos");

    const [existing] = await pgDb.select().from(tblVehiculos).where(and(
        eq(tblVehiculos.saasId, saasId),
        eq(tblVehiculos.serie, vehiculo.serie)
    ))
    if (existing) return existing.id


    let [tipoVehiculo] = await pgDb.select().from(tblTipoVehiculos).where(eq(tblTipoVehiculos.tipovehiculo, vehiculo.tipo ?? 'N/A'))
    if (!tipoVehiculo) {
        [tipoVehiculo] = await pgDb.insert(tblTipoVehiculos)
            .values({ tipovehiculo: vehiculo.tipo ?? 'N/A' })
            .returning()
            .catch(async () =>
                [tipoVehiculo] = await pgDb.select().from(tblTipoVehiculos).where(eq(tblTipoVehiculos.tipovehiculo, vehiculo.tipo ?? 'N/A'))
            )

    }

    const ocupantes = Number(vehiculo.ocupantes)
    const [newVehiculo] = await pgDb.insert(tblVehiculos).values({
        saasId,
        serie: vehiculo.serie,
        nombre: `${vehiculo.descripcion} Modelo: ${vehiculo.modelo ?? 'N/A'}`,
        color: vehiculo.color,
        motor: vehiculo.motor,
        placas: vehiculo.placas,
        ocupantes: Number.isNaN(ocupantes) ? null : ocupantes,
        tipovehiculoId: tipoVehiculo.id ?? null
    }).returning()
    return newVehiculo.id
}