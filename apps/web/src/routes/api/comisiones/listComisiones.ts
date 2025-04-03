import { and, between, eq, isNotNull, sql, sum, } from "drizzle-orm"

import { tblAgentes, tblConductos, tblPolizas, tblRemesas, } from "@asurandi/database"
import { pgDb } from "$lib/db.js"

export type ListComisiones = Awaited<ReturnType<typeof listComisiones>>

export const listComisiones = async ({
    saasId,
    filters,
}: {
    saasId: string
    limit?: number
    offset?: number
    filters: string
}) => {

    let f
    const conditions = [
        eq(tblRemesas.saasId, saasId),
        isNotNull(tblRemesas.contabilizado),
        // isNotNull(tblPolizas.conductoId),
    ]
    try {
        f = JSON.parse(filters)

    } catch {
        f = {}
    }

    if (f.fechaPago && f.fechaPago.start && f.fechaPago.end) {
        const startDate = new Date(
            f.fechaPago.start.year,
            f.fechaPago.start.month - 1,
            f.fechaPago.start.day
        );
        const endDate = new Date(
            f.fechaPago.end.year,
            f.fechaPago.end.month - 1,
            f.fechaPago.end.day
        );
        conditions.push(
            between(tblRemesas.fechaPago, startDate.toISOString(), endDate.toISOString())
        )
    } else {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = fecha.getMonth();

        const primerDia = new Date(año, mes, 1);
        const ultimoDia = new Date(año, mes + 1, 0);
        conditions.push(
            between(tblRemesas.fechaPago, primerDia.toISOString(), ultimoDia.toISOString())
        )

    }

    const sel = {
        id: sql`concat(agentes.id, '-', conductos.id)`,
        agenteId: tblAgentes.id,
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        conductoId: tblConductos.id,
        comisionConducto: sum(tblRemesas.comisionConducto),
        prima: sum(tblRemesas.importe),
    }
    const polizas = await pgDb.select(sel)
        .from(tblRemesas)
        .leftJoin(tblPolizas, eq(tblRemesas.polizaId, tblPolizas.id))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .groupBy(tblAgentes.id, tblAgentes.nombre, tblConductos.nombre, tblConductos.id)
        .where(
            and(
                ...conditions
            )
        )
        .orderBy(tblConductos.nombre, tblAgentes.nombre)
    const total = { count: polizas.length }


    return { data: polizas, total }
}
