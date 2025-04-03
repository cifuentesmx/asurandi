import { and, eq, sql, type InferSelectModel } from "drizzle-orm";
import { pgDb } from "$lib/db.js";
import { tblPolizaMovimientos, tblPolizaOrigen, tblPolizas } from "@asurandi/database";
import { AppError } from "$lib/ApplicationError";

export const updatePolizaOrigen = async ({
    saasId,
    polizaId,
    origenId,
    userEmail,
}: {
    saasId: string,
    polizaId: number,
    origenId: number,
    userEmail: string
}): Promise<InferSelectModel<typeof tblPolizas>> => {
    const [origen] = await pgDb.select().from(tblPolizaOrigen).where(eq(tblPolizaOrigen.id, origenId))
    if (!origen) throw new AppError("No se pudo obtener el origen que desea establecer.");
    return await pgDb.transaction(async (tx) => {
        const [updated] = await tx.update(tblPolizas).set({
            origenId
        }).where(and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.id, polizaId)
        )).returning()
        await tx.insert(tblPolizaMovimientos).values({
            agenteId: updated.agenteId,
            aseguradoId: updated.asegurado_id,
            companyId: updated.companyId,
            conductoId: updated.conductoId,
            fechaMovimiento: sql`now()`,
            numeroPoliza: updated.numeroPoliza,
            saasId,
            vehiculoId: updated.vehiculoId,
            polizaId,
            motivo: `Actualización origen "${origen.origen}" (${userEmail})`,
            tipoMovimiento: 'CAMBIO'
        })
        return updated
    });
}