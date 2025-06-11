import { tblPolizas, tblRecibos, } from "@asurandi/database"
import { and, eq, InferSelectModel } from "drizzle-orm"
import { ScrappedAnasegurosPoliza } from "../scrapePoliza.js"
import { pgDb } from "../../database/db.js"
import { extractCleanNumber } from "../../utils/extractCleanNumber.js"

export const processRecibos = async (poliza: InferSelectModel<typeof tblPolizas>,
    scrappedPoliza: ScrappedAnasegurosPoliza) => {

    const recibos = scrappedPoliza.recibos

    if (!recibos) return

    for (const recibo of recibos) {
        const [existingRecibo] = await pgDb.select()
            .from(tblRecibos)
            .where(and(
                eq(tblRecibos.polizaId, poliza.id),
                eq(tblRecibos.numeroRecibo, recibo.recibo))
            )

        let estado: 'PENDIENTE' | 'PAGADO' | 'CANCELADO' | 'DESCONOCIDO' = 'DESCONOCIDO'
        if (recibo.estatusPago.toLocaleLowerCase() === 'pagado') {
            estado = 'PAGADO'
        } else if (recibo.estatusPago.toLocaleLowerCase() === 'sinpago') {
            estado = 'PENDIENTE'
        } else if (recibo.estatusPago.toLocaleLowerCase() === 'cancelado') {
            estado = 'CANCELADO'
        }

        console.log(recibo, estado, existingRecibo)

        if (existingRecibo &&
            (existingRecibo.estado === 'PENDIENTE' || existingRecibo.estado === 'DESCONOCIDO')) {
            await pgDb.update(tblRecibos).set({
                estado,
                vigenciaInicio: recibo.inicioVigencia ? recibo.inicioVigencia.split('/').reverse().join('-') : undefined,
            }).where(eq(tblRecibos.id, existingRecibo.id))
        } else if (!existingRecibo) {
            await pgDb.insert(tblRecibos).values({
                saasId: poliza.saasId,
                polizaId: poliza.id,
                numeroRecibo: recibo.recibo,
                serie: recibo.no,
                importe: extractCleanNumber(recibo.cantidad),
                vigenciaInicio: recibo.inicioVigencia ? recibo.inicioVigencia.split('/').reverse().join('-') : undefined,
                vigenciaFin: recibo.fechaAplicacion ? recibo.fechaAplicacion.split('/').reverse().join('-') : undefined,
                estado,
            })
        }

    }
}