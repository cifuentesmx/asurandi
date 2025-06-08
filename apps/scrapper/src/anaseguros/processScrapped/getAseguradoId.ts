import { tblAsegurados } from "@asurandi/database"
import { type DataFromPdf } from "./extactDataFromPdf.js"
import { pgDb } from "database/db.js"
import { and, eq } from "drizzle-orm"

export const getAseguradoId = async (data: DataFromPdf, saasId: string): Promise<number | null> => {
    const asegurado = data.asegurado
    if (!asegurado) throw new Error("No se recibieron los datos del asegurado");

    const [existingAsegurado] = await pgDb.select().from(tblAsegurados).where(and(
        eq(tblAsegurados.saasId, saasId),
        eq(tblAsegurados.anaId, asegurado.id ?? '')
    ))
    if (existingAsegurado) return existingAsegurado.id

    const [newAsegurado] = await pgDb.insert(tblAsegurados).values({
        nombre: asegurado.nombre ?? '',
        rfc: asegurado.rfc ?? '',
        anaId: asegurado.id ?? '',
        direccion: asegurado.domicilio ?? null,
        saasId,
    }).returning()

    return newAsegurado.id
}