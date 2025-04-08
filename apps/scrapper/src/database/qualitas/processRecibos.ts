import { and, eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { tblCobros, tblPolizas, tblRecibos } from "@asurandi/database";
import { ScrappedPolizaRecibos } from "@asurandi/types";
import { pgDb } from "../db.js";
import { getNumberString } from "./getNumber.js";
import { getVigenciaRecibo } from "./getVigenciaRecibos.js";
import { getReciboEstado } from "./getReciboEstado.js";

export const processQualitasScrappedRecibos = async (poliza: InferSelectModel<typeof tblPolizas>, recibos: ScrappedPolizaRecibos): Promise<void> => {
    recibos.forEach(async recibo => {
        if (recibo.numero_recibo === '__ERROR__' ||
            recibo.estado === '__ERROR__' ||
            recibo.folio === '__ERROR__'
        ) return

        // Busca el registro del recibo y lo actualiza
        let [existing] = await pgDb.select()
            .from(tblRecibos)
            .where(and(
                eq(tblRecibos.numeroRecibo, recibo.numero_recibo),
                eq(tblRecibos.polizaId, poliza?.id)
            ))

        const [vigenciaInicio, vigenciaFin] = getVigenciaRecibo(recibo.vigencia)

        const usRecibo: InferInsertModel<typeof tblRecibos> = {
            folio: recibo.folio,
            importe: getNumberString(recibo.importe_total),
            numeroRecibo: recibo.numero_recibo,
            polizaId: poliza.id,
            saasId: poliza.saasId,
            serie: recibo.serie,
            serieEmision: recibo.serie_emision,
            vigenciaFin,
            vigenciaInicio,
            estado: getReciboEstado(recibo.estado)
        }

        if (existing) {
            [existing] = await pgDb.update(tblRecibos).set(usRecibo).where(eq(tblRecibos.id, existing.id)).returning()
        } else {
            [existing] = await pgDb.insert(tblRecibos).values(usRecibo).returning()
        }

        // actualiza la cobranza
        if (existing.numeroRecibo && existing.saasId && existing.polizaId && existing.estado) {
            if (existing.estado === 'DESCONOCIDO') return

            let estado: "PENDIENTE" | "PAGADA" | "VENCIDA" | 'CANCELADA' | null = null
            if (existing.estado === 'CANCELADO') estado = 'CANCELADA'
            if (existing.estado === 'PAGADO') estado = 'PAGADA'
            if (existing.estado === 'PENDIENTE') estado = 'PENDIENTE'

            if (!estado) return
            await pgDb.update(tblCobros).set({
                estado: estado,
            }).where(
                and(
                    eq(tblCobros.saasId, existing.saasId),
                    eq(tblCobros.polizaId, existing.polizaId),
                    eq(tblCobros.numeroRecibo, existing.numeroRecibo),
                )
            )
        }
    })
    return
}