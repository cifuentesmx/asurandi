import { and, eq, sql } from "drizzle-orm"
import { pgDb } from "$lib/db.js"
import { aseguradosToContactos, tblAsegurados, tblContactos, tblPolizaMovimientos, tblPolizas } from "@asurandi/database"

export const assignQualitasAgenteConductoUsecase = async ({
    saasId, agenteId, conductoId, numeroPoliza, userEmail }: {
        saasId: string,
        agenteId: number,
        conductoId: number,
        numeroPoliza: string,
        polizaId: number,
        userEmail: string
    }) => {
    await pgDb.transaction(async tx => {
        const polizas = await tx.update(tblPolizas).set({
            agenteId,
            conductoId,
        }).where(and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.numeroPoliza, numeroPoliza)
        )).returning()
        for (let idx = 0; idx < polizas.length; idx++) {
            const updated = polizas[idx];

            // const cta = await tx.update(aseguradosToContactos).set({
            //     agenteId,
            //     conductoId,
            // })
            //     .where(eq(aseguradosToContactos.aseguradoId, updated.asegurado_id))
            //     .returning()

            const cta = await tx.select().from(aseguradosToContactos)
                .where(eq(aseguradosToContactos.aseguradoId, updated.asegurado_id))

            for (let idx = 0; idx < cta.length; idx++) {
                const ctaItem = cta[idx];
                const updatedContacto = await tx.update(tblContactos).set({
                    agenteId,
                    conductoId,
                }).where(eq(tblContactos.id, ctaItem.contactoId))
                    .returning()
                console.log({ updatedContacto })
            }

            await tx.insert(tblPolizaMovimientos).values({
                agenteId: updated.agenteId,
                aseguradoId: updated.asegurado_id,
                companyId: updated.companyId,
                conductoId: updated.conductoId,
                fechaMovimiento: sql`now()`,
                numeroPoliza: updated.numeroPoliza,
                saasId,
                vehiculoId: updated.vehiculoId,
                polizaId: updated.id,
                motivo: `Actualización Agente-Conducto (${userEmail})`,
                tipoMovimiento: 'CAMBIO'
            })
        }
        return polizas

    })

}