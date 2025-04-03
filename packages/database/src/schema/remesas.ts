import { bigint, bigserial, date, index, numeric, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tblRemesas = pgTable('remesas', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    polizaId: bigint('poliza_id', { mode: 'number' }),
    reciboId: bigint('recibo_id', { mode: 'number' }),
    numeroRecibo: varchar('numero_recibo', { length: 20 }),
    numeroPoliza: varchar('numero_poliza', { length: 20 }),
    numeroEndoso: varchar('numero_endoso', { length: 20 }),
    serie: varchar('serie', { length: 20 }),
    remesa: varchar('remesa', { length: 20 }),
    clave: varchar('clave', { length: 5 }),
    concepto: varchar('concepto'),
    fechaPago: date('fecha_pago'),
    importe: numeric('importe', { scale: 2, precision: 12 }),
    comision: numeric('comision', { scale: 2, precision: 9 }),
    cargo: numeric('cargo', { scale: 2, precision: 12 }),
    abono: numeric('abono', { scale: 2, precision: 12 }),
    contabilizado: timestamp('contabilizado', { mode: 'date' }),
    porcentajeComision: numeric('porcentaje_comision', { scale: 2, precision: 5 }),
    comisionConducto: numeric('comision_conducto', { scale: 2, precision: 12 }),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
}, (rem) =>

    [
        index('remesa_search_idx')
            .on(
                rem.saasId,
                rem.numeroRecibo,
                rem.numeroPoliza,
                rem.remesa,
                rem.clave,
            ),
    ]
);
