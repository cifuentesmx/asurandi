import { and, eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { QualitasScrappedPolizaSiniestro } from "@asurandi/types";
import { tblSiniestros, tblPolizas } from "@asurandi/database";
import { pgDb } from "../db.js";
import { getCausaId } from "./getCausaId.js";
import { getText } from "./getText.js";
import { getFechaRecibos } from "./getFechaEmision.js";

export const processQualitasScrappedSiniestros = async (poliza: InferSelectModel<typeof tblPolizas>,
    siniestros: QualitasScrappedPolizaSiniestro[]): Promise<void> => {
    const vehiculoId = poliza.vehiculoId

    siniestros.forEach(async siniestro => {
        if (!siniestro.numero_reporte) return
        let [existing] = await pgDb.select().from(tblSiniestros).where(
            and(
                eq(tblSiniestros.saasId, poliza.saasId ?? ''),
                eq(tblSiniestros.numeroReporte, siniestro.numero_reporte),
                eq(tblSiniestros.companyId, 'qualitas'),
            )
        )

        if (!vehiculoId) throw new Error("No se encuentra el identificador del vehículo");

        const usSiniestro: InferInsertModel<typeof tblSiniestros> = {
            vehiculoId,
            agenteId: poliza.agenteId,
            aseguradoId: poliza.asegurado_id,
            causaId: await getCausaId(siniestro.causa ?? 'DESCONOCIDA'),
            codigoPostal: getText(siniestro.detalle, 'Entidad')?.split(' ')?.[0],
            companyId: poliza.companyId,
            conductoId: poliza.conductoId,
            fechaReporte: getFechaRecibos(siniestro.fecha_reporte),
            horaReporte: siniestro.hora,
            fechaSiniestro: getFechaRecibos(siniestro.fecha_ocurrido),
            horaSiniestro: siniestro.hora_ocurrido,
            numeroSiniestro: siniestro.numero_siniestro,
            polizaId: poliza.id,
            saasId: poliza.saasId,
            polizaPrimaneta: poliza.primaNeta,
            numeroReporte: siniestro.numero_reporte,
            detalle: {
                fechaReporte: getFechaRecibos(siniestro.fecha_reporte) ?? 'N.A.',
                colonia: getText(siniestro.detalle, 'Colonia'),
                causa: getText(siniestro.detalle, 'Causa'),
                comentarios: getText(siniestro.detalle, 'Comentarios'),
                telefono: getText(siniestro.detalle, 'Teléfono'),
                ubicacion: getText(siniestro.detalle, 'Ubicación'),
                conductor: getText(siniestro.detalle, 'Nombre del conductor'),
                ajustador: {
                    llegada: getText(siniestro.ajustador, 'Fecha y hora de llegada'),
                    termino: getText(siniestro.ajustador, 'Fecha y hora de término'),
                    nombre: getText(siniestro.ajustador, 'Nombre'),
                },
                involucrados: siniestro.involucrados
            }
        }


        if (existing) {
            [existing] = await pgDb.update(tblSiniestros).set(usSiniestro).where(eq(tblSiniestros.id, existing.id)).returning()
        } else {
            [existing] = await pgDb.insert(tblSiniestros).values(usSiniestro).returning()
        }

    });

}