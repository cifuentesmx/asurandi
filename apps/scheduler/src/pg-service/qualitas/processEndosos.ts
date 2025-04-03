import { and, eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { tblEndosos, tblPolizas } from "@asurandi/database";
import { QualitasScrappedPolizaEstatusEndoso } from "@asurandi/types";
import { pgDb } from "../../pg-service/db.js";
import { getFechaRecibos } from "./getFechaEmision.js";
import { getNumberString } from "./getNumber.js";
import { getTipoEndoso } from "./getTipoEndoso.js";

export const processQualitasScrappedEndosos = async (poliza: InferSelectModel<typeof tblPolizas>, endosos: QualitasScrappedPolizaEstatusEndoso[]): Promise<void> => {
    endosos.forEach(async e => {
        const tipoEndosoId = await getTipoEndoso(e.tipo_movimiento)
        let [existing] = await pgDb.select().from(tblEndosos).where(
            and(
                eq(tblEndosos.endoso, e.endoso),
                eq(tblEndosos.polizaId, poliza.id),
                eq(tblEndosos.numeroRecibo, e.num_recibo)
            )
        )
        const [fpago, frpago] = e.fecha_pago.split(' F.R.P. ')
        const usEndoso: InferInsertModel<typeof tblEndosos> = {
            endoso: e.endoso,
            fechaPago: getFechaRecibos(fpago),
            fechaRegistroPago: getFechaRecibos(frpago),
            fechaVencimiento: getFechaRecibos(e.fecha_vencimiento),
            importe: getNumberString(e.importe),
            polizaId: poliza.id,
            numeroRecibo: e.num_recibo,
            remesa: e.remesa,
            saasId: poliza.saasId,
            estado: e.estado,
            tipoEndosoId,
        }
        if (existing?.id) {
            [existing] = await pgDb.update(tblEndosos).set(usEndoso).where(eq(tblEndosos.id, existing.id)).returning()
        } else {
            [existing] = await pgDb.insert(tblEndosos).values(usEndoso).returning()
        }
    });
    return
}