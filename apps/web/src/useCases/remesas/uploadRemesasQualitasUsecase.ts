import * as fs from 'fs'
import * as XLSX from 'xlsx'
import { Readable } from 'stream'
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import { extractDateMMM } from '$lib/formatters/extractDate';
import { pgDb } from "$lib/db.js";
import { tblRemesas } from "@asurandi/database";
import { and, eq, isNotNull, isNull, or, sql, type InferInsertModel } from 'drizzle-orm';
import { getNumberString } from '$lib/formatters/extractNumbers';
import { tblPolizas, tblRecibos } from '@asurandi/database';


export const uploadRemesasQualitasUsecase = async (file: ArrayBuffer, saasId: string): Promise<void> => {
    XLSX.set_fs(fs)
    XLSX.stream.set_readable(Readable)
    XLSX.set_cptable(cpexcel)
    const workbook = XLSX.read(file)
    const parsed = (XLSX
        .utils
        .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { rawNumbers: true }) as {
            __EMPTY_1?: string
            __EMPTY_2?: string
            __EMPTY_3?: string
            __EMPTY_4?: string
            __EMPTY_5?: string
            __EMPTY_6?: string
            __EMPTY_7?: string
            __EMPTY_8?: string
            __EMPTY_9?: string
            __EMPTY_10?: string
            __EMPTY_11?: string
            __EMPTY_12?: string
            __EMPTY_13?: string
            __EMPTY_14?: string
            __EMPTY_15?: string
        }[])

    const filtered = parsed.filter((t) => {
        return t.__EMPTY_7 === 'ACR' || t.__EMPTY_7 === 'ACN'
    }).map(t => {
        return {
            "DIA": t.__EMPTY_1,
            "POLIZA": t.__EMPTY_2,
            "ENDOSO": t.__EMPTY_3,
            "RECIBO": t.__EMPTY_4,
            "SERIE": t.__EMPTY_5,
            "REMESA": t.__EMPTY_6,
            "CVE": t.__EMPTY_7,
            "CONCEPTO": t.__EMPTY_8,
            "IMPORTE": t.__EMPTY_9,
            "COMIS": t.__EMPTY_10,
            "CARGO": t.__EMPTY_14,
            "ABONO": t.__EMPTY_15,
        }
    })

    const periodo = parsed.filter(t => t.__EMPTY_1?.startsWith('PERIODO DEL'))
        ?.[0]
        ?.__EMPTY_1
        ?.replace('PERIODO DEL ', '')
        ?.split(' AL ')
        ?.map(d => {
            return extractDateMMM(d)
        })

    // Procesa las filas del excel de remesas
    for (let idx = 0; idx < filtered.length; idx++) {
        const row = filtered[idx];
        const fechaPago = periodo ? [periodo?.[0]?.split('-')[0], periodo?.[0]?.split('-')[1], row.DIA].join('-') : null

        // Obtiene la póliza:
        const [poliza] = await pgDb.select().from(tblPolizas).where(and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.companyId, 'qualitas'),
            eq(tblPolizas.esMaestra, true),
            eq(tblPolizas.numeroPoliza, row.POLIZA ?? ''),
        ))

        // Obtiene el recibo de pago
        const [recibo] = await pgDb.select().from(tblRecibos).where(
            and(
                eq(tblRecibos.saasId, saasId),
                eq(tblRecibos.numeroRecibo, row.RECIBO ?? '')
            ))

        // Ve si ya tiene el registro de la remesa a procesar.
        const [existingRemesa] = await pgDb
            .select()
            .from(tblRemesas)
            .where(
                and(
                    eq(tblRemesas.saasId, saasId),
                    eq(tblRemesas.numeroRecibo, row.RECIBO ?? ''),
                    eq(tblRemesas.numeroPoliza, row.POLIZA ?? ''),
                    eq(tblRemesas.remesa, row.REMESA ?? ''),
                    eq(tblRemesas.clave, row.CVE ?? '')
                )
            ).limit(1)

        const usRemesa: InferInsertModel<typeof tblRemesas> = {
            saasId,
            polizaId: poliza?.id,
            reciboId: recibo?.id,
            numeroRecibo: row.RECIBO,
            numeroPoliza: row.POLIZA,
            remesa: row.REMESA,
            clave: row.CVE,
            concepto: row.CONCEPTO,
            fechaPago,
            numeroEndoso: row.ENDOSO,
            abono: getNumberString(row.ENDOSO ?? '0'),
            cargo: getNumberString(row.CARGO ?? '0'),
            comision: getNumberString(row.COMIS ?? '0'),
            importe: getNumberString(row.IMPORTE ?? '0'),
            serie: row.SERIE,
            porcentajeComision: await getQualitasComision(saasId)
        }

        if (existingRemesa) {
            await pgDb.update(tblRemesas).set(usRemesa).where(eq(tblRemesas.id, existingRemesa.id)).returning()
        } else {
            await pgDb.insert(tblRemesas).values(usRemesa).returning()
        }

    }

    // encuentra remesas sin póliza o comision asociada
    const qryPolizas = pgDb
        .select({
            id: tblPolizas.id
        })
        .from(tblPolizas)
        .where(and(
            eq(tblPolizas.numeroPoliza, tblRemesas.numeroPoliza),
            eq(tblPolizas.esMaestra, true),
        ));

    await pgDb
        .update(tblRemesas)
        .set({
            polizaId: sql`(${qryPolizas})`,
            porcentajeComision: await getQualitasComision(saasId),
        })
        .where(
            or(
                isNull(tblRemesas.polizaId),
                isNull(tblRemesas.porcentajeComision)
            )
        );

    // aplica las comisiones
    await pgDb.update(tblRemesas).set(
        {
            contabilizado: new Date(),
            comisionConducto: sql`comision * porcentaje_comision`
        }
    ).where(
        and(
            eq(tblRemesas.saasId, saasId),
            isNull(tblRemesas.contabilizado),
            isNotNull(tblRemesas.porcentajeComision),
            isNotNull(tblRemesas.polizaId),
        )
    )
    return

}

export async function getQualitasComision(saasId: string) {
    // TODO generalizar comisión
    return saasId ? '0.80' : '0.80'
}