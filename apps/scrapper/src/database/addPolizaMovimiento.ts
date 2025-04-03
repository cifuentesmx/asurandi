import {
    and, eq,
    InferInsertModel
} from "drizzle-orm"
import { pgDb } from "./db.js"
import {
    tblPolizaMovimientos,
    tblPolizas
} from "@asurandi/database"

type PolizaMovimientosParams = {
    numeroPoliza: string,
    saasId: string,
    fechaMovimiento: string
    motivo: string
    tipoMovimiento: 'CANCELADA' | 'EMITIDA' | 'NO RENOVADA' | 'PAGADA' | 'RENOVACION PRÓXIMA' | 'RENOVADA'
}
export const addPolizaMovimiento = async ({ numeroPoliza, saasId, fechaMovimiento, motivo, tipoMovimiento }: PolizaMovimientosParams): Promise<void> => {
    await pgDb.transaction(async tx => {
        const [poliza] = await tx.select().from(tblPolizas).where(and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.numeroPoliza, numeroPoliza),
            eq(tblPolizas.esMaestra, true)
        ))

        if (!poliza) throw new Error("No se encontró la póliza para registrar el movimiento.");


        const [movimiento] = await pgDb.select().from(tblPolizaMovimientos)
            .where(
                and(
                    eq(tblPolizaMovimientos.saasId, saasId),
                    eq(tblPolizaMovimientos.polizaId, poliza.id),
                    eq(tblPolizaMovimientos.tipoMovimiento, tipoMovimiento),
                    eq(tblPolizaMovimientos.fechaMovimiento, fechaMovimiento)
                )
            )
        const usMovimiento: InferInsertModel<typeof tblPolizaMovimientos> = {
            id: movimiento?.id ?? undefined,
            agenteId: poliza.agenteId,
            conductoId: poliza.conductoId,
            aseguradoId: poliza.asegurado_id,
            companyId: poliza.companyId,
            fechaMovimiento: fechaMovimiento,
            motivo,
            polizaId: poliza.id,
            saasId,
            tipoMovimiento,
            numeroPoliza: poliza.numeroPoliza,
            vehiculoId: poliza.vehiculoId,
        }
        if (!movimiento) {
            await tx.insert(tblPolizaMovimientos).values(usMovimiento)
        } else {
            await tx.update(tblPolizaMovimientos).set(usMovimiento)
                .where(eq(tblPolizaMovimientos.id, movimiento.id))
        }
    })
}