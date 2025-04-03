import { bigint, bigserial, date, index, numeric, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { tblPolizas } from './polizas.js';

export const tblRecibos = pgTable('recibos', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    polizaId: bigint('poliza_id', { mode: 'number' }).references(() => tblPolizas.id),
    numeroRecibo: varchar('numero_recibo', { length: 20 }),
    serie: varchar('serie', { length: 20 }),
    folio: varchar('folio', { length: 20 }),
    serieEmision: varchar('serie_emision', { length: 20 }),
    importe: numeric('importe', { scale: 2, precision: 12 }),
    primaNetaComision: numeric('prima_neta_comision', { scale: 2, precision: 12 }),
    vigenciaInicio: date('vigencia_inicio'),
    vigenciaFin: date('vigencia_fin'),
    estado: varchar('estado', { enum: ['PAGADO', 'PENDIENTE', 'CANCELADO', 'DESCONOCIDO',] }).default('DESCONOCIDO'),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
}, (t) =>
    [
        index('recibo_status_id').on(t.saasId, t.estado, t.vigenciaInicio, t.vigenciaFin)
    ]

);

