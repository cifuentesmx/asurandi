import type { PolizaStatus } from "@asurandi/types"
import { and, eq, sql, type InferSelectModel } from "drizzle-orm";
import { pgDb } from "$lib/db.js";
import { tblPolizaMovimientos, tblPolizas } from "@asurandi/database";

export const updatePolizaStatus = async ({
    saasId,
    polizaId,
    newStatus,
    userEmail
}: {
    saasId: string,
    polizaId: number,
    newStatus: PolizaStatus,
    userEmail: string

}): Promise<InferSelectModel<typeof tblPolizas>> => {
    const movimientos = {
        'Emitida': 'EMITIDA',
        'Pagada': 'PAGADA',
        'Por vencer': 'RENOVACION PRÓXIMA',
        'Cancelada': 'CANCELADA',
        'No renovada': 'NO RENOVADA',
        'Renovada': 'RENOVADA',

    }
    const statuses = [
        'Emitida',
        'Pagada',
        'Por vencer',
        'Cancelada',
        'No renovada',
        'Renovada'
    ] as (keyof typeof movimientos)[];

    if (!statuses.includes(newStatus)) throw new Error(`No se puede asignar el estatus: '${newStatus}' a la póliza '${polizaId}'`);


    return await pgDb.transaction(async (tx) => {
        const [updated] = await tx.update(tblPolizas).set({
            polizaEstatus: newStatus as PolizaStatus
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
            motivo: `Actualización manual (${userEmail})`,
            tipoMovimiento: movimientos[newStatus] as "EMITIDA" | "PAGADA" | "RENOVACION PRÓXIMA" | "CANCELADA" | "NO RENOVADA" | "RENOVADA" | null | undefined
        })
        return updated
    });


}