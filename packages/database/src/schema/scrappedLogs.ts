import { bigserial, index, jsonb, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';



import { tblCompanias } from './companias.js';

export const tblScrappedLogs = pgTable('scrapped_logs', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    companyId: varchar('company_id').references(() => tblCompanias.id),
    accion: varchar('accion', { enum: ['daily', 'estado-cuenta', 'poliza'] }),
    key: varchar('key'),
    messages: jsonb('messages').default([]).$type<string[]>(),
    status: varchar('status', { enum: ['Started', 'In Progress', 'Ok', 'Errored'] }),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
    updated: timestamp('updated', { mode: 'date' }).defaultNow(),
}
    , (t) => [

         index('accion_key').on(t.saasId, t.companyId, t.accion, t.key),
    ]
        
);

