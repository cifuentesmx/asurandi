import { bigint, bigserial, date, index, numeric, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { tblPolizas } from './polizas.js';
import { tblCompanias } from './companias.js';

export  const tblCobros = pgTable('cobros', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    polizaId: bigint('poliza_id', { mode: 'number' }).references(() => tblPolizas.id),
    numeroPoliza: varchar('numero_poliza'),
    endoso: varchar('endoso', { length: 40 }),
    fechaVencimiento: date('fecha_vencimiento'),
    fechaLimite: date('fecha_limite'),
    estado: varchar('estado', { enum: ['PENDIENTE', 'PAGADA', 'VENCIDA', 'CANCELADA'] }).default('PENDIENTE'),
    company: varchar('company_id').references(() => tblCompanias.id),
    serie: varchar('serie', { length: 40 }),
    numeroRecibo: varchar('numero_recibo', { length: 40 }),
    importe: numeric('importe', { scale: 2, precision: 12 }),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
}
    , (t) => {
        return [
            index('cobro_estado_vencimiento_poliza').on(t.saasId, t.estado, t.fechaVencimiento, t.numeroPoliza),
            index('cobro_company_numero_poliza_recibo_endoso_serie').on(t.saasId, t.company, t.numeroPoliza, t.numeroRecibo, t.endoso, t.serie)
        ]

    }
);

