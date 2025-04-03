import { and, eq, InferSelectModel, or } from "drizzle-orm";
import { tblVehiculos } from "@asurandi/database";
import { pgDb } from "../../pg-service/db.js";
import { gettipoVehiculo } from "./getTipoVehiculo.js";
import { getNumberString } from "./getNumber.js";

export const getVehiculo = async (data: { key: string, value: string }[], saasId: string, existingId?: number): Promise<InferSelectModel<typeof tblVehiculos> | null> => {
    const ocupantesStr = data.find(t => t.key === 'Ocupantes')?.value?.trim() ?? getNumberString(data.find(t => t.value.startsWith('PASAJEROS'))?.value?.trim() ?? '')

    const tipoVehiculo = await gettipoVehiculo(data.find(t => t.key === 'Tipo')?.value?.trim() ?? 'Desconocido')
    const serie = data.find(t => t.key === 'Número de serie')?.value?.trim()
    if (!serie) return null

    // Cuando el vehículo ya está registrado en poliza anterior
    if (existingId) {
        const [vehiculo] = await pgDb.update(tblVehiculos)
            .set({
                saasId,
                serie,
                nombre: data.find(t => t.key === 'Descripción del vehículo')?.value?.trim() ?? 'No disponible',
                carroceria: data.find(t => t.key === 'Carrocería')?.value?.trim(),
                color: data.find(t => t.key === 'Color')?.value?.trim(),
                ocupantes: ocupantesStr ? Number(ocupantesStr) : undefined,
                motor: data.find(t => t.key === 'Número de motor')?.value?.trim(),
                placas: data.find(t => t.key === 'Placas')?.value?.trim(),
                tipovehiculoId: tipoVehiculo.id,
            })
            .where(or(
                eq(tblVehiculos.id, existingId),
                and(
                    eq(tblVehiculos.serie, serie),
                    eq(tblVehiculos.saasId, saasId)
                )

            )).returning()
        if (vehiculo) return vehiculo
    }

    // si en vehiculo ya existia en la DB. pero no estaba asociado a la poliza (poliza nueva)
    const [existingVehiculo] = await pgDb.update(tblVehiculos).set({
        saasId,
        serie,
        nombre: data.find(t => t.key === 'Descripción del vehículo')?.value?.trim() ?? 'No disponible',
        carroceria: data.find(t => t.key === 'Carrocería')?.value?.trim(),
        color: data.find(t => t.key === 'Color')?.value?.trim(),
        ocupantes: ocupantesStr ? Number(ocupantesStr) : undefined,
        motor: data.find(t => t.key === 'Número de motor')?.value?.trim(),
        placas: data.find(t => t.key === 'Placas')?.value?.trim(),
        tipovehiculoId: tipoVehiculo.id,
    }).where(
        and(
            eq(tblVehiculos.serie, serie),
            eq(tblVehiculos.saasId, saasId)
        )
    ).returning()

    if (existingVehiculo) return existingVehiculo

    // Inserta el vehiculo
    const [vehiculo] = await pgDb.insert(tblVehiculos).values({
        saasId,
        serie,
        nombre: data.find(t => t.key === 'Descripción del vehículo')?.value?.trim() ?? 'No disponible',
        carroceria: data.find(t => t.key === 'Carrocería')?.value?.trim(),
        color: data.find(t => t.key === 'Color')?.value?.trim(),
        ocupantes: ocupantesStr ? Number(ocupantesStr) : undefined,
        motor: data.find(t => t.key === 'Número de motor')?.value?.trim(),
        placas: data.find(t => t.key === 'Placas')?.value?.trim(),
        tipovehiculoId: tipoVehiculo.id,
    }).returning()
        .catch(async () => {
            return await pgDb.select().from(tblVehiculos)
                .where(
                    and(
                        eq(tblVehiculos.serie, serie),
                        eq(tblVehiculos.saasId, saasId)
                    )
                )
        })

    return vehiculo ?? null

}