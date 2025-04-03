import {
    bigint, bigserial, date,
    index,
    // index, numeric,
    pgTable, timestamp, varchar
} from 'drizzle-orm/pg-core';

import { tblPolizas } from './polizas.js';
import { tblCompanias } from './companias.js';

export const tblRenovaciones = pgTable('renovaciones', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    polizaId: bigint('poliza_id', { mode: 'number' }).references(() => tblPolizas.id),
    numeroPoliza: varchar('numero_poliza'),
    fechaVencimiento: date('fecha_vencimiento'),
    estado: varchar('estado', { enum: ['PENDIENTE', 'NO RENOVADA', 'RENOVADA',] }).default('PENDIENTE'),
    company: varchar('company_id').references(() => tblCompanias.id),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
}
    , (t) => [
        index('renovacion_estado_vencimiento_poliza').on(t.saasId, t.estado, t.company, t.fechaVencimiento, t.numeroPoliza),
        index('renovacion_poliza').on(t.saasId, t.company, t.numeroPoliza)

    ]

);

