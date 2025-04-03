import { and, between, eq, isNotNull, isNull, sql, } from "drizzle-orm"

import { tblAgentes, tblConductos, tblModoPagos, tblPolizas, tblRemesas, } from "@asurandi/database"
import { pgDb } from "$lib/db.js"




export type ListComisionesDetalles = Awaited<ReturnType<typeof listComisionesDetalles>>


export const listComisionesDetalles = async ({
    saasId,
    filters = '{}',
    conductoId,
    agenteId
}: {
    saasId: string
    filters?: string
    conductoId?: number,
    agenteId: number
}) => {

    let f
    const conditions = [
        eq(tblRemesas.saasId, saasId),
        eq(tblPolizas.agenteId, agenteId),
        isNotNull(tblRemesas.contabilizado)
    ]
    if (typeof conductoId === 'number' && !Number.isNaN(conductoId) && conductoId !== 0) {
        conditions.push(eq(tblPolizas.conductoId, conductoId))
    } else {
        conditions.push(isNull(tblPolizas.conductoId))
    }

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
        polizaId: tblRemesas.polizaId,
        recibo: tblRemesas.numeroRecibo,
        clave: tblRemesas.clave,
        poliza: tblRemesas.numeroPoliza,
        importe: tblRemesas.importe,
        comisionRemesa: tblRemesas.comision,
        contabilizado: tblRemesas.contabilizado,
        concepto: tblRemesas.concepto,
        porcentajeComision: tblRemesas.porcentajeComision,
        comisionConducto: tblRemesas.comisionConducto,
        fechaPago: tblRemesas.fechaPago,
    }
    const polizas = await pgDb.select(sel)
        .from(tblRemesas)
        .leftJoin(tblPolizas, eq(tblRemesas.polizaId, tblPolizas.id))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblPolizas.agenteId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblPolizas.conductoId))
        .leftJoin(tblModoPagos, eq(tblModoPagos.id, tblPolizas.modoPagoId))
        .where(
            and(
                ...conditions
            )
        )
        .orderBy(tblConductos.nombre, tblAgentes.nombre, tblRemesas.fechaPago, tblRemesas.numeroRecibo, tblRemesas.clave)

    return {
        data: polizas.map(p => {
            let porcentajeComision = parseFloat(p.comisionConducto ?? '0') / parseFloat(p.importe ?? '1')
            if (porcentajeComision > 0.072 && porcentajeComision < 0.083) porcentajeComision = 8
            else if (porcentajeComision > 0.06 && porcentajeComision < 0.07) porcentajeComision = 6.4
            else porcentajeComision = 0
            return { ...p, porcentajeComision }
        })
    }
}
