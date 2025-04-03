import { bigint, date, integer, numeric, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { tblTipoEndoso } from './tipoEndoso.js';

export const tblEndosos = pgTable('endosos', {
    id: serial('id').primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    polizaId: bigint('poliza_id', { mode: 'number' }),
    endoso: varchar('endoso'),
    fechaVencimiento: date('fecha_vencimiento'),
    numeroRecibo: varchar('numero_recibo', { length: 20 }),
    remesa: varchar('remesa'),
    fechaPago: date('fecha_pago'),
    fechaRegistroPago: date('fecha_registro_pago'),
    importe: numeric('importe', { scale: 2, precision: 12 }),
    estado: varchar('estado'),
    tipoEndosoId: integer('tipoendoso_id').references(() => tblTipoEndoso.id),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
});
 