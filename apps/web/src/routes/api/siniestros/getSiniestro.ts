import { and, eq } from "drizzle-orm"
import { pgDb } from "$lib/db.js"
import { tblAgentes, tblAsegurados, tblConductos, tblPolizas, tblSiniestroCausas, tblSiniestros, tblVehiculos } from "@asurandi/database"


export type GetSiniestro = Awaited<ReturnType<typeof getSiniestro>>
export const getSiniestro = async ({ saasId, id }: {
    saasId: string
    id: number
}) => {
    const [siniestro] = await pgDb.select({
        id: tblSiniestros.id,
        causa: tblSiniestroCausas.causa,
        agente: tblAgentes.nombre,
        conducto: tblConductos.nombre,
        siniestro: tblSiniestros.numeroSiniestro,
        fechaSiniestro: tblSiniestros.fechaSiniestro,
        horaSiniestro: tblSiniestros.horaSiniestro,
        fechaCierre: tblSiniestros.fechaCierre,
        montoEstimado: tblSiniestros.montoEstimado,
        montoActualizado: tblSiniestros.montoActualizado,
        montoFinal: tblSiniestros.montoFinal,
        polizaId: tblPolizas.id,
        vehiculo: tblVehiculos.nombre,
        numeroSerie: tblVehiculos.serie,
        asegurado: tblAsegurados.nombre,
        numeroPoliza: tblPolizas.numeroPoliza,
        detalles: tblSiniestros.detalle,
        actividades: tblSiniestros.actividades,
        fechaReporte: tblSiniestros.fechaReporte,
        horaReporte: tblSiniestros.horaReporte,
        updated: tblSiniestros.updated,
        numeroReporte: tblSiniestros.numeroReporte,
        enSeguimiento: tblSiniestros.enSeguimiento,
    })
        .from(tblSiniestros)
        .leftJoin(tblPolizas, eq(tblPolizas.id, tblSiniestros.polizaId))
        .leftJoin(tblSiniestroCausas, eq(tblSiniestroCausas.id, tblSiniestros.causaId))
        .leftJoin(tblConductos, eq(tblConductos.id, tblSiniestros.conductoId))
        .leftJoin(tblAgentes, eq(tblAgentes.id, tblSiniestros.agenteId))
        .leftJoin(tblVehiculos, eq(tblVehiculos.id, tblSiniestros.vehiculoId))
        .leftJoin(tblAsegurados, eq(tblAsegurados.id, tblSiniestros.aseguradoId))
        .where(
            and(
                eq(tblSiniestros.saasId, saasId),
                eq(tblSiniestros.id, id),
            )
        )

    return siniestro
}